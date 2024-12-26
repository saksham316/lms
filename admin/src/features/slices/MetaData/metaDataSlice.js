// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import { getMetaData } from "../../actions/MetaData/metaDataActions";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of metaData
const initialState = {
  isMetaDataLoading: false,
  errorMessage: "",
  metaData: [],
};

//   Course Slices

const metaDataSlice = createSlice({
  name: "metaData",
  initialState,
  reducers: {
    resetMetaDataState: (state, action) => {
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Meta Data lifecycle methods
      .addCase(getMetaData.pending, (state, action) => {
        state.isMetaDataLoading = true;
        state.errorMessage = "";
      })
      .addCase(getMetaData.fulfilled, (state, action) => {
        state.isMetaDataLoading = false;
        state.metaData = action.payload;
      })
      .addCase(getMetaData.rejected, (state, action) => {
        state.isMetaDataLoading = false;
        state.errorMessage = action.payload;

        // toast.error(action.payload, { position: "top-center" });
      });
  },
});

export default metaDataSlice.reducer;
export const {} = metaDataSlice.actions;
