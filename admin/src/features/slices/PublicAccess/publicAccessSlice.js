// ----------------------------------------------Imports---------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { makePublic } from "../../actions/PublicAccess/publicAccessActions";
// -------------------------------------------------------------------------------------------------------

// initialState -- initial state of public access
const initialState = {
    isMakePublicApiLoading: false,
};

//   Public Access Slices

const publicAccessSlice = createSlice({
  name: "publicAccess",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // makePublic lifecycle actions handling
      .addCase(makePublic.pending, (state, action) => {
        state.isMakePublicApiLoading = true;
      })
      .addCase(makePublic.fulfilled, (state, action) => {
        state.isMakePublicApiLoading = false;
        toast.success(
          `Media Files are now publically accessible`,
          {
            position: "top-center",
          }
        );
      })
      .addCase(makePublic.rejected, (state, action) => {
        state.isMakePublicApiLoading = false;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export default publicAccessSlice.reducer;
export const {} = publicAccessSlice.actions;
