// ----------------------------------------------Imports----------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import styles from "../pagesCSS/Course.module.css";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourse,
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import {
  resetVideoAddStatus,
  resetVideoDeleteStatus,
  resetVideoState,
  setVideoData,
  videoDataMutation,
} from "../../features/slices/Video/videoSlice";
import {
  resetChapterData,
  resetChapterState,
  resetChapterUpdateStatus,
} from "../../features/slices/Chapter/chapterSlice";
import AddVideoModal from "../Videos/AddVideoModal";
import { FaRegCirclePlay } from "react-icons/fa6";

import VideosSkeleton from "../../components/skeletonUi/VideosSkeleton";
import {
  addChapter,
  updateChapter,
} from "../../features/actions/Chapter/chapterActions";
import { handleQuizPost } from "../../features/actions/Quiz/quizAction";
import { useNavigate, useLocation } from "react-router";
import {
  resetCourseAddState,
  resetCourseState,
  setChapterData,
  setQuizData,
} from "../../features/slices/Course/courseSlice";
import { FaTimes } from "react-icons/fa";
import { deleteVideo } from "../../features/actions/Video/videoActions";
import { TailSpin } from "react-loader-spinner";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import VideoDescriptionModal from "../../components/Modals/VideoDescriptionModal/VideoDescriptionModal.jsx";

// ---------------------------------------------------------------------------------------------------------

