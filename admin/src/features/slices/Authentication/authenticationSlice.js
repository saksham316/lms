// ----------------------------------------------Imports--------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStudentsData,
  fetchTeachersData,
  generateOtp,
  getUsers,
  login,
  logout,
  resetPassword,
  sendOtp,
  signUp,
  updateLoggedInUser,
  updateUser,
  updateUserCategories,
  updateUsers,
  verifyOtp,
} from "../../actions/Authentication/authenticationActions.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IoCheckmarkCircle } from "react-icons/io5";

// -------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  loggedInUserData: [],
  isUserLoggedIn: false,
  loginChange: false,
  usersList: [],
  studentsList: [],
  teachersList: [],
  isUserUpdated: false,
  isTeachersListLoading: false,
  isStudentsListLoading: false,
  isUserLoggedInOtherDevice: false,
  userSignedSuccess: false,
  isMailSent: false,
  isGoogleApiCalled: false,
  otpGenerated: false,
  isOtpVerified: false,
  forgetPasswordOtpValid: null,
  isPasswordUpdated: false,
  areUsersUpdated: false,
};

//   Chapter Slices

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUserState: (state, action) => {
      state.isUserUpdated = action?.payload;
      state.areUsersUpdated = action?.payload;
    },
    resetOtpGenerationStatus: (state, action) => {
      state.otpGenerated = action?.payload;
    },

    resetReduxStoreData: (state, action) => {},
    setStudentsData: (state, action) => {
      state.studentsList = action?.payload;
    },
    setTeachersData: (state, action) => {
      state.teachersList = action?.payload;
    },
    resetLoggedInOtherDevicesStatus: (state, action) => {
      state.isUserLoggedInOtherDevice = action?.payload;
    },
    setGoogleApiCall: (state, action) => {
      state.isGoogleApiCalled = action.payload;
    },
    clearSignUpState: (state) => {
      state.userSignedSuccess = false;
      state.otpGenerated = false;
      state.isLoading = false;
      state.isOtpVerified = false;
      state.forgetPasswordOtpValid = null;
      state.isPasswordUpdated = false;
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
        toast.success(`Signed Up the user Successfully.`, {
          position: "top-center",
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.userSignedSuccess = false;
        state.isMailSent = false;
        state.errorMessage = action.payload;
        toast.error(state.errorMessage, { position: "top-center" });
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
        state.isPasswordUpdated = false;
        state.errorMessage = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = true;
        state.isPasswordUpdated = true;
        state.errorMessage = "";
        state.forgetPasswordOtpValid = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = false;
        state.isPasswordUpdated = false;

        state.errorMessage = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      // login lifecycle methods
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
        state.isUserLoggedIn = false;
        state.loggedInUserData = [];
        state.errorMessage = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = true;
        state.loggedInUserData = action?.payload?.user;
        state.errorMessage = "";
        state.isUserLoggedOut = false;
        state.isUserLoggedInOtherDevice = false;
        toast.success("Logged In Successfully", {
          position: "top-center",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isUserLoggedOut = true;
        state.isLoading = false;
        state.isUserLoggedIn = false;
        state.loggedInUserData = [];
        state.errorMessage = action?.payload;
        state.loginChange = !state.loginChange;
        toast.error(`${action?.payload || `Please try again`}`);
      })
      // logout lifecycle methods
      .addCase(logout.pending, (state, action) => {
        state.isLoading = true;
        state.isUserLoggedOut = false;
        state.errorMessage = "";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = false;
        state.isUserLoggedOut = true;
        state.loggedInUserData = null;
        state.isUserLoggedInOtherDevice = false;
        localStorage.clear();
        sessionStorage.clear();
        state.errorMessage = "";
        toast.success("Logout Successfully", {
          position: "top-center",
        });
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.isUserLoggedOut = false;
      })
      // getUsers lifecycle methods
      .addCase(getUsers.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.usersList = action?.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
      })
      // fetchStudentsData lifecycle methods
      .addCase(fetchStudentsData.pending, (state, action) => {
        state.isStudentsListLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchStudentsData.fulfilled, (state, action) => {
        state.isStudentsListLoading = false;
        state.errorMessage = "";
        state.studentsList = action?.payload?.data?.filter(
          (elements) => elements.role !== "TEACHER"
        );
      })
      .addCase(fetchStudentsData.rejected, (state, action) => {
        state.isStudentsListLoading = false;
        state.errorMessage = action?.payload;
      })
      // fetchTeachersData lifecycle methods
      .addCase(fetchTeachersData.pending, (state, action) => {
        state.isTeachersListLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchTeachersData.fulfilled, (state, action) => {
        state.isTeachersListLoading = false;
        state.errorMessage = "";
        state.teachersList = action?.payload?.data?.filter(
          (elements) => elements.role !== "STUDENT"
        );
      })
      .addCase(fetchTeachersData.rejected, (state, action) => {
        state.isTeachersListLoading = false;
        state.errorMessage = action?.payload;
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
        Swal.fire({
          title: "Updated User Successfully",
          icon: "success",
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.isUserUpdated = false;
      })
      // updateLoggedInUser lifecycle methods
      .addCase(updateLoggedInUser.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isUserUpdated = false;
      })
      .addCase(updateLoggedInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserUpdated = true;
        state.errorMessage = "";
        state.loggedInUserData = action?.payload?.data;
        Swal.fire({
          title: "Updated User Successfully",
          icon: "success",
        });
      })
      .addCase(updateLoggedInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.isUserUpdated = false;
      })

      // updateUserCategories lifecycle methods
      .addCase(updateUserCategories.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isUserUpdated = false;
      })
      .addCase(updateUserCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserUpdated = true;
        state.errorMessage = "";
        Swal.fire({
          title: "Updated User Successfully",
          icon: "success",
        });
      })
      .addCase(updateUserCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.isUserUpdated = false;
      })

      // updateUsers lifecycle methods
      .addCase(updateUsers.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.areUsersUpdated = false;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.areUsersUpdated = true;
        state.errorMessage = "";
        Swal.fire({
          title: "Updated All the Users Successfully",
          icon: "success",
        });
      })
      .addCase(updateUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.payload;
        state.areUsersUpdated = false;
      });
  },
});

export default authSlice.reducer;
export const {
  resetUserState,
  resetReduxStoreData,
  setStudentsData,
  setTeachersData,
  resetLoggedInOtherDevicesStatus,
  setGoogleApiCall,
  resetOtpGenerationStatus,
  clearSignUpState,
  resetLoading,
} = authSlice.actions;
