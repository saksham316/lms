import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";

export const handleQuizPost = createAsyncThunk(
  "quiz/handleQuizPost",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post(`/quiz/addQuiz`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch(`/quiz/updateQuiz/${id}`, {
        payload,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async ({id}, { rejectWithValue }) => {
    try {
      const {data} = await instance.delete(`/quiz/deleteQuiz/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
