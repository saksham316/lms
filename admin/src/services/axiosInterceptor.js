import axios from "axios";
import { logout } from "../features/actions/Authentication/authenticationActions";
import { toast } from "react-toastify";
import {
  resetLoggedInOtherDevicesStatus,
  resetReduxStoreData,
} from "../features/slices/Authentication/authenticationSlice";

// This code is used to access redux store in this file.
let store;
export const injectStore = (_store) => {
  store = _store;
};

export const reduxStore = store;

// Creating new axios instance
export const instance = axios.create({
  baseURL: `${
    process.env.REACT_APP_WORKING_ENVIRONMENT === "production"
      ? process.env.REACT_APP_API_BASE_URL_MAIN_PRODUCTION
      : process.env.REACT_APP_API_DEV_URL
  }`,
});

instance.interceptors.request.use(
  (config) => {
    return  config;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let errorMessage = "";
    // Do something with response error
    let loggedInUserEmail = store.getState()?.auth?.loggedInUserData?.email;
    let originalRequest = error.config;

    if (
      error?.response?.status === 401 ||
      (error?.response?.status === 403 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      try {
        if (loggedInUserEmail) {
          await instance.post(
            "/user/refreshToken",
            { email: loggedInUserEmail },
            {
              withCredentials: true,
            }
          );
          return instance(originalRequest);
        } else {
          errorMessage = "Unauthorized Access";
          return Promise.reject(errorMessage);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (error?.response?.status === 440) {
      if (store?.getState()?.auth?.isUserLoggedIn) {
        let logoutRes = store?.dispatch(logout());
        let logoutPayload = await logoutRes;
        if (logoutPayload.payload.success) {
          store?.dispatch(resetReduxStoreData());
        }
        return Promise.reject("Session Expired");
      } else {
        return Promise.reject("Unauthorized access");
      }
    }
    switch (Number(error.response.status)) {
      case 400:
        errorMessage = error.response.data.message || "Bad Request";
        break;

      case 404:
        errorMessage = error.response.data.message || "Resource Not Found";
        break;

      case 409:
        errorMessage =
          error.response.data.message ||
          "User is already logged in some other device";
        store.dispatch(resetLoggedInOtherDevicesStatus(true));
        break;

      case 500:
        errorMessage = error.response.data.message || "Internal Server Error";
        break;

      default:
        errorMessage =
          error.response.data.message ||
          "Sorry, something went wrong. Please try again later.";
    }
    return Promise.reject(errorMessage);
  }
);

// ------------------------------------------- THE END -------------------------------------------
