// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import {
  addChapter,
  deleteChapter,
  updateChapter,
} from "../../actions/Chapter/chapterActions";
import { toast } from "react-toastify";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isChapterLoading: false,
  errorMessage: "",
  chapterData: [],
  isChapterAdded: false,
  isChapterUpdated: false,
  isChapterDeleted:false
};

//   Chapter Slices

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    resetChapterState: (state, action) => {
      state.isChapterAdded = false;
    },
    resetChapterData: (state, action) => {
      state.chapterData = [];
    },
    resetChapterUpdateStatus: (state, action) => {
      state.isChapterUpdated = action?.payload;
    },
    resetChapterDeleteStatus:(state,action)=>{
      state.isChapterDeleted = action?.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Chapter lifecycle methods
      .addCase(addChapter.pending, (state, action) => {
        state.isChapterLoading = true;
        state.errorMessage = "";
        state.isChapterAdded = false;
      })
      .addCase(addChapter.fulfilled, (state, action) => {
        state.isChapterLoading = false;
        state.chapterData = [...state.chapterData, action?.payload?.data];
        state.isChapterAdded = true;
        toast.success(`Chapter Added Successfully`, {
          position: "top-center",
        });
      })
      .addCase(addChapter.rejected, (state, action) => {
        state.isChapterLoading = false;
        state.errorMessage = action.payload;

        // toast.error(action.payload, { position: "top-center" });
      })
      // Update Chapter lifecycle methods
      .addCase(updateChapter.pending, (state, action) => {
        state.isChapterLoading = true;
        state.errorMessage = "";
        state.isChapterAdded = false;
        state.isChapterUpdated = false;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.isChapterLoading = false;
        state.isChapterAdded = false;
        state.isChapterUpdated = true;
        toast.success(`Chapter Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.isChapterLoading = false;
        state.errorMessage = action.payload;

        toast.error(action.payload, { position: "top-center" });
      })
      // Delete Chapter lifecycle methods
      .addCase(deleteChapter.pending, (state, action) => {
        state.isChapterLoading = true;
        state.errorMessage = "";
        state.isChapterDeleted = false;

      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.isChapterLoading = false;
        state.errorMessage = "";
        state.isChapterDeleted = true;
        toast.success(`Chapter Deleted Successfully`, {
          position: "top-center",
        });
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.isChapterLoading = false;
        state.errorMessage = action.payload;
        state.isChapterDeleted = false;
        toast.error(action.payload, { position: "top-center" });
      })
  },
});

export default chapterSlice.reducer;
export const { resetChapterState, resetChapterData, resetChapterUpdateStatus,resetChapterDeleteStatus } =
  chapterSlice.actions;
