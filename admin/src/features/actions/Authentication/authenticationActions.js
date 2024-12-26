// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk, isAsyncThunkAction } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";
import { toast } from "react-toastify";
import crypto from "crypto-js";

// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// login -- action to call the login api and returning the respective response
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("user/loginAdmin", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      let decryptData = crypto.AES.decrypt(
        response?.data?.user,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      let decryptedData = crypto.enc.Utf8.stringify(decryptData);

      return { ...response?.data, user: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// logout -- action to call the logout api
export const logout = createAsyncThunk(
  "auth/logout",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        "user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// getUsers -- api to get all the user data if the role is admin or super admin
export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`user/getUsers${payload}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
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

// updateUser -- action to update the user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ payload, id }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`user/updateUser/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// updateLoggedInUser -- action to update the user
export const updateLoggedInUser = createAsyncThunk(
  "auth/updateLoggedInUser",
  async ({ payload, id }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`user/updateUser/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const decryptData = crypto.AES.decrypt(
        response?.data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      const decryptedData = crypto.enc.Utf8.stringify(decryptData);

      return { ...response?.data, data: JSON.parse(decryptedData) };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// updateUserCategories -- action to update the user
export const updateUserCategories = createAsyncThunk(
  "auth/updateUserCategories",
  async ({ payload, id }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`user/updateUser/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetchTeachersData -- fetchTeachersData action to call the getUsers  api
export const fetchTeachersData = createAsyncThunk(
  "auth/fetchTeachersData",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload) {
        response = await instance.get(`user/getUsers${payload}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await instance.get(`user/getUsers${payload}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

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
// fetchStudentsData -- fetchStudentsData action to call the getUsers api
export const fetchStudentsData = createAsyncThunk(
  "auth/fetchStudentsData",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload) {
        response = await instance.get(`user/getUsers${payload}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await instance.get(`user/getUsers${payload}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

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

// Signup Api for users
export const signUp = createAsyncThunk(
  "/user/adduser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/adduser", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipar/form-data",
        },
      });
      return response?.data?.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//Generate OTP
export const generateOtp = createAsyncThunk(
  "/user/sendotp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/user/sendotp", payload, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Otp Sent to your email");
        return data;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      // toast.error(error.message);
      return rejectWithValue(error);
    }
  }
);

// This method is used to send otp on register email address
export const sendOtp = createAsyncThunk(
  "user/forgetPasswordSendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/user/forgetPasswordSendOtp", {
        email: payload,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// This method is used for verify otp to reset password
export const verifyOtp = createAsyncThunk(
  "/user/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/user/verifyOtp", payload, {
        withCredentials: false,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//reset password
export const resetPassword = createAsyncThunk(
  "/user/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/user/resetPassword", payload, {
        withCredentials: false,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Google Page Redirection Api for user
export const redirectToGoogle = createAsyncThunk(
  "/auth/google",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get("/auth/google");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// fetchGoogleLoggedInUserData - once user authenticates using google thus fetching the google data
export const fetchGoogleLoggedInUserData = createAsyncThunk(
  "/auth/google/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get("/auth/google/login/success");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// updateUsers -- action to update the users with the selected course
export const updateUsers = createAsyncThunk(
  "auth/updateUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `user/updateUsers`,
        { payload },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
