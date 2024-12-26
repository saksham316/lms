// -----------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useState } from "react";
import styles from "../pagesCSS/QuizzesList.module.css";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
import QuizViewModal from "../Videos/QuizViewModal";
import { TailSpin } from "react-loader-spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteChapter } from "../../features/actions/Chapter/chapterActions";
import { resetChapterDeleteStatus } from "../../features/slices/Chapter/chapterSlice";
import {
  fetchQuizzesData,
  fetchCourses,
  searchChapters,
  searchQuizzes,
} from "../../features/actions/Course/courseActions";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { resetQuizStatus } from "../../features/slices/Quiz/quizSlice";
import {
  setChapterData,
  setQuizData,
} from "../../features/slices/Course/courseSlice";
import { deleteQuiz } from "../../features/actions/Quiz/quizAction";
import { FaPlus } from "react-icons/fa";
import ChapterlistSkeleton from "../Chapter/ChapterlistSkeleton";

// ---------------------------------------------------------------------------------------------------------

const QuizzesList = () => {
  // -----------------------------------------------States----------------------------------------------------
  const [quizViewModal, setQuizViewModal] = useState(false);
  const [individualQuizData, setIndividualQuizData] = useState({});
  const [pageChanged, setPageChanged] = useState(false);
  const [searchChanged, setSearchChanged] = useState(false);
  const [search, setSearch] = useState("");

  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { quizMappingData, isLoading, courseData } = useSelector(
    (state) => state?.course
  );

  const { isQuizDeleted, isQuizLoading } = useSelector((state) => state?.quiz);
  const theme = useSelector((state) => state.theme);

  const [searchParams, setSearchParams] = useSearchParams();

  const { loggedInUserData } = useAuth();

  let quizPage =
    searchParams.getAll("page").length > 0 ? searchParams?.get("page") : 1;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions-------------------------------------------------

  // quizDeleteHandler -- handler to call the delete api for the chapter
  const quizDeleteHandler = (quizId, length) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure, You want to delete this quiz",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (quizId && length > 1) {
                dispatch(deleteQuiz({ id: quizId }));
              } else if (length == 1) {
                toast.error("There should be atleast one quiz in the chapter");
              } else {
                toast.error("No Quiz Id Found, Try Again");
                navigate("/");
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
    if (isQuizDeleted) {
      dispatch(resetQuizStatus(false));
      dispatch(fetchCourses());
    }
  }, [isQuizDeleted]);

  useEffect(() => {
    if (courseData) {
      dispatch(setChapterData(courseData));
      dispatch(setQuizData(courseData));
    }
  }, [courseData]);

  useEffect(() => {
    let url = [];

    if (search === "") {
      if (quizPage > 0 && pageChanged) {
        dispatch(fetchQuizzesData(`page=${quizPage}`));
      } else if (searchChanged) {
        dispatch(fetchQuizzesData(`page=${quizPage}`));
      }
    }
  }, [quizPage, search]);

  useEffect(() => {
    let timer;
    if (search !== "") {
      setSearchChanged(true);
      timer = setTimeout(() => {
        setSearchParams((searchParams) => searchParams.set("page", 1));
        dispatch(searchQuizzes(`searchQuizzes=${search}&page=1`));
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    return () => {
      if (pageChanged && quizPage !== 1) {
        dispatch(fetchQuizzesData());
      }
    };
  }, [pageChanged]);
  // ---------------------------------------------------------------------------------------------------------
  return isQuizLoading ? (
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
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-offset-1 col-md-12">
            <div className="panel">
              <div className="panel-heading">
                <div className="row">
                  <div className="col col-sm-3 col-xs-12 d-flex justify-content-start">
                    <h4 className="title">Quizzes List</h4>
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
                  {Array.isArray(quizMappingData?.data) &&
                    quizMappingData?.data?.length > 0 &&
                    quizMappingData?.data?.map((course, index) => {
                      return (
                        <Accordion className={` my-3`}>
                          <Accordion.Item
                            eventKey={index}
                            //   className={styles.chapterdropdown}
                            style={{ margin: "5px" }}
                          >
                            <Accordion.Header>
                              <span className="text-center px-2">
                                {(quizPage - 1) * 4 + index + 1}.
                              </span>{" "}
                              {course?.courseName}
                            </Accordion.Header>
                            <Accordion.Body
                              style={{
                                padding: "0px",
                                overflow: "auto",
                                backgroundColor: "var(--primary-color)",
                              }}
                            >
                              {/* course chapters accordion */}
                              {Array.isArray(course?.courseChapters) &&
                                course?.courseChapters.length > 0 &&
                                course?.courseChapters.map((chapter) => {
                                  return (
                                    <Accordion className={` my-3`}>
                                      <Accordion.Item
                                        eventKey={index}
                                        //   className={styles.chapterdropdown}
                                        style={{ margin: "5px" }}
                                      >
                                        <Accordion.Header>
                                          {chapter?.chapterName}
                                        </Accordion.Header>
                                        <Accordion.Body
                                          style={{
                                            backgroundColor:
                                              "var(--primary-color)",
                                            padding: "0px",
                                            overflow: "auto",
                                          }}
                                        >
                                          <div
                                            className="addMoreQuizzes col-md-12 d-flex flex-row-reverse gap-2"
                                            style={{ margin: "10px 0" }}
                                          >
                                            <div
                                              className="addMoreQuizIcon d-flex justify-content-center align-items-center"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                navigate("/add_quizzes", {
                                                  state: { chapter },
                                                });
                                              }}
                                            >
                                              <FaPlus size={20} />
                                            </div>
                                            <div className="addMoreQuizContent d-flex justify-content-center align-items-center">
                                              Wanna Add More Quizzes
                                            </div>
                                          </div>
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
                                                <th className="col-md-1 text-center">
                                                  #
                                                </th>
                                                <th className="col-md-2 text-center">
                                                  Quiz ID
                                                </th>
                                                <th className="col-md-2 text-center">
                                                  Quiz Question
                                                </th>
                                                <th className="col-md-3 text-center">
                                                  Quiz Options
                                                </th>
                                                <th className="col-md-2 text-center">
                                                  Action
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                chapter?.chapterQuizzes
                                              ) &&
                                              chapter?.chapterQuizzes.length >
                                                0 ? (
                                                chapter?.chapterQuizzes.map(
                                                  (quiz, index) => {
                                                    return (
                                                      <tr>
                                                        <td className="text-center">
                                                          {index + 1}
                                                        </td>
                                                        <td className="text-center">
                                                          {quiz?._id}
                                                        </td>
                                                        <td className="text-center">
                                                          {quiz?.question}
                                                        </td>
                                                        <td className="text-center">
                                                          {
                                                            <ul>
                                                              {Array?.isArray(
                                                                quiz?.options
                                                              ) &&
                                                                quiz?.options
                                                                  ?.length >
                                                                  0 &&
                                                                quiz?.options?.map(
                                                                  (answer) => {
                                                                    return (
                                                                      <li
                                                                        style={{
                                                                          color: `${
                                                                            answer?.isCorrect
                                                                              ? "green"
                                                                              : ""
                                                                          }`,
                                                                          fontWeight:
                                                                            "bolder",
                                                                          fontSize:
                                                                            "large",
                                                                        }}
                                                                      >
                                                                        {answer?.option ||
                                                                          "NA"}
                                                                      </li>
                                                                    );
                                                                  }
                                                                )}
                                                            </ul>
                                                          }
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
                                                                [
                                                                  "VIEW_CHAPTER",
                                                                ],
                                                                loggedInUserData
                                                              ) && (
                                                                <div
                                                                  onClick={() => {
                                                                    setQuizViewModal(
                                                                      !quizViewModal
                                                                    );
                                                                    setIndividualQuizData(
                                                                      quiz
                                                                    );
                                                                  }}
                                                                >
                                                                  <AiOutlineEye
                                                                    size={20}
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
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
                                                                [
                                                                  "EDIT_CHAPTER",
                                                                ],
                                                                loggedInUserData
                                                              ) && (
                                                                <AiTwotoneEdit
                                                                  size={20}
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={() => {
                                                                    navigate(
                                                                      "/quiz_edit",
                                                                      {
                                                                        state: {
                                                                          quiz,
                                                                        },
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
                                                                [
                                                                  "DELETE_CHAPTER",
                                                                ],
                                                                loggedInUserData
                                                              ) && (
                                                                <AiFillDelete
                                                                  size={20}
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={() =>
                                                                    quizDeleteHandler(
                                                                      quiz?._id ||
                                                                        "",
                                                                      chapter
                                                                        ?.chapterQuizzes
                                                                        .length
                                                                    )
                                                                  }
                                                                />
                                                              )}
                                                          </div>
                                                        </td>{" "}
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td colSpan={5}>
                                                    <div className="noQuiz d-flex justify-content-center">
                                                      <h3
                                                        style={{ color: "red" }}
                                                      >
                                                        No Quizzes Found
                                                      </h3>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  );
                                })}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      );
                    })}
                </div>
              )}
              <div className="panel-footer">
                <div className="row">
                  <div className="col col-sm-6 col-xs-6 text-center">
                    <span className={styles.showing}>
                      Showing <b>{quizPage}</b> Out Of{" "}
                      <b>{quizMappingData?.totalPages}</b> Page
                    </span>
                  </div>
                  <div className="col-sm-6 col-xs-6">
                    <div className="pagination text-center ">
                      <span
                        onClick={() => {
                          if (quizPage > 1) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", --quizPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &laquo;
                      </span>
                      {quizMappingData?.totalPages > 1
                        ? Array(quizMappingData?.totalPages)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className={`${
                                  quizPage == index + 1 ? "active" : ""
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
                          if (quizPage < quizMappingData?.totalPages) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", ++quizPage);
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
        {quizViewModal && (
          <QuizViewModal
            show={quizViewModal}
            hide={() => setQuizViewModal(false)}
            quizData={individualQuizData}
          />
        )}
      </div>
    </>
  );
};

export default QuizzesList;
