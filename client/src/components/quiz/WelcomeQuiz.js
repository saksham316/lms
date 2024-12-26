// -------------------------------------------------Imports--------------------------------------------
import React from "react";
import styles from "./Quiz.module.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
// -----------------------------------------------------------------------------------------------------

const WelcomeQuiz = () => {
  // -----------------------------------------------States------------------------------------------------
  // -----------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks-------------------------------------------------
  const location = useLocation();
  const QuizData = location?.state?.QuizData || {};
  const videoId = location?.state?.videoId || "";
  const chapterId = location?.state?.chapterId || "";
  const courseData = location?.state?.courseData || {};
  const studyMaterial = location?.state?.studyMaterial || {};

  let stateObj =
    Object.keys(QuizData).length > 0 && Object.keys(courseData).length > 0
      ? { QuizData, courseData, videoId, chapterId }
      : Object.keys(studyMaterial).length > 0
      ? { studyMaterial }
      : {};

  const navigate = useNavigate();
  // -----------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-----------------------------------------------
  // -----------------------------------------------------------------------------------------------------
  // ---------------------------------------------useEffects----------------------------------------------
  // -----------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      <div className={styles.welcome_quiz}>
        <h2>Instructions</h2>
        <ul>
          <li>Questions contains 2 marks each</li>
          <li>No negative marking</li>
          <li>Please submit your quiz properly</li>
          <li>Attempt all the questions</li>
        </ul>
        <div className="quiz_start text-center">
          <Button
            onClick={() => {
              navigate("/quiz", { replace: true, state: { ...stateObj } });
            }}
            className="btn btn-dark"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </>
  );
};

export default WelcomeQuiz;
