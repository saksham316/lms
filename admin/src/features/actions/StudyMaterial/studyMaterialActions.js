// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import { toast } from "react-toastify";
import crypto from "crypto-js";

// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// addPdfQuiz -- action to call the addPdfQuiz api and returning the respective response
export const addPdfQuiz = createAsyncThunk(
  "studyMaterial/addPdfQuiz",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("pdfQuizzes/addPdfQuiz", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// updatePdfQuiz -- action to call the updatePdfQuiz api and returning the respective response
export const updatePdfQuiz = createAsyncThunk(
  "studyMaterial/updatePdfQuiz",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `pdfQuizzes/updatePdfQuiz/${id}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// getPdfQuizzes -- action to call the getPdfQuizzes api and returning the respective response
export const getPdfQuizzes = createAsyncThunk(
  "studyMaterial/getPdfQuizzes",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get("pdfQuizzes/getPdfQuizzes", payload, {
        withCredentials: true,
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

// deletePdfQuiz -- action to call the deletePdfQuiz api and returning the respective response
export const deletePdfQuiz = createAsyncThunk(
  "studyMaterial/deletePdfQuiz",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/pdfQuizzes/deletePdfQuiz/${id}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
