// ---------------------------------------------------Imports-------------------------------------------------
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./StudyMaterialEdit.module.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import { useLocation, useNavigate } from "react-router-dom";
import { resetCourseState } from "../../features/slices/Course/courseSlice";
import { TailSpin } from "react-loader-spinner";
import "../pagesCSS/CourseEdit.module.css";
import { FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import {
  addPdfQuiz,
  getPdfQuizzes,
  updatePdfQuiz,
} from "../../features/actions/StudyMaterial/studyMaterialActions";
import { resetStudyMaterialStatus } from "../../features/slices/StudyMaterial/studyMaterialSlice";

// ------------------------------------------------------------------------------------------------------------

const StudyMaterialEdit = () => {
  // ---------------------------------------------------States-------------------------------------------------

  const [newPdfFile, setNewPdfFile] = useState("");
  // -------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Hooks----------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const studyMaterial = location?.state?.studyMaterial || {};

  const [questions, setQuestions] = useState([...studyMaterial?.quizzes]);

  const { isStudyMaterialUpdated, isLoading } = useSelector(
    (state) => state?.studyMaterial
  );

  // -------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Functions-------------------------------------------------
  // updateStudyMaterial -- updateStudyMaterial in order to call the create study material api
  const updateStudyMaterial = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to Update the Study Material",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (studyMaterial?._id) {
                let formData = new FormData();
                const { pdfName, pdfDescription } = data;

                let payloadObj = JSON.stringify({
                  pdfName,
                  pdfDescription,
                  quizzes: questions,
                });

                formData.append(
                  "pdfFile",
                  newPdfFile && newPdfFile.length > 0 ? newPdfFile : ""
                );
                formData.append("payload", payloadObj);

                dispatch(
                  updatePdfQuiz({ id: studyMaterial?._id, payload: formData })
                );
              } else {
                toast.error("No Study Material ID found! Try Again");
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

  //   handleQuestionChange -- function to track the input field changes
  const handleQuestionChange = (index, e) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index].question = e.target.value;
    setQuestions(updatedQuestion);
  };

  //   handleAddQuestion -- function to add the question to the state
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
      },
    ]);
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
              setQuestions((question) => {
                let copy = JSON.stringify(question);
                let copyData = JSON.parse(copy);

                copyData.splice(index, 1);
                return copyData;
              });
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

  //   handleOptionChange -- function to handle the change in the options state
  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].option =
      e.target.value;
    setQuestions(updatedQuestions);
  };

  //   handleChange -- function to handle the correct answer changes
  const handleChange = (event, questionIndex) => {
    const optionIndex = event.target.value;
    handleCorrectOption(questionIndex, optionIndex);
  };

  const handleCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.forEach((option) => {
      option.isCorrect = false;
    });
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = true;
    setQuestions(updatedQuestions);
  };
  // -----------------------------------------------------------------------------------------------------------
  // -------------------------------------------------useEffects-----------------------------------------------
  useEffect(() => {
    if (isStudyMaterialUpdated) {
      reset();
      dispatch(resetStudyMaterialStatus(false));
      dispatch(getPdfQuizzes());
      navigate("/study_material_list");
    }
  }, [isStudyMaterialUpdated]);
  // --------------------------------------------------------------------------------------------------------
  return isLoading ? (
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
            <form onSubmit={handleSubmit(updateStudyMaterial)}>
              <h1>Edit Study Material</h1>
              <div>
                <h1 className={styles.title}>PDF Name</h1>
              </div>

              <div>
                <input
                  defaultValue={studyMaterial?.pdfName || ""}
                  className={`${styles.moduleName}`}
                  {...register("pdfName", {
                    required: {
                      value: true,
                      message: "PDF Name is required",
                    },
                  })}
                  type="text"
                  id="pdfName"
                  placeholder="PDF Name"
                />
                {errors.pdfName && (
                  <div className="text-danger pt-1">
                    {errors.pdfName.message || "PDF Name is required"}
                  </div>
                )}
              </div>
              <div>
                <h1 className={styles.title}>PDF Description</h1>
              </div>
              <div>
                <textarea
                  defaultValue={studyMaterial?.pdfDescription || ""}
                  className={`${styles.description} pt-4`}
                  {...register("pdfDescription", {
                    required: {
                      value: true,
                      message: "PDF Description is required",
                    },
                  })}
                  type="text"
                  id="pdfDescription"
                  placeholder="PDF Description"
                ></textarea>
                {errors.pdfDescription && (
                  <div className="text-danger pt-1">
                    {errors.pdfDescription.message ||
                      "PDF Description is required"}
                  </div>
                )}
              </div>
              <div>
                <h1 className={styles.title}>Existing PDF File</h1>
              </div>
              <div className={`${styles.thumbnail}`}>
                <a
                  className={`${styles.thumbnail} pt-1`}
                  href={`${studyMaterial?.mediaFile}`}
                  style={{ textDecoration: "none", color: "red" }}
                  target="_blank"
                >
                  {`${JSON.stringify(studyMaterial?.mediaFile).slice(0, 100)}`}
                </a>
              </div>
              <div>
                <h1 className={styles.title}>Select a new PDF File</h1>
              </div>
              <div className={`${styles.thumbnail}`}>
                <input
                  className={`${styles.thumbnail} pt-1`}
                  type="file"
                  accept=".pdf"
                  id="pdfFile"
                  onChange={(e) => {
                    setNewPdfFile(e.target.files[0]);
                  }}
                ></input>
              </div>
              <div>
                <h1 className={styles.title}>Add Quiz</h1>
              </div>
              <div>
                <div className={`${styles.quizContainer} pt-4`}>
                  <Row>
                    <Col>
                      {questions?.map((question, questionIndex) => {
                        let selectedCorrectAnswer;
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
                                    onChange: (e) => {
                                      handleQuestionChange(questionIndex, e);
                                    },
                                  })}
                                />

                                <svg
                                  onClick={handleAddQuestion}
                                  className={`${styles.cursor_pointer} mx-2`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="42"
                                  height="42"
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
                                      <feComposite
                                        in2="hardAlpha"
                                        operator="out"
                                      />
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
                                {Array.isArray(questions) &&
                                  questions?.length !== 1 && (
                                    <div
                                      className="trashcan"
                                      style={{ cursor: "pointer" }}
                                      onClick={(e) => {
                                        questionDeleteHandler(e, questionIndex);
                                      }}
                                    >
                                      <FaTrash size={30} color="red" />
                                    </div>
                                  )}
                              </div>
                              {errors[`question${questionIndex}`] && (
                                <div className="text-danger pt-1">
                                  {errors[`question${questionIndex}`].message ||
                                    "Question is required"}
                                </div>
                              )}
                              <div className="my-2 px-2">
                                {question?.options?.map(
                                  (option, optionIndex) => {
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
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                          className={styles.optionInput}
                                          value={option.option}
                                          {...register(
                                            `question${questionIndex}option${optionIndex}`,
                                            {
                                              required: {
                                                value: "true",
                                                message: "Option is required",
                                              },
                                              onChange: (e) =>
                                                handleOptionChange(
                                                  questionIndex,
                                                  optionIndex,
                                                  e
                                                ),
                                            }
                                          )}
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
                                  }
                                )}

                                <div
                                  className={`${styles.dropdown} input-group mb-3 `}
                                >
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
                                    {...register(
                                      `question${questionIndex}correct`,
                                      {
                                        required: {
                                          value: true,
                                          message: "Correct Answer is required",
                                        },
                                        onChange: (event) => {
                                          handleChange(event, questionIndex);
                                        },
                                      }
                                    )}
                                    className="custom-select"
                                    id={`inputGroupSelect${questionIndex + 1}`}
                                  >
                                    <option value="">Choose...</option>
                                    {question.options.map(
                                      (option, optionIndex) => (
                                        <option
                                          key={optionIndex}
                                          value={optionIndex}
                                        >
                                          {optionIndex + 1}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                                {errors[`question${questionIndex}correct`] && (
                                  <div className="text-danger pt-1">
                                    {errors[`question${questionIndex}correct`]
                                      .message || "Correct Answer is required"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={styles.nextPrevButtonDiv}>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                  >
                    Update Study Material
                  </button>
                </div>
              </div>
              {/* </div> */}
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudyMaterialEdit;
