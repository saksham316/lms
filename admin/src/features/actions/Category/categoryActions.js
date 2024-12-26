// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// createCategory -- createCategory action to call the createCategory api
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/category", payload, {
        withCredentials: true,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// updateCategory -- updateCategory action to call the updateCategory api
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryName }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/category/${id}`,
        { categoryName },
        {
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// deleteCategory -- deleteCategory action to call the deleteCategory api
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/category/${id}`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// fetchCategories -- fetchCategories action to call the fetch category api
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get("/category", {
        withCredentials: true,
      });

      let decryptData = crypto.AES.decrypt(
        response?.data?.categoryData,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      let decryptedData = crypto.enc.Utf8.stringify(decryptData);

      return { ...response?.data, categoryData: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
