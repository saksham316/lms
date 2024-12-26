import { createSlice } from "@reduxjs/toolkit";
import {
  deleteQuiz,
  handleQuizPost,
  updateQuiz,
} from "../../actions/Quiz/quizAction";
import { toast } from "react-toastify";

const initialState = {
  isQuizLoading: false,
  quizData: [],
  errorMessage: "",
  isQuizAdded: false,
  isQuizDeleted: false,
  isQuizUpdated: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    resetQuizAddStatus: (state, action) => {
      state.isQuizAdded = action?.payload;
    },
    resetQuizStatus: (state, action) => {
      state.isQuizAdded = action?.payload;
      state.isQuizUpdated = action?.payload;
      state.isQuizDeleted = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleQuizPost.pending, (state, action) => {
        state.isQuizLoading = true;
        state.isQuizAdded = false;
      })
      .addCase(handleQuizPost.fulfilled, (state, action) => {
        state.isQuizLoading = false;
        state.quizData = action.payload;
        state.isQuizAdded = true;

        toast.success("Quiz added successfully", { position: "top-center" });
      })
      .addCase(handleQuizPost.rejected, (state, action) => {
        state.isQuizLoading = false;
        state.errorMessage = action.payload;
        state.isQuizAdded = false;

        toast.error("Failed to add Quiz data", { position: "top-center" });
      })

      // update quiz lifecycle methods
      .addCase(updateQuiz.pending, (state, action) => {
        state.isQuizLoading = true;
        state.isQuizUpdated = false;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.isQuizLoading = false;
        state.isQuizUpdated = true;

        toast.success("Quiz Updated successfully", { position: "top-center" });
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isQuizLoading = false;
        state.errorMessage = action.payload;
        state.isQuizUpdated = false;

        toast.error("Failed to Update Quiz data", { position: "top-center" });
      })
      // delete quiz lifecycle methods
      .addCase(deleteQuiz.pending, (state, action) => {
        state.isQuizLoading = true;
        state.isQuizDeleted = false;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.isQuizLoading = false;
        state.isQuizDeleted = true;

        toast.success("Quiz Deleted successfully", { position: "top-center" });
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.isQuizLoading = false;
        state.errorMessage = action.payload;
        state.isQuizDeleted = false;

        toast.error("Failed to Delete Quiz", { position: "top-center" });
      });
  },
});

export default quizSlice.reducer;
export const { resetQuizAddStatus, resetQuizStatus } = quizSlice.actions;
