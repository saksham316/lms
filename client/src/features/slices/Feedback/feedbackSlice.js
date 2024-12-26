import { createSlice } from "@reduxjs/toolkit";
import { sendFeedback } from "../../actions/Feedback/feedbackActions";


const initialState = {
  feedback: {},
  isLoading: false,
  isFeedbackSent: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers:{
    resetFeedbackStatus:(state,action)=>{
      state.isFeedbackSent = action.payload
    }
  },
  extraReducers: (builder) => {
    builder

      // generateResult -- handling the generateResult lifecycle methods
      .addCase(sendFeedback.pending, (state, action) => {
        state.isLoading = true;
        state.isFeedbackSent = false;
      })
      .addCase(sendFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFeedbackSent = true;

        state.feedback = action?.payload;
      })
      .addCase(sendFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isFeedbackSent = false;
      });
  },
});

export default feedbackSlice.reducer;
export const { resetFeedbackStatus} = feedbackSlice.actions;
