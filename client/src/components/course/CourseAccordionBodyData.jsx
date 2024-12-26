// -------------------------------------------Imports-------------------------------------------
import React from "react";
import { BiLock } from "react-icons/bi";
import { IoCheckmarkCircle, IoCheckmarkSharp } from "react-icons/io5";
import styles from "./CourseDetails.module.css";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------------------------------

const CourseAccordionBodyData = ({
  chapterVideo,
  videoIndex,
  chapter,
  chapterIndex,
  courseData,
}) => {
  // ---------------------------------------------Hooks------------------------------------------
  const navigate = useNavigate();
  // --------------------------------------------------------------------------------------------
  return (
    <>
      <div
        // data-bs-toggle={`${videoFlag ? "modal" : ""}`}
        // data-bs-target={`${videoFlag ? "#exampleModal" : ""}`}
        style={{
          cursor: `${chapterVideo?.unlocked ? "pointer" : "not-allowed"}`,
        }}
        onClick={
          chapterVideo?.unlocked
            ? () => {
                navigate("/chapterDetails", {
                  state: {
                    chapterVideo,
                    chapterIndex,
                    chapter,
                    courseData,
                  },
                });
              }
            : () => {}
        }
      >
        {/* <AiOutlineYoutube className="me-2" /> */}
        <div
          className=" m-2 d-flex col-md-12 gap-2 flex-wrap"
          style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
        >
          <div className="col-md-3">
            <img
              src={chapterVideo?.thumbnail}
              alt="thumbnail"
              style={{
                opacity: `${chapterVideo?.unlocked ? 1 : 0.6}`,
                height: "100px",
                objectFit: "contain",
              }}
              className={`${styles.cousesThumbnail}  m-1`}
              // style={{width:"200px", height:"100px", objectFit:"contain"}}
            />
          </div>

          <div
            className="col-md-3 d-flex align-items-center w-md-75"
            style={{ width: "60%" }}
          >
            <p
              className={styles.descriptionofChapter}
              style={{
                margin: 0,
                opacity: `${chapterVideo?.unlocked ? 1 : 0.6}`,
              }}
            >
              {chapterVideo?.videoTitle.length > 180
                ? `${chapterVideo?.videoTitle?.toUpperCase().slice(0, 180)}...`
                : `${
                    chapterVideo?.videoTitle
                      ? chapterVideo?.videoTitle?.toUpperCase()
                      : "N.A"
                  }`}
            </p>
          </div>
          {chapterVideo?.finished && (
            <div className="checkIcon  d-flex align-items-center justify-content-end ">
              <IoCheckmarkCircle
                size={"40"}
                style={{
                  color: "green",
                }}
              />
            </div>
          )}

          {!chapterVideo?.unlocked && (
            <div
              className="lockIcon d-flex align-items-center justify-content-end"
              // style={{ width: "100%" }}
            >
              <BiLock size={"40"} />
            </div>
          )}
        </div>
      </div>
      {chapterVideo?.unlocked &&
        videoIndex == chapter?.chapterVideos?.length - 1 && (
          <p
            style={{
              fontSize: "large",
              fontWeight: "500",
              marginLeft: "20px",
              fontFamily: "cursive",
              cursor: "pointer",
              display: "inline",
            }}
            onClick={() => {
              navigate("/welcome-quiz", {
                state: {
                  QuizData: chapter,
                  courseData,
                  chapterId: chapter?._id,
                  videoId: chapterVideo?._id,
                },
              });
            }}
          >
            <style jsx="true">
              {`
                p:hover {
                  color: blue;
                }
              `}
            </style>
            Attempt Quiz
          </p>
        )}
    </>
  );
};

export default CourseAccordionBodyData;
