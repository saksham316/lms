// ---------------------------------------Imports--------------------------------------------
import { createSlice, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IoCheckmarkCircle } from "react-icons/io5";

import {
  generateOtp,
  logIn,
  logOut,
  signUp,
  sendOtp,
  verifyOtp,
  resetPassword,
  redirectToGoogle,
  fetchGoogleLoggedInUserData,
  updateUser,
} from "../actions/authActions";
// *******************************************************************************************

// -------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  isSuccess: false,
  isUserLoggedIn: false,
  loggedInUserData: {},
  filterData: [],
  isMailSent: false,
  errorMessage: "",
  otpGenerated: false,
  isOtpVerified: false,
  userSignedSuccess: "",
  forgetPasswordOtpValid: null,
  loginChange: false,
  isGoogleApiCalled: false,
  googleLoggedInUserData: {},
  isUserLoggedInOtherDevice: false,
  isUserUpdated: false,
};

// -------------------------------------- Slices------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearSignUpState: (state) => {
      state.userSignedSuccess = false;
      state.otpGenerated = false;
      state.isLoading = false;
      state.isOtpVerified = false;
      state.forgetPasswordOtpValid = null;
    },
    filterByCoursesCategory: (state, action) => {
      if (action.payload !== "All") {
        const filterData = current(state?.filterData).filter((item) => {
          console.log(item);
          return item.courseName === action.payload;
        });
        console.log(action.payload);
        console.log(filterData);
      } else {
        state.filterData = state.loggedInUserData.userAffiliations;
      }
    },
    setGoogleApiCall: (state, action) => {
      state.isGoogleApiCalled = action.payload;
    },
    resetReduxStoreData: (state, action) => {},
    resetLoggedInOtherDevicesStatus: (state, action) => {
      state.isUserLoggedInOtherDevice = action?.payload;
    },
    resetUserStatus: (state, action) => {
      state.isUserUpdated = action.payload;
    },
    resetLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // signUp lifecycle methods
      .addCase(signUp.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.userSignedSuccess = false;
        state.isMailSent = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSignedSuccess = true;
        state.isMailSent = false;
        toast.success(`Sign Up Successfull.`, {
          position: "top-center",
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.userSignedSuccess = false;
        state.isMailSent = false;

        state.errorMessage = action.payload;
        toast.error(action?.payload?.message, { position: "top-center" });
      })

      // Login

      .addCase(logIn.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.loggedInUserData = "";
        state.isUserLoggedIn = false;
        state.isMailSent = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = true;
        state.isMailSent = false;
        state.loggedInUserData = action?.payload;
        state.filterData = action.payload.userAffiliations;
        // console.log(action.payload.userAffiliations);
        state.isUserLoggedInOtherDevice = false;
        toast.success(`Welcome ${action?.payload?.userName || "NA"}`, {
          position: "top-center",
        });
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedInUserData = "";
        state.isUserLoggedIn = false;
        state.isMailSent = false;
        state.loginChange = !state.loginChange;
        toast.error(action.payload.message || "Try Again!", {
          position: "top-center",
        });
      })
      // Otp Generate

      .addCase(generateOtp.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.otpGenerated = false;
        state.isMailSent = false;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpGenerated = true;
        state.isMailSent = false;
        // toast.success(`Welcome ${action?.payload?.name}`, {
        //   position: "top-center",
        // });
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.otpGenerated = false;
        state.isMailSent = false;
        toast.error(action?.payload, { position: "top-center" });
      })
      // Verify OTP Cases
      .addCase(sendOtp.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
        state.isOtpVerified = false;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = "";
        state.otpGenerated = true;
        toast.success("Otp sent successfully", { position: "top-center" });
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
        state.isOtpVerified = false;
      })

      // Verify OTP Cases
      .addCase(verifyOtp.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
        state.isOtpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = "";
        state.isOtpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
        state.isOtpVerified = false;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state, action) => {
        state.isLoading = true;
        state.isOtpVerified = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = true;
        state.isSuccess = true;
        state.errorMessage = "";
        state.forgetPasswordOtpValid = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      // Forgot Password  Cases
      // .addCase(updatePassword.pending, (state, action) => {
      //   state.isLoading = true;
      //   state.isSuccess = false;
      //   state.errorMessage = "";
      //   state.isMailSent = false;
      // })
      // .addCase(updatePassword.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.errorMessage = "";
      //   state.isMailSent = true;
      // })
      // .addCase(updatePassword.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = false;
      //   state.isMailSent = false;

      //   state.errorMessage = action.payload;
      // })
      .addCase(logOut.pending, (state, action) => {
        state.errorMessage = "";
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loggedInUserData = null;
        state.isUserLoggedIn = false;
        localStorage.clear();
        sessionStorage.clear();
        console.log("this is the document cookie", document.cookie);
        state.isUserLoggedInOtherDevice = false;
        toast.success("Logout Successfully", {
          position: "top-center",
        });
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.otpGenerated = false;
        // toast.error(action.payload, { position: "top-center" });
      })

      // ---------------------------------Google Lifecycle methods start---------------------------------------

      // redirectToGoogle -
      .addCase(redirectToGoogle.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(redirectToGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(redirectToGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })

      // fetchGoogleLoggedInUserData - fetching the google logged in user data
      .addCase(fetchGoogleLoggedInUserData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isUserLoggedIn = false;
        state.googleLoggedInUserData = {};
      })
      .addCase(fetchGoogleLoggedInUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isUserLoggedIn = true;
        state.googleLoggedInUserData = action?.payload;
      })
      .addCase(fetchGoogleLoggedInUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isUserLoggedIn = false;
        state.googleLoggedInUserData = {};
        toast.error(action.payload, { position: "top-center" });
      })

      // updateUser lifecycle methods
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isUserUpdated = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserUpdated = true;
        state.errorMessage = "";
        state.loggedInUserData = action?.payload?.data;
        Swal.fire({
          title: "Updated User Successfully",
          icon: "success",
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.isUserUpdated = false;
      });
  },
});
export const {
  clearSignUpState,
  setGoogleApiCall,
  resetGoogleApiCall,
  filterByCoursesCategory,
} = authSlice.actions;
// ===========================================Exports==================================================
export default authSlice.reducer;
export const {
  resetReduxStoreData,
  resetLoggedInOtherDevicesStatus,
  resetUserStatus,
  resetLoading,
} = authSlice.actions;
