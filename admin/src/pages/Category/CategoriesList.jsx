// -----------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useState } from "react";
import "../pagesCSS/CoursesList.css";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import CategoryViewModal from "../Videos/CategoryViewModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteCourse,
  fetchCourses,
  searchCourses,
} from "../../features/actions/Course/courseActions";
import { resetCourseDeleteStatus } from "../../features/slices/Course/courseSlice";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { deleteCategory, fetchCategories } from "../../features/actions/Category/categoryActions";
import CategorySkeleton from "./Categoryskeleton"
// ---------------------------------------------------------------------------------------------------------

const CategoriesList = () => {
  // -----------------------------------------------States----------------------------------------------------
  const [categoryViewModal, setCategoryViewModal] = useState(false);
  const [individualCategoryData, setIndividualCategoryData] = useState({});
  const [pageChanged, setPageChanged] = useState(false);
  const [searchChanged, setSearchChanged] = useState(false);
  const [search, setSearch] = useState("");
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const { categoryData, isCategoryDeleted, isCategoryLoading } = useSelector(
    (state) => state?.category
  );

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { loggedInUserData } = useAuth();

  let categoryPage =
    searchParams.getAll("page").length > 0 ? searchParams?.get("page") : 1;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions-------------------------------------------------
  const categoryDeleteHandler = (categoryId) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure, You want to delete this category",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (categoryId) {
                dispatch(deleteCategory({id:categoryId }));
              } else {
                toast.error("No Category Id Found, Try Again");
              }
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

  // coursePaginationHandler -- handler to handle the course list pagination
  const coursePaginationHandler = (index) => {
    setPageChanged(true);
    setSearchParams((searchParams) => {
      searchParams.set("page", index + 1);
      return searchParams;
    });
  };

  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------useEffects------------------------------------------------
  useEffect(() => {
    if (isCategoryDeleted) {
      dispatch(fetchCategories());
      dispatch(resetCourseDeleteStatus(false));
    }
  }, [isCategoryDeleted]);

  useEffect(() => {
    let url = [];

    if (search === "") {
      if (categoryPage > 0 && pageChanged) {
        dispatch(fetchCategories(`page=${categoryPage}`));
      } else if (searchChanged) {
        dispatch(fetchCategories(`page=${categoryPage}`));
      }
    }
  }, [categoryPage, search]);

  useEffect(() => {
    let timer;
    if (search !== "") {
      setSearchChanged(true);
      timer = setTimeout(() => {
        setSearchParams((searchParams) => searchParams.set("page", 1));
        dispatch(searchCourses(`searchCourses=${search}&page=1`));
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    return () => {
      if (pageChanged) {
        dispatch(fetchCourses());
      }
    };
  }, [pageChanged]);

  // ---------------------------------------------------------------------------------------------------------
  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-offset-1 col-md-12">
            <div className="panel">
              <div className="panel-heading">
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <h4 className="title">Categories List</h4>
                  </div>
                  <div className="col-sm-9 col-xs-12 text-right d-flex justify-content-end ">
                    <div className="btn_group">
                      <input
                        type="text"
                        className="form-control w-100"
                        placeholder="Search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-body table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="col-md-1 text-center">#</th>
                      <th className="col-md-2 text-center">Category ID</th>
                      <th className="col-md-2 text-center">Category Name</th>
                      <th className="col-md-2 text-center">Action</th>
                    </tr>
                  </thead>
                  {isCategoryLoading ? (
                    Array(3)
                      .fill(0)
                      .map((key) => <CategorySkeleton/>)
                  ) : (
                    <tbody className="table-group-divider">
                      {Array.isArray(categoryData?.categoryData) &&
                        categoryData?.categoryData.length > 0 &&
                        categoryData?.categoryData.map((category, index) => {
                          return (
                            <tr >
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{category?._id}</td>
                              <td className="text-center">
                                {category?.categoryName}
                              </td>
                              <div className="d-flex justify-content-center column-gap-2 align-items-center">
                                {doesUserHaveRoleToAccess(
                                  [
                                    "SUPER_ADMIN",
                                    "ADMIN",
                                    "TEACHER",
                                  ],
                                  loggedInUserData?.role
                                ) &&
                                  doesUserHavePermissions(
                                    ["VIEW_CATEGORY"],
                                    loggedInUserData
                                  ) && (
                                    <div
                                      onClick={() => {
                                        setCategoryViewModal(!categoryViewModal);
                                        setIndividualCategoryData(category);
                                      }}
                                    >
                                      <AiOutlineEye
                                        size={20}
                                        style={{ cursor: "pointer" }}
                                      />
                                    </div>
                                  )}
                                {doesUserHaveRoleToAccess(
                                  ["SUPER_ADMIN", "ADMIN", "TEACHER"],
                                  loggedInUserData?.role
                                ) &&
                                  doesUserHavePermissions(
                                    ["EDIT_CATEGORY"],
                                    loggedInUserData
                                  ) && (
                                    <AiTwotoneEdit
                                      size={20}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        navigate("/category_edit", {
                                          state: { category },
                                        });
                                      }}
                                    />
                                  )}
                                {doesUserHaveRoleToAccess(
                                  ["SUPER_ADMIN", "ADMIN", "TEACHER"],
                                  loggedInUserData?.role
                                ) &&
                                  doesUserHavePermissions(
                                    ["DELETE_CATEGORY"],
                                    loggedInUserData
                                  ) && (
                                    <AiFillDelete
                                      size={20}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        categoryDeleteHandler(category?._id || "")
                                      }
                                    />
                                  )}
                              </div>
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                </table>
              </div>
              <div className="panel-footer">
                
                <div className="row">
                  <div className="col text-center "><span className="showing">
                    Showing <b>{categoryPage}</b> Out Of{" "}
                    <b>{categoryData?.totalPages}</b> Entries
                  </span>
                    
                  </div>
                  <div className="col-sm-6 col-xs-6  text-center">
                    <div className="pagination">
                      <span
                        onClick={() => {
                          if (categoryPage > 1) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", --categoryPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &laquo;
                      </span>
                      {categoryData?.totalPages > 1
                        ? Array(categoryData?.totalPages)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className={`${
                                  categoryPage == index + 1 ? "active" : ""
                                }`}
                                onClick={() => coursePaginationHandler(index)}
                              >
                                {index + 1}
                              </span>
                            ))
                        : Array(1)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className="active"
                                onClick={() => coursePaginationHandler(index)}
                              >
                                1
                              </span>
                            ))}
                      <span
                        onClick={() => {
                          if (categoryPage < categoryData?.totalPages) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", ++categoryPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &raquo;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {categoryViewModal && (
          <CategoryViewModal
            category={individualCategoryData}
            show={categoryViewModal}
            hide={() => setCategoryViewModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CategoriesList;