const ChapterEdit = () => {
  // ---------------------------------------------States-----------------------------------------------------
  const [index, setIndex] = useState(0);
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
      chapterId: "",
    },
  ]);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showVideoDescriptionModal, setShowVideoDescriptionModal] =
    useState(false);
  const [accordianData, setAccordianData] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [newVideoData, setNewVideoData] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [videoDetails, setVideoDetails] = useState({});

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

  const location = useLocation();

  const chapter = location?.state?.chapter ? location?.state?.chapter : "";

  const { isLoading, isCourseUpdated, isCourseAdded, courseData } = useSelector(
    (state) => state?.course
  );

  const { isVideoAdded, isVideoDeleted, videoData } = useSelector(
    (state) => state?.video
  );
  const { isChapterAdded, chapterData, isChapterUpdated, isChapterLoading } =
    useSelector((state) => state?.chapter);

  // ----------------------------------------------functions--------------------------------------------------

  const handleCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.forEach((option) => {
      option.isCorrect = false;
    });
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = true;
    setQuestions(updatedQuestions);
  };
  const handleAddVideoClick = () => {
    fileInputRef.current.click();
  };

  const handlefileSelect = (event) => {
    const selectedFile = event.target.files[0];
  };

  // chapterResetHandler - handler to reset the chapter state
  const chapterResetHandler = () => {
    dispatch(resetVideoState());
    setChapterName(chapter?.chapterName || "");
    setChapterDescription(chapter?.chapterDescription || "");
  };

  const handleChapter = (data) => {
    try {
      Array.isArray(newVideoData) &&
        newVideoData.length > 0 &&
        newVideoData.forEach((video) => {
          data.chapterVideos = data?.chapterVideos
            ? [...data?.chapterVideos, video?._id]
            : [video?._id];
        });

      const { chapterName, chapterDescription, chapterVideos } = data;

      const payload = { chapterName, chapterDescription, chapterVideos };

      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure! You Want to update the Chapter",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (Array.isArray(newVideoData) && newVideoData.length > 0) {
                if (chapter?._id) {
                  dispatch(updateChapter({ payload, chapterId: chapter?._id }));
                  setChapterName("");
                  setChapterDescription("");
                } else {
                  toast.error("No Chapter Id Found ! Try Again");
                  navigate("/");
                }
              } else {
                toast.error("Add videos before saving");
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

  // videoDeleteHandler -- handler to delete the video and call the delete video api
  const videoDeleteHandler = (videoId, index) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to delete the video",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (newVideoData.length === 1) {
                toast.error("There should be atleast one video");
              } else {
                dispatch(deleteVideo({ videoId }));
                setVideoId(videoId);
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

  useEffect(() => {
    if (isVideoAdded) {
      setShowVideoModal(false);
      setNewVideoData([...newVideoData, videoData[videoData?.length - 1]]);
      dispatch(resetVideoAddStatus(false));
    }
    if (isVideoDeleted) {
      dispatch(resetVideoDeleteStatus(false));
      dispatch(fetchCourses());
      dispatch(videoDataMutation(videoId));
      setNewVideoData((prevData) => {
        let copy = JSON.stringify(prevData);
        let data = JSON.parse(copy);
        let newData = data?.filter((key) => key?._id !== videoId);

        return newData;
      });
    }
  }, [isVideoAdded, isVideoDeleted]);

  useEffect(() => {
    if (isChapterUpdated) {
      navigate("/chapters_list");
      (async () => {
        const coursesRes = dispatch(fetchCourses());
        const courseResPayload = await coursesRes;

        if (courseResPayload.payload.success) {
          dispatch(setQuizData(courseResPayload.payload));
          dispatch(setChapterData(courseResPayload.payload));
          dispatch(resetChapterUpdateStatus(false));
        }
      })();
    }
  }, [isChapterUpdated]);

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
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage =
        "Are you sure you want to leave? All data will be lost.";

      if (confirmationMessage !== undefined) {
        e.returnValue = confirmationMessage;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    if (
      Array.isArray(chapter?.chapterVideos) &&
      chapter?.chapterVideos?.length > 0
    ) {
      setNewVideoData(chapter?.chapterVideos);
    }

    return () => {
      dispatch(resetVideoState());
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ----------------------------------------------------------------------------------------------------
  return isLoading ? (
    <VideosSkeleton />
  ) : isChapterLoading ? (
    <SpinnerLoader />
  ) : (
    <>
      <Container>
        <Row>
          {/* --------------------------chapter section --------------------------- */}

          <Col>
            {Array.isArray(chapterData) &&
              chapterData.length > 0 &&
              chapterData.map((chapter, index) => (
                <Accordion className={` my-3`}>
                  <Accordion.Item
                    eventKey={index}
                    className={styles.chapterdropdown}
                  >
                    <Accordion.Header>
                      {`${index + 1} : ${chapter.chapterName}`}
                    </Accordion.Header>
                    <Accordion.Body>
                      {chapter.chapterDescription}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}

            <form onSubmit={handleSubmit(handleChapter)}>
              <div>
                <h1 className={styles.title}>Chapter Name</h1>
              </div>
              <div>
                <input
                  value={
                    chapterName
                      ? chapterName
                      : chapter?.chapterName
                      ? chapter?.chapterName
                      : ""
                  }
                  {...register("chapterName", {
                    required: {
                      value: true,
                      message: "Chapter Name is required",
                    },
                    onChange: (e) => {
                      setChapterName(e.target.value);
                    },
                  })}
                  className={styles.chapterName}
                  placeholder="Chapter Name"
                  onChange={(e) => setChapterName(e.target.value)}
                />
                {errors.chapterName && (
                  <div className="text-danger pt-1">
                    {errors.chapterName.message || "Chapter Name is Required"}
                  </div>
                )}
              </div>
              <div>
                <h1 className={styles.title}>Description</h1>
              </div>
              <div>
                <textarea
                  value={
                    chapterDescription
                      ? chapterDescription
                      : chapter?.chapterDescription
                      ? chapter?.chapterDescription
                      : ""
                  }
                  {...register("chapterDescription", {
                    required: {
                      value: true,
                      message: "Chapter Description is required",
                    },
                    onChange: (e) => {
                      setChapterDescription(e.target.value);
                    },
                  })}
                  className={`${styles.description} pt-4`}
                  placeholder="Description"
                ></textarea>
                {errors.chapterDescription && (
                  <div className="text-danger pt-1">
                    {errors.chapterDescription.message ||
                      "Chapter Description is required"}
                  </div>
                )}
              </div>
              <div>
                <h1 className={styles.title}>Course Content</h1>
              </div>
              <div
                className={`${styles.contentDiv} d-flex justify-content-between`}
              >
                <div
                  className={styles.contentBox}
                  onClick={() => {
                    setShowVideoModal(!showVideoModal);
                  }}
                >
                  Add Video
                </div>

                {/* horizontal scroll for video starts */}

                {/* horizontal scroll for video ends */}

                {/* hidden file input element  */}
                {/* <input
                  type="file"
                  accept="video"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handlefileSelect}
                /> */}

                {/* hidden file input element  */}
              </div>
              <div className="container-fluid my-2">
                <div>
                  <h1 className={styles.title}>Video Preview</h1>
                </div>
                <div
                  ref={elRef}
                  className={`${styles.scrolling_wrapper} row flex-row flex-nowrap p-2 border border-2 rounded`}
                >
                  {Array.isArray(newVideoData) &&
                    newVideoData.length > 0 &&
                    newVideoData.map((item, index) => {
                      return (
                        <div
                          style={{ position: "relative" }}
                          className="col-2 px-1"
                          onClick={() => {
                            setShowVideoDescriptionModal(
                              !showVideoDescriptionModal
                            );
                            setVideoDetails(item);
                          }}
                        >
                          <div
                            style={{
                              // backgroundColor: "white",
                              backgroundImage: `url("${
                                item?.localVideoThumbnail || item?.thumbnail
                              }")`,
                              // backgroundOrigin:"center",
                              backgroundPosition: "center",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              height: "6rem",
                              cursor: "pointer",
                            }}
                            className="d-flex justify-content-center align-items-center border"
                          >
                            <div
                              style={{
                                borderRadius: "50%",
                                fontSize: "14px",
                                height: "1.5rem",
                                width: "1.5rem",
                                top: "0",
                                right: "0",
                                background: "rgba(242, 38, 19,0.7)",
                              }}
                              className="videoClose position-absolute d-flex justify-content-center  align-items-center"
                              onClick={() => videoDeleteHandler(item?._id)}
                            >
                              <FaTimes />
                            </div>
                            <FaRegCirclePlay style={{ color: "white" }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div
                className={`${styles.nextPrevButtonDiv} d-flex justify-content-start align-items-start`}
              >
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    onClick={chapterResetHandler}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    // disabled = {Array.isArray(videoData) && videoData.length ===0?true:false}
                  >
                    Save
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
            courseId={chapter?.courseId || ""}
          />
        )}
        {showVideoDescriptionModal && (
          <VideoDescriptionModal
            show={showVideoDescriptionModal}
            hide={() => setShowVideoDescriptionModal(false)}
            videoDetails={videoDetails}
          />
        )}
      </Container>
    </>
  );
};

export default ChapterEdit;
