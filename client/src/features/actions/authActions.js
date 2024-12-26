// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
import { toast } from "react-toastify";
import axios from "axios";
import crypto from "crypto-js";

// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// Signup Api for users
export const signUp = createAsyncThunk(
  "/user/adduser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/adduser", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response?.data?.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// login Api for users
export const logIn = createAsyncThunk(
  "/user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/login", payload, {
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

      return JSON.parse(decryptedData);
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

//Logout User
export const logOut = createAsyncThunk(
  "/user/logOut",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/user/logOut", payload, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error.message);
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
