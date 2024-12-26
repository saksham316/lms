// -------------------------------------------Imports------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import { generateStudyMaterialResult } from "../../actions/StudyMaterial/studyMaterialActions";
import { toast } from "react-toastify";
// --------------------------------------------------------------------------------------------------------

const initialState = {
  isStudyMaterialLoading: false,
  isStudyMaterialResultAdded: false,
  studyMaterialResult: {},
};

const studyMaterialSlice = createSlice({
  name: "studyMaterial",
  initialState,
  reducers: {
    resetStudyMaterialStatus: (state, action) => {
      state.isStudyMaterialResultAdded = action.payload;
    },
    resetStudyMaterialData: (state, action) => {
      state.studyMaterialResult = {};
    },
  },
  extraReducers: (builder) => {
    builder
      //  generateStudyMaterialResult lifecycle actions
      .addCase(generateStudyMaterialResult.pending, (state, action) => {
        state.isStudyMaterialLoading = true;
        state.isStudyMaterialResultAdded = false;
      })
      .addCase(generateStudyMaterialResult.fulfilled, (state, action) => {
        state.isStudyMaterialLoading = false;
        state.isStudyMaterialResultAdded = true;
        state.studyMaterialResult = action?.payload;
      })
      .addCase(generateStudyMaterialResult.rejected, (state, action) => {
        state.isStudyMaterialLoading = false;
        state.isStudyMaterialResultAdded = false;
        toast.error(action.payload);
      });
  },
});

export const { resetStudyMaterialStatus,resetStudyMaterialData } = studyMaterialSlice.actions;

export default studyMaterialSlice.reducer;
