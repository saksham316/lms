// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";
// -----------------------------------------------------------------------------------
// --------------------------------------Functions------------------------------------
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// getMetaData -- getMetaData action to call the getMetaData api
export const getMetaData = createAsyncThunk(
  "metaData/getMetaData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/userMetaData/getAllStatus?toSearch=${payload}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
