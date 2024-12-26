// ---------------------------------------Imports-------------------------------------
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { instance } from "../../../services/axiosInterceptor";
import {
  setVideoData,
  setVideoLoading,
  setVideoProgress,
} from "../../slices/Video/videoSlice";
import { reduxStore } from "../../../services/axiosInterceptor";
import crypto from "crypto-js";

// -----------------------------------------------------------------------------------

let store;
export const injectStore2 = (_store) => {
  store = _store;
};

const decrypter = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let decryptData = crypto.AES.decrypt(
        data?.data,
        process.env.REACT_APP_CRYPTO_SECRET_KEY
      );

      let decryptedData = crypto.enc.Utf8.stringify(decryptData);
      resolve(JSON.parse(decryptedData));
    } catch (error) {
      reject(error);
    }
  });
};

// -----------------------------------------------------------------------------------

// ------------------------------------Async Actions----------------------------------

// addVideo -- addVideo action to call the addVideo api
export const addVideo = createAsyncThunk(
  "video/addVideo",
  async ({ thumbnail, video, videoObj }, { rejectWithValue }) => {
    try {
      const localVideoThumbnail = URL.createObjectURL(thumbnail);
      // formData.append("videoLink", thumbnail[0]);
      // formData.append("videoLink", video[0]);
      // formData.append("videoObj", JSON.stringify(videoObj));

      const chunkSize = 20 * 1024 * 1024; // 20MB (adjust based on your requirements)
      const totalChunks = Math.ceil(video.size / chunkSize);
      let chunkProgressValue = 100 / totalChunks;
      let chunkProgress = 0;
      let chunkNumber = 0;
      let start = 0;
      let end = video?.size <= chunkSize ? video.size : chunkSize;
      let thumbnailFlag = true;
      let res;

      const uploadChunk = async () => {
        try {
          const formData = new FormData();

          const chunk = video.slice(start, end);
          formData.append("videoLink", thumbnail);
          formData.append("videoLink", chunk);
          formData.append("videoObj", JSON.stringify(videoObj));
          formData.append("chunkNumber", JSON.stringify(chunkNumber));
          formData.append("totalChunks", JSON.stringify(totalChunks));
          formData.append("originalName", JSON.stringify(video.name));
          formData.append(
            "originalThumbnailName",
            JSON.stringify(thumbnail.name)
          );
          formData.append("thumbnailFlag", JSON.stringify(thumbnailFlag));

          res =
            store?.getState()?.auth?.isUserLoggedIn &&
            (await instance.post("/video/addVideo", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }));

          if (totalChunks == 1) {
            let decryptedData = await decrypter(res?.data);
            store.dispatch(setVideoProgress(100));
            store.dispatch(
              setVideoData({ ...decryptedData, localVideoThumbnail })
            );
            store.dispatch(setVideoLoading(false));
            toast.success("Video Added Successfully");
            return;
          } else if (totalChunks > 1 && end <= video.size) {
            thumbnailFlag = false;
            chunkProgress += chunkProgressValue;
            chunkNumber++;
            start = end;
            end = start + chunkSize;
            store.dispatch(
              setVideoProgress(
                chunkProgress >= 100 ? 100 : Math.ceil(chunkProgress)
              )
            );
            uploadChunk();
          } else {
            // store.dispatch(setVideoProgress(100));
            let decryptedData = await decrypter(res?.data);

            store.dispatch(
              setVideoData({ ...decryptedData, localVideoThumbnail })
            );
            store.dispatch(setVideoLoading(false));
            toast.success("Video Added Successfully");
            return;
          }
          // return response?.data;
        } catch (error) {
          store.dispatch(setVideoLoading(false));
          store.dispatch(setVideoProgress(0));
          toast.error(error.message);
          return;
        }
      };

      uploadChunk();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// deleteVideo -- deleteVideo action to call the deleteVideo api
export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async ({ videoId }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/video/deleteVideo/${videoId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
