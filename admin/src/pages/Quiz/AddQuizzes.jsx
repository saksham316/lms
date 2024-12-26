// ----------------------------------------------Imports----------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import styles from "../pagesCSS/Course.module.css";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import {
  addCourse,
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import { resetVideoState } from "../../features/slices/Video/videoSlice";
import {
  resetChapterData,
  resetChapterState,
} from "../../features/slices/Chapter/chapterSlice";
import AddVideoModal from "../Videos/AddVideoModal";
import { FaRegCirclePlay } from "react-icons/fa6";

import VideosSkeleton from "../../components/skeletonUi/VideosSkeleton";
import { addChapter } from "../../features/actions/Chapter/chapterActions";
import axios from "axios";
import { handleQuizPost } from "../../features/actions/Quiz/quizAction";
import { useNavigate } from "react-router";
import {
  resetCourseAddState,
  resetCourseState,
} from "../../features/slices/Course/courseSlice";
import { resetQuizAddStatus, resetQuizStatus } from "../../features/slices/Quiz/quizSlice";
import { FaTimes, FaTrash } from "react-icons/fa";

// ---------------------------------------------------------------------------------------------------------

const AddQuizzes = () => {
  // ---------------------------------------------States-----------------------------------------------------
  const [index, setIndex] = useState(0);
  let count = 0;

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [accordianData, setAccordianData] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleThumbnail, setModuleThumbnail] = useState("");
  const [courseUpdateStatus, setCourseUpdateStatus] = useState(false);
  const [categorySelectionData, setCategorySelectionData] = useState([]);
  const [categorySelectedData, setCategorySelectedData] = useState([]);

  // --------------------------------------------React Hooks-----------------------------------------
  const fileInputRef = useRef(null);
  const elRef = useRef();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const { isLoading, courseId, isCourseUpdated, isCourseAdded } = useSelector(
    (state) => state?.course
  );

  const { isQuizAdded, isQuizLoading } = useSelector((state) => state?.quiz);

  const categoryData = useSelector((state) => state?.category?.categoryData);

  const location = useLocation();

  const chapterData = location?.state?.chapter || {};

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
        {
          option: "",
          isCorrect: false,
        },
      ],
      chapterId: chapterData?._id || "",
    },
  ]);

  // ----------------------------------------------functions--------------------------------------------------

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].option =
      e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          {
            option: "",
            isCorrect: false,
          },
          {
            option: "",
            isCorrect: false,
          },
          {
            option: "",
            isCorrect: false,
          },
          {
            option: "",
            isCorrect: false,
          },
        ],
        chapterId: chapterData?._id || "",
      },
    ]);
  };
  const handleQuestionChange = (index, e) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index].question = e.target.value;
    setQuestions(updatedQuestion);
  };

  const handleChange = (event, questionIndex) => {
    const optionIndex = event.target.value;
    handleCorrectOption(questionIndex, optionIndex);
  };

  const handleCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex]?.options?.forEach((option) => {
      option.isCorrect = false;
    });
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = true;
    setQuestions(updatedQuestions);
  };

  // addQuizzesHandler - handler to add the quiz to the particular chapter with all the data
  const addQuizzesHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: `Adding Quizzes to the Chapter "${chapterData?.chapterName}"`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              if (chapterData?._id) {
                if (Array.isArray(questions) && questions.length > 0) {
                  dispatch(handleQuizPost(questions));
                } else {
                  toast.error("Add questions in order to proceed");
                }
              } else {
                toast.error("No Chapter Id Found! Try Again");
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

  // questionDeleteHandler -- handler to delete the question
  const questionDeleteHandler = (e, index) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: `Are You Sure! You want to delete Question ${index + 1} `,
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (questions.length === 1) {
                toast.error("There must be atleast one question");
              } else {
                setQuestions((question) => {
                  let copy = JSON.stringify(question);
                  let copyData = JSON.parse(copy);

                  copyData.splice(index, 1);
                  return copyData;
                });
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
  // ---------------------------------------------------------------------------------------------------------

  // -------------------------------------------------useEffect-----------------------------------------------


  useEffect(()=>{
    if(isQuizAdded){
        dispatch(fetchCourses());
        navigate("/quizzes_list");
        dispatch(resetQuizStatus(false));
    }
  },[isQuizAdded])
  // horizontal scroll
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: "smooth",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }

    if (categoryData?.categoryData) {
      setCategorySelectionData(categoryData?.categoryData);
    }
  }, []);

  // ----------------------------------------------------------------------------------------------------
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
      <Container>
        <Row>
          <Col className="">
            <form onSubmit={handleSubmit(addQuizzesHandler)}>
              <h1>Add Quiz to "{chapterData?.chapterName || "N.A"}"</h1>
              {questions?.map((question, questionIndex) => {
                return (
                  <>
                    <div className="my-3">
                      <p className={styles.questiontext}>{`Question ${
                        questionIndex + 1
                      }`}</p>
                      <div className="d-flex align-items-center">
                        <input
                          className={styles.questionbox}
                          type="text"
                          placeholder="Ask a Question"
                          value={question.question}
                          {...register(`question${questionIndex}`, {
                            required: {
                              value: true,
                              message: "Question is required",
                            },
                          })}
                          onChange={(e) =>
                            handleQuestionChange(questionIndex, e)
                          }
                        />

                        <svg
                          onClick={handleAddQuestion}
                          className={`${styles.cursor_pointer} mx-2`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 62 62"
                          fill="none"
                        >
                          <g filter="url(#filter0_d_304_31)">
                            <rect
                              x="4"
                              width="54"
                              height="54"
                              rx="27"
                              fill="#50AD59"
                            />
                            <path
                              d="M43.25 25.25H32.75V14.75C32.75 14.2859 32.5656 13.8408 32.2374 13.5126C31.9092 13.1844 31.4641 13 31 13C30.5359 13 30.0908 13.1844 29.7626 13.5126C29.4344 13.8408 29.25 14.2859 29.25 14.75V25.25H18.75C18.2859 25.25 17.8408 25.4344 17.5126 25.7626C17.1844 26.0908 17 26.5359 17 27C17 27.4641 17.1844 27.9092 17.5126 28.2374C17.8408 28.5656 18.2859 28.75 18.75 28.75H29.25V39.25C29.25 39.7141 29.4344 40.1592 29.7626 40.4874C30.0908 40.8156 30.5359 41 31 41C31.4641 41 31.9092 40.8156 32.2374 40.4874C32.5656 40.1592 32.75 39.7141 32.75 39.25V28.75H43.25C43.7141 28.75 44.1592 28.5656 44.4874 28.2374C44.8156 27.9092 45 27.4641 45 27C45 26.5359 44.8156 26.0908 44.4874 25.7626C44.1592 25.4344 43.7141 25.25 43.25 25.25Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_d_304_31"
                              x="0"
                              y="0"
                              width="62"
                              height="62"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="4" />
                              <feGaussianBlur stdDeviation="2" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_304_31"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_304_31"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                        <div
                          className="trashcan"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            questionDeleteHandler(e, questionIndex);
                          }}
                        >
                          <FaTrash size={25} color="red" />
                        </div>
                      </div>
                      {errors[`question${questionIndex}`] && (
                        <div className="text-danger pt-1">
                          {errors[`question${questionIndex}`].message ||
                            "Question is required"}
                        </div>
                      )}
                      <div className="my-2 px-2">
                        {question?.options?.map((option, optionIndex) => {
                          return (
                            <div
                              className={`${styles.options} d-flex align-items-center my-3`}
                            >
                              <h2
                                className={styles.questionNumber}
                                style={{
                                  background: `${
                                    option?.isCorrect ? "green" : ""
                                  }`,
                                }}
                              >
                                {optionIndex + 1}
                              </h2>
                              <input
                                type="text"
                                placeholder="Option"
                                className={styles.optionInput}
                                value={option.option}
                                {...register(
                                  `question${questionIndex}option${optionIndex}`,
                                  {
                                    required: {
                                      value: true,
                                      message: "Option is required",
                                    },
                                  }
                                )}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    e
                                  )
                                }
                              />
                              {errors[
                                `question${questionIndex}option${optionIndex}`
                              ] && (
                                <div className="text-danger pt-1">
                                  {errors[
                                    `question${questionIndex}option${optionIndex}`
                                  ].message || "Option is required"}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <div className={`${styles.dropdown} input-group mb-3 `}>
                          <div className={` input-group-prepend`}>
                            <label
                              className="input-group-text"
                              for="inputGroupSelect01"
                            >
                              Correct Answer
                            </label>
                          </div>
                          <select
                            key={questionIndex}
                            {...register(`question${questionIndex}correct`, {
                              required: {
                                value: true,
                                message: "Correct Answer is required",
                              },
                            })}
                            className="custom-select"
                            id={`inputGroupSelect${questionIndex + 1}`}
                            onChange={(event) =>
                              handleChange(event, questionIndex)
                            }
                          >
                            <option value="">Choose...</option>
                            {question.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={optionIndex}>
                                {optionIndex + 1}{" "}
                              </option>
                            ))}
                          </select>
                          {errors[`question${questionIndex}correct`] && (
                            <div className="text-danger pt-1">
                              {errors[`question${questionIndex}correct`]
                                .message || "Correct Answer is required"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
              <div className={styles.nextPrevButtonDiv}>
                <div className="d-flex justify-content-start">
                  <button className={styles.submit} type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
        {showVideoModal && (
          <AddVideoModal
            show={showVideoModal}
            hide={() => setShowVideoModal(false)}
            courseId={courseId || ""}
          />
        )}
      </Container>
    </>
  );
};

export default AddQuizzes;
