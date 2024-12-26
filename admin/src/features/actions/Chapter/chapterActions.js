// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// addChapter - addChapter action to call the addChapter api
export const addChapter = createAsyncThunk(
  "chapter/addChapter",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/chapter/addChapter", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      let decryptData = crypto.AES.decrypt(
        response?.data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      return { ...response?.data, data: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// updateChapter - updateChapter action to call the updateChapter api
export const updateChapter = createAsyncThunk(
  `chapter/updateChapter`,
  async ({ payload, chapterId }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/chapter/updateChapter/${chapterId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// deleteChapter -- deleteChapter action to call the deleteChapter api
export const deleteChapter = createAsyncThunk(
  "course/deleteChapter",
  async ({ chapterId }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/chapter/deleteChapter/${chapterId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
