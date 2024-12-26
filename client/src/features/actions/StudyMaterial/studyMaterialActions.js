// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// generateStudyMaterialResult - generateStudyMaterialResult action to call the generateStudyMaterialResult api
export const generateStudyMaterialResult = createAsyncThunk(
  `/studyMaterial/generateStudyMaterialResult`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/pdfQuizzes/generateStudyMaterialResult`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      let decryptData = crypto.AES.decrypt(
        response?.data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      return { ...response?.data, data: JSON.parse(decryptedData) };
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
