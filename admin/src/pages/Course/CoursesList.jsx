// -----------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useState } from "react";
import "../pagesCSS/CoursesList.css";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import CourseViewModal from "../Videos/CourseViewModal";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../responsive.css";
import {
  deleteCourse,
  fetchCourses,
  searchCourses,
} from "../../features/actions/Course/courseActions";
import {
  resetCourseDeleteStatus,
  setChapterData,
  setQuizData,
} from "../../features/slices/Course/courseSlice";
import CourseListSkeleton from "./CourseListSkeleton";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import DescriptionModal from "../../components/DescriptionModal/DescriptionModal";
// ---------------------------------------------------------------------------------------------------------

const CoursesList = () => {
  // -----------------------------------------------States----------------------------------------------------
  const [courseViewModal, setCourseViewModal] = useState(false);
  const [individualCourseData, setIndividualCourseData] = useState({});
  const [pageChanged, setPageChanged] = useState(false);
  const [searchChanged, setSearchChanged] = useState(false);
  const [search, setSearch] = useState("");
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const { courseData, isCourseDeleted, isLoading } = useSelector(
    (state) => state?.course
  );
  const theme = useSelector((state) => state.theme);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { loggedInUserData } = useAuth();

  let coursePage =
    searchParams.getAll("page").length > 0 ? searchParams?.get("page") : 1;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions-------------------------------------------------
  const courseDeleteHandler = (courseId) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure, You want to delete this course",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (courseId) {
                dispatch(deleteCourse({ courseId }));
              } else {
                toast.error("No Course Id Found, Try Again");
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
    if (isCourseDeleted) {
      dispatch(fetchCourses());
      dispatch(resetCourseDeleteStatus(false));
    }
  }, [isCourseDeleted]);

  useEffect(() => {
    if (courseData?.data?.length > 0) {
      dispatch(setChapterData(courseData));
      dispatch(setQuizData(courseData));
    }
  }, [courseData]);

  useEffect(() => {
    let url = [];

    if (search === "") {
      if (coursePage > 0 && pageChanged) {
        dispatch(fetchCourses(`page=${coursePage}`));
      } else if (searchChanged) {
        dispatch(fetchCourses(`page=${coursePage}`));
      }
    }
  }, [coursePage, search]);

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
        <div className="row d-flex justify-content-center course_container">
          <div className="col-md-offset-1 col-md-12">
            <div className="panel course_panel">
              <div className="panel-heading ">
                <div className="row ">
                  <div className="col-md-6 course_list d-flex justify-content-start">
                    <h4 className="title">Courses List</h4>
                  </div>

                  <div className=" col-md-6 d-flex justify-content-end ">
                    <div className="btn_group">
                      <input
                        type="text"
                        className="form-control w-100"
                        placeholder="search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-body table-responsive course_table ">
                <table
                  className={
                    theme === "light"
                      ? "table table-striped"
                      : "table table-striped table-dark"
                  }
                >
                  <thead>
                    <tr>
                      <th className="col-md-1 text-center">S. No.</th>
                      <th className="col-md-2 text-center">Course ID</th>
                      <th className="col-md-2 text-center">Course Name</th>
                      <th className="col-md-3 text-center">
                        Course Description
                      </th>
                      <th className="col-md-2 text-center">Course Chapters</th>
                      <th className="col-md-2 text-center">Action</th>
                    </tr>
                  </thead>
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, index) => <CourseListSkeleton key={index} />)
                  ) : (
                    <tbody className="table-group-divider">
                      {Array.isArray(courseData?.data) &&
                        courseData?.data.length > 0 &&
                        courseData?.data.map((course, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-center">
                                {(coursePage - 1) * 4 + index + 1}
                              </td>
                              <td className="text-center">{course?._id}</td>
                              <td className="text-center">
                                {course?.courseName}
                              </td>
                              <td className="text-center">
                                {course?.courseDescription?.slice(0, 20)}
                                <DescriptionModal
                                  title="COURSE DESCRIPTION"
                                  text={course?.courseDescription}
                                  key={index}
                                />
                              </td>
                              <td className="text-center">
                                {!course?.courseChapters?.length == 0
                                  ? course?.courseChapters?.length
                                  : "No chapters"}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center column-gap-2">
                                  {doesUserHaveRoleToAccess(
                                    [
                                      "SUPER_ADMIN",
                                      "ADMIN",
                                      "TEACHER",
                                      "STUDENT",
                                    ],
                                    loggedInUserData?.role
                                  ) &&
                                    doesUserHavePermissions(
                                      ["VIEW_COURSE"],
                                      loggedInUserData
                                    ) && (
                                      <div
                                        onClick={() => {
                                          setCourseViewModal(!courseViewModal);
                                          setIndividualCourseData(course);
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
                                      ["EDIT_COURSE"],
                                      loggedInUserData
                                    ) && (
                                      <AiTwotoneEdit
                                        size={20}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          navigate("/course_edit", {
                                            state: { course },
                                          });
                                        }}
                                      />
                                    )}
                                  {doesUserHaveRoleToAccess(
                                    ["SUPER_ADMIN", "ADMIN", "TEACHER"],
                                    loggedInUserData?.role
                                  ) &&
                                    doesUserHavePermissions(
                                      ["DELETE_COURSE"],
                                      loggedInUserData
                                    ) && (
                                      <AiFillDelete
                                        size={20}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          courseDeleteHandler(course?._id || "")
                                        }
                                      />
                                    )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                </table>
              </div>
              <div className="panel-footer">
                <div className="row">
                  <div className="col col-sm-12  col-md-6 text-center  page1">
                    Showing <b>{coursePage}</b> Out Of{" "}
                    <b>{courseData?.totalPages}</b> Pages
                  </div>
                  <div className=" cpl-sm-12 col-md-6  page2">
                    <div className="pagination">
                      <span
                        onClick={() => {
                          if (coursePage > 1) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", --coursePage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &laquo;
                      </span>
                      {courseData?.totalPages > 1
                        ? Array(courseData?.totalPages)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                key={index}
                                className={`${
                                  coursePage == index + 1 ? "active" : ""
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
                                key={index}
                                className="active"
                                onClick={() => coursePaginationHandler(index)}
                              >
                                1
                              </span>
                            ))}
                      <span
                        onClick={() => {
                          if (coursePage < courseData?.totalPages) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", ++coursePage);
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
        {courseViewModal && (
          <CourseViewModal
            course={individualCourseData}
            show={courseViewModal}
            hide={() => setCourseViewModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CoursesList;
