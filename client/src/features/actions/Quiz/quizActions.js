import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";

export const generateResult = createAsyncThunk(
  "/quiz/generateResult",
  async ({ payload, chapterId, videoId }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        "/result/generateResult",
        { payload, chapterId, videoId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let decryptData = crypto.AES.decrypt(
        response?.data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      console.log("this is the decrypted data", JSON.parse(decryptedData));
      return { ...response?.data, data: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
