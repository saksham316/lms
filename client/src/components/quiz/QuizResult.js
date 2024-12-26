// ---------------------------------------------------Imports ------------------------------------------------
import React, { useState } from "react";
import styles from "./Quiz.module.css";
import { useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetResultData } from "../../features/slices/Quiz/quizSlice";
// import useBackbutton from "../../hooks/useBackbutton";
import { useEffect } from "react";
import { resetStudyMaterialData } from "../../features/slices/StudyMaterial/studyMaterialSlice";
export const QuizResult = () => {
  //--------------------------------------------------States----------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------Hooks----------------------------------------------------
  const location = useLocation();
  const courseData = location?.state?.courseData || {};
  const QuizData = location?.state?.QuizData || {};
  const studyMaterial = location?.state?.studyMaterial || {};

  const dispatch = useDispatch();

  const { quizResult } = useSelector((state) => state?.quiz);
  const { studyMaterialResult } = useSelector((state) => state?.studyMaterial);


  // ------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------Functions----------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------------
  return (
    <div
      className={`${styles.quiz_wrapper}  d-flex justify-content-center align-items-center`}
    >
      <div className={`w-50 mx-auto rounded ${styles.quiz_container}`}>
        <div className="row p-3 gap-3">
          {/* Quiz header start */}
          <div className={`col-md-12 d-flex justify-content-between`}>
            <div className={`text-success w-100  text-center`}>
              <span className={`mx-2 `}>Your result</span>{" "}
            </div>
          </div>

          {/* Quiz start */}
          <div
            className={`col-md-12 bg-light px-5 py-4 d-flex flex-column gap-2`}
          >
            {Object.keys(studyMaterial).length > 0 ? (
              <div>
                <div>
                  PDF Name:
                  <span>
                    {`${studyMaterialResult?.data?.pdfName}` || "NA"}{" "}
                  </span>
                </div>
                <div>
                  Total Marks:
                  <span>
                    {`${studyMaterialResult?.data?.maximumMarks}` || "NA"}
                  </span>
                </div>
                <div>
                  Marks Obtained:
                  <span>
                    {`${studyMaterialResult?.data?.totalScore}` || "NA"}
                  </span>
                </div>
                <div>
                  Attempted:
                  <span>
                    {`${studyMaterialResult?.data?.attempted}` || "NA"}
                  </span>
                </div>
                <div>
                  Un-Attempted:
                  <span>
                    {`${studyMaterialResult?.data?.unattempted}` || "NA"}
                  </span>
                </div>
              </div>
            ) : Object.keys(QuizData).length > 0 ? (
              <div>
                <div>
                  Course: <span>{courseData?.courseName || ""} </span>
                </div>
                <div>
                  Chapter: <span>{QuizData?.chapterName || ""} </span>
                </div>
                <div>
                  Total Marks:
                  <span>
                    {Array?.isArray(QuizData?.chapterQuizzes) &&
                    QuizData?.chapterQuizzes?.length > 0
                      ? QuizData?.chapterQuizzes?.length
                      : "NA"}
                  </span>
                </div>
                <div>
                  Marks Obtained:
                  <span>
                    {quizResult &&
                    quizResult?.data?.chapterQuizScore &&
                    Array.isArray(quizResult?.data?.chapterQuizScore) &&
                    quizResult?.data?.chapterQuizScore?.length > 0
                      ? `${quizResult?.data?.chapterQuizScore?.[0]?.score}`
                      : "NA"}
                  </span>
                </div>
              </div>
            ) : (
              <div>Not Found</div>
            )}

            {Object.keys(studyMaterial).length > 0 ? (
              <Link
                className="btn btn-success"
                to={`/study-material`}
                state={{ courseData }}
                onClick={() => {
                  dispatch(resetStudyMaterialData());
                }}
              >
                Check Out Other Study Material
              </Link>
            ) : Object.keys(QuizData).length > 0 ? (
              <Link
                className="btn btn-success"
                to={`/courseDetails`}
                state={{ courseData }}
                onClick={() => {
                  dispatch(resetResultData());
                }}
              >
                Check Out Other Chapters
              </Link>
            ) : (
              <Link
                className="btn btn-success"
                to={`/`}
                onClick={() => {
                  dispatch(resetResultData());
                }}
              >
                Not Found
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
