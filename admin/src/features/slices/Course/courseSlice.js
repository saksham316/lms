// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import {
  addCourse,
  updateCourse,
  fetchCourses,
  deleteCourse,
  searchCourses,
  fetchChaptersData,
  searchChapters,
  fetchQuizzesData,
  searchQuizzes,
} from "../../actions/Course/courseActions";
import { toast } from "react-toastify";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  courseData: [],
  courseId: "",
  isCourseAdded: false,
  isCourseUpdated: false,
  isCourseDeleted: false,
  chapterMappingData: [],
  quizMappingData: [],
};

//   Course Slices

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetCourseState: (state, action) => {
      state.isCourseUpdated = false;
    },
    resetCourseAddState: (state, action) => {
      state.isCourseAdded = false;
    },
    resetCourseDeleteStatus: (state, action) => {
      state.isCourseDeleted = action.payload;
    },
    setChapterData: (state, action) => {
      state.chapterMappingData = action.payload;
    },
    setQuizData: (state, action) => {
      state.quizMappingData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Course lifecycle methods
      .addCase(addCourse.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.courseId = "";
        state.isCourseAdded = false;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseId = action?.payload?.data?._id;
        state.isCourseAdded = true;
        toast.success(`Course Added Successfully`, {
          position: "top-center",
        });
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isCourseAdded = false;

        // toast.error(action.payload, { position: "top-center" });
      })
      // Update Course lifecycle methods
      .addCase(updateCourse.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isCourseAdded = false;
        state.isCourseUpdated = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseId = "";
        state.isCourseAdded = false;
        state.isCourseUpdated = true;
        toast.success(`Course Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isCourseUpdated = false;
        state.isCourseAdded = false;
        state.courseData = [];

        // toast.error(action.payload, { position: "top-center" });
      })
      // Fetch Course lifecycle methods
      .addCase(fetchCourses.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.courseData = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.courseData = [];
        toast.error(action.payload, { position: "top-center" });
      })
      // Delete Course lifecycle methods
      .addCase(deleteCourse.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isCourseDeleted = false;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isCourseDeleted = true;
        toast.success(`Course Deleted Successfully`, {
          position: "top-center",
        });
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isCourseDeleted = false;
        toast.error(action.payload, { position: "top-center" });
      })
      // Search Courses lifecycle methods
      .addCase(searchCourses.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.courseData = [];
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.courseData = action.payload;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      // Search Chapters lifecycle methods
      .addCase(searchChapters.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(searchChapters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.chapterMappingData = action.payload;
      })
      .addCase(searchChapters.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      // Search Quizzes lifecycle methods
      .addCase(searchQuizzes.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(searchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.quizMappingData = action.payload;
      })
      .addCase(searchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      // Fetch Chapters lifecycle methods
      .addCase(fetchChaptersData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchChaptersData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.chapterMappingData = action.payload;
      })
      .addCase(fetchChaptersData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })

      // Fetch Quizzes lifecycle methods
      .addCase(fetchQuizzesData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchQuizzesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.quizMappingData = action.payload;
      })
      .addCase(fetchQuizzesData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export default courseSlice.reducer;
export const {
  resetCourseState,
  resetCourseAddState,
  resetCourseDeleteStatus,
  setChapterData,
  setQuizData,
} = courseSlice.actions;
