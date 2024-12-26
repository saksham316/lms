// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import { addVideo, deleteVideo } from "../../actions/Video/videoActions";
import { toast } from "react-toastify";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  videoData: [],
  isVideoAdded: false,
  isVideoDeleted: false,
  videoProgress: 0,
};

//   Video Slices

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    resetVideoState: (state, action) => {
      state.isVideoAdded = false;
      state.videoData = [];
    },
    resetVideoDeleteStatus: (state, action) => {
      state.isVideoDeleted = action.payload;
    },
    resetVideoAddStatus: (state, action) => {
      state.isVideoAdded = action.payload;
    },
    videoDataMutation: (state, action) => {
      state.videoData = state?.videoData.filter(
        (video) => video?._id !== action?.payload
      );
    },
    setVideoProgress: (state, action) => {
      state.videoProgress = action.payload;
    },
    setVideoLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setVideoData: (state, action) => {
      state.videoData = [...state.videoData, action?.payload];
      state.isVideoAdded = true;
      state.isLoading = false;
      state.videoProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Course lifecycle methods
      .addCase(addVideo.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isVideoAdded = false;
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        // state.isLoading = false;
        // state.videoData = [...state.videoData, action?.payload?.data];
        // state.isVideoAdded = true;
        // toast.success(`Video Added Successfully`, {
        //   position: "top-center",
        // });
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;

        toast.error(action.payload, { position: "top-center" });
      })
      // Delete Video lifecycle methods
      .addCase(deleteVideo.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isVideoAdded = false;
        state.isVideoDeleted = false;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVideoAdded = false;
        state.isVideoDeleted = true;
        toast.success(`Video Deleted Successfully`, {
          position: "top-center",
        });
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;

        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export default videoSlice.reducer;
export const {
  resetVideoState,
  resetVideoDeleteStatus,
  resetVideoAddStatus,
  videoDataMutation,
  setVideoProgress,
  setVideoLoading,
  setVideoData
} = videoSlice.actions;