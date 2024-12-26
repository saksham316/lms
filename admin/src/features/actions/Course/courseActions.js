// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";
// -----------------------------------------------------------------------------------
// --------------------------------------Functions------------------------------------
const decrypter = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let decryptData = crypto.AES.decrypt(
        data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      let decryptCourseNames = crypto.AES.decrypt(
        data?.courseNames,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedCourseNames = crypto.enc.Utf8.stringify(decryptCourseNames);
      let decryptTotalPages = crypto.AES.decrypt(
        data?.totalPages,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedTotalPages = crypto.enc.Utf8.stringify(decryptTotalPages);
      let decryptPage = crypto.AES.decrypt(
        data?.page,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );
      let decryptedPage = crypto.enc.Utf8.stringify(decryptPage);
      return resolve({
        ...data,
        data: JSON.parse(decryptedData),
        courseNames: JSON.parse(decryptedCourseNames),
        page: JSON.parse(decryptedPage),
        totalPages: JSON.parse(decryptedTotalPages),
      });
    } catch (error) {
      return reject(error);
    }
  });
};
// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// addCourse -- addCourse action to call the addCourse api
export const addCourse = createAsyncThunk(
  "course/addCourse",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/course/addCourse", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let decryptData = crypto.AES.decrypt(
        response?.data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      return { ...response?.data, data: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// updateCourse -- updateCourse action to call the updateCourse api
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ payload, courseId }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/course/updateCourse/${courseId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// fetchCourses -- fetchCourses action to call the fetchCourses api
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload) {
        response = await instance.get(
          `/course/fetchCourses?limit=4&${payload}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await instance.get(`/course/fetchCourses?limit=4`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      let decryptedData = await decrypter(response?.data);

      return decryptedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// deleteCourse -- deleteCourse action to call the deleteCourse api
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/course/deleteCourse/${courseId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// searchCourses -- searchCourses action to call the searchCourses api
export const searchCourses = createAsyncThunk(
  "course/searchCourses",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/course/searchCourses?limit=4&${payload}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// fetchChaptersData -- fetchChaptersData action to call the fetchCourses api
export const fetchChaptersData = createAsyncThunk(
  "course/fetchChaptersData",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload) {
        response = await instance.get(
          `/course/fetchCourses?limit=4&${payload}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await instance.get(`/course/fetchCourses?limit=4`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      let decryptedData = await decrypter(response?.data);

      return decryptedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// fetchQuizzesData -- fetchQuizzesData action to call the fetchCourses api
export const fetchQuizzesData = createAsyncThunk(
  "course/fetchQuizzesData",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload) {
        response = await instance.get(
          `/course/fetchCourses?limit=4&${payload}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await instance.get(`/course/fetchCourses?limit=4`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      let decryptedData = await decrypter(response?.data);

      return decryptedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// searchChapters -- searchChapters action to call the searchChapters api
export const searchChapters = createAsyncThunk(
  "course/searchChapters",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/chapter/searchChapters?limit=4&${payload}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// searchQuizzes -- searchQuizzes action to call the searchQuizzes api
export const searchQuizzes = createAsyncThunk(
  "course/searchQuizzes",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/quiz/searchQuizzes?limit=3&${payload}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
