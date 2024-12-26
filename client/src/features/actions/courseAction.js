import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
import crypto from "crypto-js";

// -----------------------------------------------------------------------------------------------------
// ---------------------------------------------Functions----------------------------------------------
const decrypter = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let decryptData = crypto.AES.decrypt(
        data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      let decryptCategories = crypto.AES.decrypt(
        data?.categories,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedCategories = crypto.enc.Utf8.stringify(decryptCategories);

      return resolve({
        ...data,
        data: JSON.parse(decryptedData),
        categories: JSON.parse(decryptedCategories),
      });
    } catch (error) {
      return reject(error);
    }
  });
};

// -----------------------------------------------------------------------------------------------------

export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.get("/course/fetchCourses", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserCourses = createAsyncThunk(
  "course/fetchUserCourses",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/course/fetchUserCourses${
          payload && payload !== undefined && payload?.length > 0
            ? `?${payload}`
            : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const decryptedData = await decrypter(response?.data);
      return decryptedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const searchUserCourses = createAsyncThunk(
  "course/searchUserCourses",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/course/fetchUserCourses${`?${payload}`}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const decryptedData = await decrypter(response?.data);
      return decryptedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
