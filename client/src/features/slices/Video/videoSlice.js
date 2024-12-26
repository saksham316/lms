import { createSlice } from "@reduxjs/toolkit";
import {  addVideoStatus, getAllStatus} from "../../actions/Video/videoActions";

const initialState = {
  isLoading: false,
  isVideoStatusAdded: false,
  isError: "",
  courseStatus:{}
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    resetVideoStatus:(state,action)=>{
      state.isVideoStatusAdded = action?.payload;
    }
  },
  extraReducers: (builder) => {
    builder

      // lifecycle methods of the addVideoStatus api
      .addCase(addVideoStatus.pending, (state, action) => {
        state.isLoading = true;
        state.isVideoStatusAdded = false;
        state.isError = "";
      })
      .addCase(addVideoStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVideoStatusAdded = true;
        state.isError = "";
      })
      .addCase(addVideoStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isVideoStatusAdded = false;
        state.isError = action.payload;
      })

      // lifecycle methods of the addVideoStatus api
      .addCase(getAllStatus.pending, (state, action) => {
        state.isLoading = true;
        state.isError = "";
      })
      .addCase(getAllStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = "";
        state.courseStatus = action?.payload;
      })
      .addCase(getAllStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
  },
});

export const {resetVideoStatus} = videoSlice.actions;

export default videoSlice.reducer;
