// ----------------------------------------------Imports------------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import styles from "./Quiz.module.css";
import useQuizTimer from "./useQuizTimer";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Navigate, useLocation, useNavigate } from "react-router";
import { generateResult } from "../../features/actions/Quiz/quizActions";
import { useDispatch, useSelector } from "react-redux";
import quizSlice, {
  resetQuizStatus,
} from "../../features/slices/Quiz/quizSlice";
import { generateStudyMaterialResult } from "../../features/actions/StudyMaterial/studyMaterialActions";
import { resetStudyMaterialStatus } from "../../features/slices/StudyMaterial/studyMaterialSlice";
import { TailSpin } from "react-loader-spinner";

// ------------------------------------------------------------------------------------------------------------

const Quiz = (props) => {
  // ----------------------------------------------States-------------------------------------------------------
  const [minutes, seconds, resetTimer] = useQuizTimer(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswerId, setSelectedAnswerId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [newCount, setNewCount] = useState(0);
  const [questionChanged, setQuestionChanged] = useState(false);
  // -----------------------------------------------------------------------------------------------------------
  // ----------------------------------------------Hooks--------------------------------------------------------
  const location = useLocation();
  const navigate = useNavigate();
  const [quizPayload, setQuizPayload] = useState([]);
  const nextRef = useRef();

  const QuizData = location?.state?.QuizData || {};
  const videoId = location?.state?.videoId || "";
  const chapterId = location?.state?.chapterId || "";
  const courseData = location?.state?.courseData || {};
  const studyMaterial = location?.state?.studyMaterial || {};
  const { isResultAdded, isQuizResultLoading } = useSelector(
    (state) => state?.quiz
  );
  const { isStudyMaterialResultAdded, isStudyMaterialLoading } = useSelector(
    (state) => state?.studyMaterial
  );
  const dispatch = useDispatch();
  // -----------------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-----------------------------------------------------
  const genResult = () => {
    (Array.isArray(QuizData?.chapterQuizzes) &&
      QuizData?.chapterQuizzes?.length > 0 &&
      dispatch(generateResult({ payload: quizPayload, chapterId, videoId }))) ||
      (Array.isArray(studyMaterial?.quizzes) &&
        studyMaterial?.quizzes?.length > 0 &&
        dispatch(
          generateStudyMaterialResult({
            quizzes: quizPayload,
            pdfId: studyMaterial?._id,
          })
        ));
  };
  // ----------------------------------------------------------------------------------------------------------

  // --------------------------------------------useEffect------------------------------------------------------
  useEffect(() => {
    if (isResultAdded) {
      navigate("/quizresult", {
        replace: true,
        state: { QuizData, courseData },
      });
      dispatch(resetQuizStatus(false));
    }
    if (isStudyMaterialResultAdded) {
      navigate("/quizresult", { replace: true, state: { studyMaterial } });
      dispatch(resetStudyMaterialStatus(false));
    }
  }, [isResultAdded, isStudyMaterialResultAdded]);

  useEffect(() => {
    setNewCount((prevData) => {
      let count = prevData;
      count =
        count - questionIndex >= 0 ? count - questionIndex : questionIndex;
      return count;
    });
  }, [questionIndex]);

  useEffect(() => {
    if (seconds == 1) {
      nextRef.current.click();
    }
  }, [seconds]);

  useEffect(() => {
    if (questionChanged) {
      let question = JSON.parse(JSON.stringify(quizPayload?.[questionIndex]));

      question.selectedAnswer = {
        selectedAnswer,
        optionIndex: selectedIndex,
        selectedAnswerId,
      };

      setQuizPayload((prevData) => {
        let copy = JSON.parse(JSON.stringify(prevData));
        copy.splice(questionIndex, 1, question);

        return copy;
      });
    }
  }, [selectedAnswer]);

  useEffect(() => {
    if (
      Array.isArray(QuizData?.chapterQuizzes) &&
      QuizData?.chapterQuizzes?.length > 0
    ) {
      let quizzes = JSON.parse(JSON.stringify(QuizData?.chapterQuizzes)) || [];

      if (Array?.isArray(quizzes) && quizzes?.length > 0) {
        quizzes?.forEach((quiz, quizIndex) => {
          quiz.selectedAnswer = {
            selectedAnswer,
            optionIndex: selectedIndex,
          };
        });
      }
      setQuizPayload([...quizzes]);
      console.log("quizzes ", quizzes);
    }
    if (
      Array.isArray(studyMaterial?.quizzes) &&
      studyMaterial?.quizzes?.length > 0
    ) {
      let quizzes = JSON.parse(JSON.stringify(studyMaterial?.quizzes)) || [];

      if (Array?.isArray(quizzes) && quizzes?.length > 0) {
        quizzes?.forEach((quiz, quizIndex) => {
          quiz.selectedAnswer = {
            selectedAnswer,
            optionIndex: selectedIndex,
          };
        });
      }
      setQuizPayload([...quizzes]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      navigate("/");
    });
  }, []);
  // ------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------

  return (
    <div
      className={`${styles.quiz_wrapper}  d-flex justify-content-center align-items-center`}
    >
      <div className={`w-50 mx-auto rounded ${styles.quiz_container}`}>
        {isStudyMaterialLoading || isQuizResultLoading ? (
          <div className={`${styles.aftersubmitLoading}`}>
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
          <div className="row p-3 gap-3">
            {/* Quiz header start */}
            <div className={`col-md-12 d-flex justify-content-between`}>
              <div>
                <span>Questions </span>
                <span>
                  {quizPayload.length - 1 >= questionIndex && questionIndex + 1}
                </span>
                / <span>{quizPayload.length}</span>
              </div>
              <div className={`text-success`}>
                <span className={`mx-2`}>You have time</span>
                <span className={`p-1 px-2 border border-success rounded`}>
                  {minutes < 10 ? `0${minutes}` : minutes} :
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            </div>
            {/* Quiz header end */}

            {/* Quiz start */}

            <div
              className={`col-md-12 bg-light px-5 py-4 d-flex flex-column gap-2`}
            >
              <div>
                {/* <span>Question 1</span> */}
                <div className={`fs-4 fw-normal`}>
                  {Array.isArray(quizPayload) &&
                    quizPayload?.length > 0 &&
                    quizPayload[questionIndex]?.question}
                </div>
              </div>
              <div>
                {Array.isArray(quizPayload) &&
                  quizPayload?.length > 0 &&
                  quizPayload[questionIndex]?.options?.map((item, index) => {
                    return (
                      <div className="form-check my-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="answerCheck"
                          checked={
                            `${selectedIndex}` &&
                            `${selectedIndex}` == `${index}`
                          }
                          onChange={() => {
                            setQuestionChanged(true);
                            setSelectedAnswer(item?.option);
                            setSelectedIndex(index);
                            setSelectedAnswerId(item?._id);
                          }}
                        />
                        <label className="form-check-label">
                          {item?.option}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Quiz end */}

            {/* Quiz footer start */}
            <div className={`col-md-12 d-flex flex-column gap-2`}>
              <div
                style={{
                  padding: "2px 0",
                  width: `${1.66666666667 * seconds}%`,
                }}
                className={`rounded bg-dark`}
              ></div>
              <div className={`d-flex justify-content-end`}>
                <button
                  ref={nextRef}
                  onClick={() => {
                    setQuestionChanged(false);
                    setSelectedIndex("");
                    setSelectedAnswer("");
                    setSelectedAnswerId("");
                    if (newCount == quizPayload.length - 1) {
                      genResult();
                    }

                    if (Array.isArray(quizPayload) && quizPayload.length > 0) {
                      if (questionIndex >= quizPayload.length - 1) {
                        setQuestionIndex(questionIndex);
                      } else {
                        setQuestionIndex(questionIndex + 1);
                      }
                    }
                    if (
                      questionIndex <
                      (Array.isArray(quizPayload) &&
                        quizPayload?.length > 0 &&
                        quizPayload.length - 1)
                    ) {
                      resetTimer();
                    }
                  }}
                  type="button"
                  className="btn btn-dark"
                >
                  {questionIndex == quizPayload.length - 1 ? "submit" : "Next"}
                  <FaAngleRight />
                </button>
              </div>
            </div>
            {/* Quiz footer end */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
