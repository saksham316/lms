// ---------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../pagesCSS/QuizEdit.module.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
// import Select from "react-select";
import { updateQuiz } from "../../features/actions/Quiz/quizAction";
import { resetQuizStatus } from "../../features/slices/Quiz/quizSlice";
import { fetchCourses } from "../../features/actions/Course/courseActions";

// ------------------------------------------------------------------------------------------------------

const QuizEdit = () => {
  // ---------------------------------------------States---------------------------------------------------

  const [index, setIndex] = useState();
  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------Hooks---------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const location = useLocation();

  const quizData = location?.state?.quiz || {};

  const { isQuizUpdated } = useSelector((state) => state?.quiz);

  const [question, setQuestion] = useState({
    question: quizData?.question || "",
    options: [
      {
        option: quizData?.options?.[0]?.option || "",
        isCorrect: quizData?.options?.[0]?.isCorrect || false,
      },
      {
        option: quizData?.options?.[1]?.option || "",
        isCorrect: quizData?.options?.[1]?.isCorrect || false,
      },
      {
        option: quizData?.options?.[2]?.option || "",
        isCorrect: quizData?.options?.[2]?.isCorrect || false,
      },
      {
        option: quizData?.options?.[3]?.option || "",
        isCorrect: quizData?.options?.[3]?.isCorrect || false,
      },
    ],
    chapterId: quizData?.chapterId || "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();
  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions------------------------------------------------
  // quizUpdateHandler -- handler to update the quiz
  const quizUpdateHandler = () => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure! You Want To Update the Quiz",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (quizData && quizData?.chapterId) {
                dispatch(updateQuiz({ id: quizData?._id, payload: question }));
              } else {
                toast.error("Error While Updating");
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

  // handleQuestionChange -- handler to handler the change in the question
  const handleQuestionChange = (e) => {
    setQuestion({ ...question, question: e.target.value });
  };

  //   handleChange
  const handleChange = (e) => {
    if (e.target.value !== "") {
      setQuestion((prevState) => {
        let copiedData = JSON.parse(JSON.stringify(prevState));
        let options = copiedData?.options;
        let newOptions =
          Array.isArray(options) &&
          options?.map((option) => {
            return { ...option, isCorrect: false };
          });

        for (let i = 1; i <= newOptions?.length; i++) {
          if (i == e.target.value) {
            newOptions.splice(i - 1, 1, {
              ...newOptions[i - 1],
              isCorrect: true,
            });
            break;
          }
        }
        return { ...copiedData, options: newOptions };
      });
    }
  };

  //   handleOptionChange
  const handleOptionChange = (e, optionIndex) => {
    setQuestion((prevState) => {
      let copiedData = JSON.parse(JSON.stringify(prevState));
      let options = copiedData?.options;
      let copyOption = JSON.parse(JSON.stringify(options[optionIndex]));
      let option = { ...copyOption, option: e.target.value };
      Array.isArray(options) && options?.splice(optionIndex, 1, option);
      return copiedData;
    });
  };
  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------useEffects-----------------------------------------------
  useEffect(() => {
    if (isQuizUpdated) {
      dispatch(fetchCourses())
      dispatch(resetQuizStatus(false));
      navigate("/quizzes_list");
    }
  }, [isQuizUpdated]);

  // ------------------------------------------------------------------------------------------------------
  return (
    <>
      <Container>
        <Row>
          <Col className="">
            <form onSubmit={handleSubmit(quizUpdateHandler)}>
              <h1>Edit Quiz</h1>
              <>
                <div className="my-3">
                  <p className={styles.questiontext}>{`Question`}</p>
                  <div className="d-flex gap-2">
                    <input
                      className={styles.questionbox}
                      type="text"
                      placeholder="Ask a Question"
                      value={question.question || ""}
                      {...register(`question`, {
                        required: {
                          value: true,
                          message: "Question is required",
                        },
                        onChange: (e) => {
                          handleQuestionChange(e);
                        },
                      })}
                    />
                  </div>
                  {errors[`question`] && (
                    <div className="text-danger pt-1">
                      {errors[`question`].message || "Question is required"}
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
                              background: `${option?.isCorrect ? "green" : ""}`,
                            }}
                          >
                            {optionIndex + 1}
                          </h2>
                          <input
                            type="text"
                            placeholder="Option"
                            className={styles.optionInput}
                            value={option?.option || ""}
                            {...register(`questionOption${optionIndex}`, {
                              required: {
                                value: true,
                                message: "Option is required",
                              },
                            })}
                            onChange={(e) => handleOptionChange(e, optionIndex)}
                          />
                          {errors[`questionOption${optionIndex}`] && (
                            <div className="text-danger pt-1">
                              {errors[`questionOption${optionIndex}`].message ||
                                "Option is required"}
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
                        {...register(`questionCorrect`, {
                          required: {
                            value: true,
                            message: "Correct Answer is required",
                          },
                        })}
                        className="custom-select"
                        id={`inputGroupSelect${1}`}
                        onChange={(event) => handleChange(event)}
                      >
                        <option value="">Choose...</option>
                        {question.options.map((option, optionIndex) => (
                          <option
                            key={optionIndex}
                            selected={option?.isCorrect ? true : false}
                            value={optionIndex + 1 || ""}
                          >
                            {optionIndex + 1}
                          </option>
                        ))}
                      </select>
                      {errors[`questionCorrect`] && (
                        <div className="text-danger pt-1">
                          {errors[`questionCorrect`].message ||
                            "Correct Answer is required"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
              <div className={styles.nextPrevButtonDiv}>
                <div className="d-flex justify-content-center">
                  <button className={styles.submit} type="submit">
                    Update Quiz
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

export default QuizEdit;
