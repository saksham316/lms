// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import { updateChapter } from "../../actions/Chapter/chapterActions";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isChapterLoading: false,
  errorMessage: "",
  isChapterUpdated: false,
};

//   Chapter Slices

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    resetChapterUpdateStatus: (state, action) => {
      state.isChapterUpdated = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Chapter lifecycle methods
      .addCase(updateChapter.pending, (state, action) => {
        state.isChapterLoading = true;
        state.errorMessage = "";
        state.isChapterUpdated = false;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.isChapterLoading = false;
        state.isChapterUpdated = true;
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.isChapterLoading = false;
        state.errorMessage = action.payload;
      })
  },
});

export default chapterSlice.reducer;
export const {
  resetChapterUpdateStatus,
} = chapterSlice.actions;
