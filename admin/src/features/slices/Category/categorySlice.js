// ----------------------------------------------Imports---------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../actions/Category/categoryActions.js";
import { toast } from "react-toastify";
// --------------------------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isCategoryLoading: false,
  errorMessage: "",
  categoryData: [],
  isCategoryAdded: false,
  isCategoryUpdated: false,
  isCategoryDeleted: false,
};

//   Chapter Slices

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state, action) => {
      state.isCategoryAdded = action.payload;
      state.isCategoryUpdated = action.payload;
      state.isCategoryDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Category lifecycle methods
      .addCase(createCategory.pending, (state, action) => {
        state.isCategoryLoading = true;
        state.errorMessage = "";
        state.isCategoryAdded = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.isCategoryAdded = true;
        toast.success(`Category Added Successfully`, {
          position: "top-center",
        });
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.errorMessage = action.payload;

        toast.error(action.payload, { position: "top-center" });
      })

      // Fetch Category lifecycle methods
      .addCase(fetchCategories.pending, (state, action) => {
        state.isCategoryLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryData = action?.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.errorMessage = action.payload;

        toast.error(action.payload, { position: "top-center" });
      })

      // Update Category lifecycle methods
      .addCase(updateCategory.pending, (state, action) => {
        state.isCategoryLoading = true;
        state.errorMessage = "";
        state.isCategoryUpdated = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.isCategoryUpdated = true;
        toast.success(`Category Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.errorMessage = action.payload;
        state.isCategoryUpdated = false;
        toast.error(action.payload, { position: "top-center" });
      })
      // Delete Category lifecycle methods
      .addCase(deleteCategory.pending, (state, action) => {
        state.isCategoryLoading = true;
        state.errorMessage = "";
        state.isCategoryDeleted = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.isCategoryDeleted = true;
        toast.success(`Category Deleted Successfully`, {
          position: "top-center",
        });
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.errorMessage = action.payload;
        state.isCategoryDeleted = false;
        toast.error(action.payload, { position: "top-center" });
      })
  },
});

export default categorySlice.reducer;
export const { resetCategoryState } = categorySlice.actions;
