// -------------------------------------------Imports------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../pagesCSS/CategoryEdit.module.css";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateCategory,
  fetchCategories,
} from "../../features/actions/Category/categoryActions";
import { TailSpin } from "react-loader-spinner";
import { resetCategoryState } from "../../features/slices/Category/categorySlice";

// --------------------------------------------------------------------------------------------------------------

const CategoryEdit = () => {
  // -------------------------------------------States-------------------------------------------------------------
  const [categoryEditField, setCategoryEditField] = useState(false);
  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------Hooks-------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const category = location?.state?.category || {};

  const { isCategoryUpdated, isCategoryLoading } = useSelector(
    (state) => state?.category
  );
  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------Functions----------------------------------------------------------

  //  updateCategoryHandler -- handler to update the category added to the database
  const updateCategoryHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure! You want to update this Category",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              dispatch(updateCategory({id:category?._id, categoryName: data?.categoryName }));
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
    }
  };

  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------useEffects----------------------------------------------------------
  useEffect(() => {
    if (isCategoryUpdated) {
      dispatch(fetchCategories());
      dispatch(resetCategoryState(false));
      navigate("/categories_list");
    }
  }, [isCategoryUpdated]);

  // --------------------------------------------------------------------------------------------------------------
  return isCategoryLoading ? (
    <div className={`${styles.spiner} ${styles.aftersubmitLoading}`}>
      <TailSpin
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  ) : (
    <>
      <Container>
        <Row>
          <Col className="">
            {/* <div className={`${styles.box_shadow}`}> */}
            <form onSubmit={handleSubmit(updateCategoryHandler)}>
              <h1 style={{color:"var(--table-font-color)"}}>Update Category </h1>
              <div>
                <h1 className={styles.title}>Current Category Name</h1>
              </div>

              <div className={`${styles.category}`}>
                <div className={`${styles.categoryNameField}`}>
                  <input
                    //   value={moduleName}
                    className={`${styles.categoryName}`}
                    type="text"
                    id="categoryName"
                    placeholder={`${category?.categoryName}`}
                    disabled={true}
                  />
                </div>
                <div className={`${styles.categoryEditButton}`}>
                  <button
                    type="button"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    onClick={()=>{setCategoryEditField(true)}}
                    // disabled = {Array.isArray(videoData) && videoData.length ===0?true:false}
                  >
                    Edit Category Name
                  </button>
                </div>
              </div>
              {categoryEditField && (
                <>
                  <div>
                    <h1 className={styles.title}>Update Category Name</h1>
                  </div>

                  <div className={`${styles.category}`}>
                    <div className={`${styles.updateCategoryNameField}`}>
                      <input
                        //   value={moduleName}
                        className={`${styles.categoryName}`}
                        {...register("categoryName", {
                          required: {
                            value: true,
                            message: "Category Name is required",
                          },
                        })}
                        type="text"
                        id="categoryName"
                        placeholder="Change Current Category Name"
                      />
                      {errors.categoryName && (
                        <div className="text-danger pt-1">
                          {errors.categoryName.message ||
                            "Category Name is required"}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div
                className={`${styles.nextPrevButtonDiv} d-flex justify-content-start align-items-start`}
              >
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    // disabled = {Array.isArray(videoData) && videoData.length ===0?true:false}
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CategoryEdit;
