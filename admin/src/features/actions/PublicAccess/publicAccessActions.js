// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// makePublic -- makePublic action to call the makePublic api
export const makePublic = createAsyncThunk(
  "publicAccess/makePublic",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get("/mediaController/makePublic", {
        withCredentials: true,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
