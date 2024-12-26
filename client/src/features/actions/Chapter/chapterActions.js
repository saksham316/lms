// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

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
