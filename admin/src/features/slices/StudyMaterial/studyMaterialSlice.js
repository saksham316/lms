import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  addPdfQuiz,
  deletePdfQuiz,
  getPdfQuizzes,
  updatePdfQuiz,
} from "../../actions/StudyMaterial/studyMaterialActions";

// --------------------------------------------------------------------------------------------------------
const initialState = {
  isLoading: false,
  studyMaterialData: [],
  errorMessage: "",
  isStudyMaterialAdded: false,
  isStudyMaterialDeleted: false,
  isStudyMaterialUpdated: false,
};

const studyMaterialSlice = createSlice({
  name: "studyMaterial",
  initialState,
  reducers: {
    resetStudyMaterialStatus: (state, action) => {
      state.isStudyMaterialAdded = action?.payload;
      state.isStudyMaterialUpdated = action?.payload;
      state.isStudyMaterialDeleted = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // addPdfQuiz lifecycle actions
      .addCase(addPdfQuiz.pending, (state, action) => {
        state.isLoading = true;
        state.isStudyMaterialAdded = false;
      })
      .addCase(addPdfQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isStudyMaterialAdded = true;

        toast.success("Study Material added successfully", {
          position: "top-center",
        });
      })
      .addCase(addPdfQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isStudyMaterialAdded = false;

        toast.error("Failed to add Quiz data", { position: "top-center" });
      })

      // getPdfQuizzes lifecycle actions
      .addCase(getPdfQuizzes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPdfQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studyMaterialData = action?.payload;
      })
      .addCase(getPdfQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;

        toast.error("Failed to fetch the study material", {
          position: "top-center",
        });
      })
      // updatePdfQuiz lifecycle actions
      .addCase(updatePdfQuiz.pending, (state, action) => {
        state.isLoading = true;
        state.isStudyMaterialUpdated = false;
      })
      .addCase(updatePdfQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isStudyMaterialUpdated = true;
        toast.success("Study Material updated successfully", {
          position: "top-center",
        });
      })
      .addCase(updatePdfQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isStudyMaterialUpdated = false;

        toast.error("Failed to update the study material", {
          position: "top-center",
        });
      })
      // deletePdfQuiz lifecycle actions
      .addCase(deletePdfQuiz.pending, (state, action) => {
        state.isLoading = true;
        state.isStudyMaterialDeleted = false;
      })
      .addCase(deletePdfQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isStudyMaterialDeleted = true;
        toast.success("Study Material deleted successfully", {
          position: "top-center",
        });
      })
      .addCase(deletePdfQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isStudyMaterialDeleted = false;

        toast.error("Failed to delete the study material", {
          position: "top-center",
        });
      });
  },
});

export default studyMaterialSlice.reducer;
export const { resetStudyMaterialStatus } = studyMaterialSlice.actions;
