// -----------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useState } from "react";
import "../pagesCSS/ChaptersList.css";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
import ChapterViewModal from "../Videos/ChapterViewModal";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteChapter } from "../../features/actions/Chapter/chapterActions";
import {
  resetChapterDeleteStatus,
  resetChapterUpdateStatus,
} from "../../features/slices/Chapter/chapterSlice";
import {
  fetchChaptersData,
  fetchCourses,
  searchChapters,
} from "../../features/actions/Course/courseActions";
import ChapterlistSkeleton from "./ChapterlistSkeleton";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";
import DescriptionModal from "../../components/DescriptionModal/DescriptionModal";
import {
  setChapterData,
  setQuizData,
} from "../../features/slices/Course/courseSlice";
// ---------------------------------------------------------------------------------------------------------

const ChaptersList = () => {
  // -----------------------------------------------States----------------------------------------------------
  const [chapterViewModal, setChapterViewModal] = useState(false);
  const [individualChapterData, setIndividualChapterData] = useState({});
  const [pageChanged, setPageChanged] = useState(false);
  const [searchChanged, setSearchChanged] = useState(false);
  const [search, setSearch] = useState("");

  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { chapterMappingData, isLoading } = useSelector(
    (state) => state?.course
  );

  const theme = useSelector((state) => state.theme);

  const { courseData } = useSelector((state) => state?.course);

  // const isLoading= true;
  const { isChapterDeleted, isChapterUpdated } = useSelector(
    (state) => state?.chapter
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const { loggedInUserData } = useAuth();

  let chapterPage =
    searchParams.getAll("page").length > 0 ? searchParams?.get("page") : 1;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions-------------------------------------------------

  // chapterDeleteHandler -- handler to call the delete api for the chapter
  const chapterDeleteHandler = (chapterId, courseChapters) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure, You want to delete this chapter",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (chapterId) {
                if (courseChapters?.length == 1) {
                  toast.error("There should be atleast one Chapter");
                } else {
                  dispatch(deleteChapter({ chapterId }));
                }
              } else {
                toast.error("No Chapter Id Found, Try Again");
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

  // chapterPaginationHandler -- handler to handle the chapter list pagination
  const chapterPaginationHandler = (index) => {
    setPageChanged(true);
    setSearchParams((searchParams) => {
      searchParams.set("page", index + 1);
      return searchParams;
    });
  };
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------useEffects------------------------------------------------
  useEffect(() => {
    if (isChapterDeleted) {
      dispatch(fetchChaptersData());
      dispatch(fetchCourses());
      dispatch(resetChapterDeleteStatus(false));
    }
  }, [isChapterDeleted]);

  useEffect(() => {
    let url = [];

    if (search === "") {
      if (chapterPage > 0 && pageChanged) {
        dispatch(fetchChaptersData(`page=${chapterPage}`));
      } else if (searchChanged) {
        dispatch(fetchChaptersData(`page=${chapterPage}`));
      }
    }
  }, [chapterPage, search]);

  useEffect(() => {
    let timer;
    if (search !== "") {
      setSearchChanged(true);
      timer = setTimeout(() => {
        setSearchParams((searchParams) => searchParams.set("page", 1));
        dispatch(searchChapters(`searchChapters=${search}&page=1`));
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    return () => {
      if (pageChanged && chapterPage !== 1) {
        dispatch(fetchChaptersData());
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
                  <div className="col col-sm-3 col-xs-12">
                    <h5 className="title1">Chapters List</h5>
                  </div>

                  <div className="col-sm-9 col-xs-12 text-right d-flex justify-content-end">
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
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((key) => <ChapterlistSkeleton rowLimit={3} />)
              ) : (
                <div className="panel-body table-responsive">
                  {Array.isArray(chapterMappingData?.data) &&
                    chapterMappingData?.data?.length > 0 &&
                    chapterMappingData?.data?.map((course, index) => {
                      return (
                        <Accordion className={` my-3`}>
                          <Accordion.Item
                            eventKey={index}
                            //   className={styles.chapterdropdown}
                            style={{ margin: "5px" }}
                          >
                            <Accordion.Header>
                              <span className="text-center px-2">
                                {(chapterPage - 1) * 4 + index + 1}.
                              </span>{" "}
                              {course?.courseName}
                            </Accordion.Header>
                            <Accordion.Body
                              style={{ padding: "0px", overflow: "auto" }}
                            >
                              <table
                                className={
                                  theme === "light"
                                    ? "table table-striped"
                                    : "table table-striped table-dark"
                                }
                              >
                                <thead
                                  style={{
                                    background:
                                      "linear-gradient(to right, rgb(46 55 61), rgb(12 41 71))",
                                  }}
                                >
                                  <tr>
                                    <th className="col-md-1 text-center">#</th>
                                    <th className="col-md-2 text-center">
                                      Chapter ID
                                    </th>
                                    <th className="col-md-2 text-center">
                                      Chapter Name
                                    </th>
                                    <th className="col-md-3 text-center">
                                      Chapter Description
                                    </th>
                                    <th className="col-md-2 text-center">
                                      Chapter Videos
                                    </th>
                                    <th className="col-md-2 text-center">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(course?.courseChapters) &&
                                    course?.courseChapters.length > 0 &&
                                    course?.courseChapters.map(
                                      (chapter, index) => {
                                        return (
                                          <tr>
                                            <td className="text-center">
                                              {index + 1}
                                            </td>
                                            <td className="text-center">
                                              {chapter?._id}
                                            </td>
                                            <td className="text-center">
                                              {chapter?.chapterName}
                                            </td>
                                            <td className="text-center">
                                              {chapter?.chapterDescription?.slice(
                                                0,
                                                20
                                              )}
                                              <DescriptionModal
                                                title=" Chapter Description"
                                                text={
                                                  chapter?.chapterDescription
                                                }
                                              />
                                            </td>
                                            <td className="text-center">
                                              {chapter?.chapterVideos
                                                ?.length === 0
                                                ? "No videos"
                                                : chapter?.chapterVideos
                                                    ?.length}
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
                                                    ["VIEW_CHAPTER"],
                                                    loggedInUserData
                                                  ) && (
                                                    <div
                                                      onClick={() => {
                                                        setChapterViewModal(
                                                          !chapterViewModal
                                                        );
                                                        setIndividualChapterData(
                                                          chapter
                                                        );
                                                      }}
                                                    >
                                                      <AiOutlineEye
                                                        size={20}
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                {doesUserHaveRoleToAccess(
                                                  [
                                                    "SUPER_ADMIN",
                                                    "ADMIN",
                                                    "TEACHER",
                                                  ],
                                                  loggedInUserData?.role
                                                ) &&
                                                  doesUserHavePermissions(
                                                    ["EDIT_CHAPTER"],
                                                    loggedInUserData
                                                  ) && (
                                                    <AiTwotoneEdit
                                                      size={20}
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          "/chapter_edit",
                                                          {
                                                            state: { chapter },
                                                          }
                                                        );
                                                      }}
                                                    />
                                                  )}
                                                {doesUserHaveRoleToAccess(
                                                  [
                                                    "SUPER_ADMIN",
                                                    "ADMIN",
                                                    "TEACHER",
                                                  ],
                                                  loggedInUserData?.role
                                                ) &&
                                                  doesUserHavePermissions(
                                                    ["DELETE_CHAPTER"],
                                                    loggedInUserData
                                                  ) && (
                                                    <AiFillDelete
                                                      size={20}
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        chapterDeleteHandler(
                                                          chapter?._id || "",
                                                          course?.courseChapters ||
                                                            []
                                                        )
                                                      }
                                                    />
                                                  )}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      );
                    })}
                </div>
              )}
              <div className="panel-footer">
                <div className="row">
                  <div className="col col-sm-6 col-xs-6  text-center ">
                    <span className="showing">
                      Showing <b>{chapterPage}</b> Out Of{" "}
                      <b>{chapterMappingData?.totalPages}</b> Pages
                    </span>
                  </div>
                  <div className="col-sm-6 col-xs-6 ">
                    <div className="pagination">
                      <span
                        onClick={() => {
                          if (chapterPage > 1) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", --chapterPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &laquo;
                      </span>
                      {chapterMappingData?.totalPages > 1
                        ? Array(chapterMappingData?.totalPages)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className={`${
                                  chapterPage == index + 1 ? "active" : ""
                                }`}
                                onClick={() => chapterPaginationHandler(index)}
                              >
                                {index + 1}
                              </span>
                            ))
                        : Array(1)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className="active"
                                onClick={() => chapterPaginationHandler(index)}
                              >
                                1
                              </span>
                            ))}

                      <span
                        onClick={() => {
                          if (chapterPage < chapterMappingData?.totalPages) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", ++chapterPage);
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
        {chapterViewModal && (
          <ChapterViewModal
            show={chapterViewModal}
            hide={() => setChapterViewModal(false)}
            chapterData={individualChapterData}
          />
        )}
      </div>
    </>
  );
};

export default ChaptersList;
