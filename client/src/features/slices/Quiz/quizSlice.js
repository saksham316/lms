import { createSlice } from "@reduxjs/toolkit";
import { generateResult } from "../../actions/Quiz/quizActions";

const initialState = {
  quizResult: [],
  isQuizResultLoading: false,
  isResultAdded: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    resetQuizStatus: (state, action) => {
      state.isResultAdded = action.payload;
    },
    resetResultData: (state, action) => {
      state.quizResult = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // generateResult -- handling the generateResult lifecycle methods
      .addCase(generateResult.pending, (state, action) => {
        state.isQuizResultLoading = true;
        state.isResultAdded = false;
      })
      .addCase(generateResult.fulfilled, (state, action) => {
        state.isQuizResultLoading = false;
        state.isResultAdded = true;

        state.quizResult = action?.payload;
      })
      .addCase(generateResult.rejected, (state, action) => {
        state.isQuizResultLoading = false;
        state.isResultAdded = false;
      });
  },
});

export default quizSlice.reducer;
export const { resetQuizStatus, resetResultData } = quizSlice.actions;
