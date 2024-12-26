import { createSlice } from "@reduxjs/toolkit";
import { fetchCourses, fetchUserCourses, searchUserCourses } from "../actions/courseAction";

const initialState = {
  isCourseLoading: false,
  isCourseMappingDataLoading: false,
  isLoading:false,
  isSuccess: false,
  isError: "",
  courseData: {},
  courseMappingData:{}
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseMappingData:(state,action)=>{
      state.courseMappingData = action?.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserCourses lifecycle method
      .addCase(fetchUserCourses.pending, (state, action) => {
        state.isCourseLoading = true;
        state.isSuccess = false;
        state.isError = "";
      })
      .addCase(fetchUserCourses.fulfilled, (state, action) => {
        state.isCourseLoading = false;
        state.isSuccess = true;
        state.courseData = action.payload;
        state.isError = "";
      })
      .addCase(fetchUserCourses.rejected, (state, action) => {
        state.isCourseLoading = false;
        state.isSuccess = false;
        state.isError = action.payload;
      })

      // searchUserCourses lifecycle method
      .addCase(searchUserCourses.pending, (state, action) => {
        state.isCourseMappingDataLoading = true;
        state.isError = "";
      })
      .addCase(searchUserCourses.fulfilled, (state, action) => {
        state.isCourseMappingDataLoading = false;
        state.courseMappingData = action.payload;
        state.isError = "";
      })
      .addCase(searchUserCourses.rejected, (state, action) => {
        state.isCourseMappingDataLoading = false;
        state.isError = action.payload;
      })
  },
});

export const {setCourseMappingData} = courseSlice.actions;

export default courseSlice.reducer;
