// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// addVideoStatus - addVideoStatus action to call the addVideoStatus api
export const addVideoStatus = createAsyncThunk(
  `video/addVideoStatus`,
  async ({ courseId, chapterId, videoId }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/completionStatus/addVideoStatus`,
        { courseId, chapterId, videoId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:true
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


// getAllStatus - getAllStatus action to call the getAllStatus api
export const getAllStatus = createAsyncThunk(
  `video/getAllStatus`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/completionStatus/getAllStatus`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:true
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
