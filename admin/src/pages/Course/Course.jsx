// ----------------------------------------------Imports----------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import styles from "../pagesCSS/Course.module.css";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import {
  addCourse,
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import {
  resetVideoState,
  setVideoLoading,
} from "../../features/slices/Video/videoSlice";
import {
  resetChapterData,
  resetChapterState,
} from "../../features/slices/Chapter/chapterSlice";
import AddVideoModal from "../Videos/AddVideoModal";
import { FaHeartPulse, FaRegCirclePlay } from "react-icons/fa6";

import VideosSkeleton from "../../components/skeletonUi/VideosSkeleton";
import { addChapter } from "../../features/actions/Chapter/chapterActions";
import axios from "axios";
import { handleQuizPost } from "../../features/actions/Quiz/quizAction";
import { useNavigate } from "react-router";
import {
  resetCourseAddState,
  resetCourseState,
} from "../../features/slices/Course/courseSlice";
import { resetQuizAddStatus } from "../../features/slices/Quiz/quizSlice";
import { FaTimes, FaTrash } from "react-icons/fa";
import { fetchCategories } from "../../features/actions/Category/categoryActions";
import { MdArrowForwardIos, MdKeyboardArrowRight } from "react-icons/md";
import VideoDescriptionModal from "../../components/Modals/VideoDescriptionModal/VideoDescriptionModal";

// ---------------------------------------------------------------------------------------------------------

const Course = () => {
  // ---------------------------------------------States-----------------------------------------------------
  const [index, setIndex] = useState(0);
  let count = 0;
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
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleThumbnail, setModuleThumbnail] = useState("");
  const [courseUpdateStatus, setCourseUpdateStatus] = useState(false);
  const [categorySelectionData, setCategorySelectionData] = useState([]);
  const [categorySelectedData, setCategorySelectedData] = useState([]);
  const [videoDetails, setVideoDetails] = useState({});
  const [videoPreviewData, setVideoPreviewData] = useState([]);

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

  const { isVideoAdded, videoData } = useSelector((state) => state?.video);
  const { isChapterAdded, chapterData, isChapterLoading } = useSelector(
    (state) => state?.chapter
  );

  const categoryData = useSelector((state) => state?.category?.categoryData);
  // ----------------------------------------------functions--------------------------------------------------

  const handleNextClick = (data) => {
    setAccordianData([
      ...accordianData,
      { chapterName: data.chapterName, description: data.chapterDescription },
    ]);
  };

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
        chapterId: "",
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
  const handleAddVideoClick = () => {
    fileInputRef.current.click();
  };

  const handlefileSelect = (event) => {
    const selectedFile = event.target.files[0];
  };

  //addCourseHandler - handler to call the course adding api
  const addCourseHandler = (data) => {
    try {
      const formData = new FormData();

      let courseCategory =
        Array?.isArray(categorySelectedData) &&
        categorySelectedData?.length > 0 &&
        categorySelectedData.map((category) => category?._id);

      const { courseName, courseDescription } = data;
      formData.append(
        "payload",
        JSON.stringify({ courseName, courseDescription, courseCategory })
      );
      formData.append(
        "originalThumbnailName",
        JSON.stringify(data?.courseThumbnail[0]?.name)
      );
      formData.append("courseThumbnail", data?.courseThumbnail[0]);

      confirmAlert({
        title: "NOTE!",
        message: "Changes cannot be edited till complete submission",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              dispatch(addCourse(formData));
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

  // chapterResetHandler - handler to reset the chapter state
  const chapterResetHandler = () => {
    dispatch(resetVideoState());
    setChapterName("");
    setChapterDescription("");
  };

  const handleChapter = (data) => {
    try {
      Array.isArray(videoPreviewData) &&
        videoPreviewData.length > 0 &&
        videoPreviewData.forEach((video) => {
          data.chapterVideos = data?.chapterVideos
            ? [...data?.chapterVideos, video?._id]
            : [video?._id];
        });

      setModuleName("");
      setModuleDescription("");

      const { chapterName, chapterDescription, chapterVideos } = data;

      confirmAlert({
        title: "NOTE!",
        message: "Changes cannot be edited after submission",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (
                Array.isArray(videoPreviewData) &&
                videoPreviewData.length > 0
              ) {
                dispatch(
                  addChapter({
                    chapterName,
                    chapterDescription,
                    chapterVideos,
                    courseId,
                  })
                );
                setChapterName("");
                setChapterDescription("");
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

  // courseFinalSubmitHandler - handler to add the course to the db with all the data
  const courseFinalSubmitHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Final Course Submission",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              if (Array.isArray(chapterData) && chapterData.length > 0) {
                const formData = new FormData();
                const payload = JSON.stringify({ courseChapters: chapterData });
                formData.append("payload", payload);
                formData.append("courseThumbnail", "");

                const res = dispatch(handleQuizPost(questions));
                const quizRes = await res;
                if (quizRes?.payload?.success) {
                  dispatch(updateCourse({ payload: formData, courseId }));
                }
              } else {
                toast.error("Please add the chapters to proceed further");
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

  // handleCourseSelection -- handler to add the selected data to the selected category state
  const handleCourseCategorySelection = (e) => {
    const value = JSON.parse(e.target.value) || {};

    let arr = [];
    if (Object.keys(value).length > 0) {
      if (categorySelectedData.length == 0) {
        for (let i of categorySelectionData) {
          if (
            i?.categoryName?.toLowerCase()?.trim()?.replaceAll(" ", "") !==
            value?.categoryName?.toLowerCase()?.trim()?.replaceAll(" ", "")
          ) {
            arr.push(i);
          }
        }
        setCategorySelectionData(arr);
        setCategorySelectedData([...categorySelectedData, value]);
        reset();
      } else {
        toast.error("Course can only have 1 Category");
        reset();
      }
    } else {
      toast.error("Nothing is selected");
      reset();
    }
  };

  // removeCourseCategoryHandler -- handler to remove the added course category
  const removeCourseCategoryHandler = (e, value) => {
    const val = value || {};

    let arr = [];
    if (Object.keys(val).length > 0) {
      for (let i of categorySelectedData) {
        if (
          i?.categoryName?.toLowerCase()?.trim()?.replaceAll(" ", "") !==
          val?.categoryName?.toLowerCase()?.trim()?.replaceAll(" ", "")
        ) {
          arr.push(i);
        }
      }
      setCategorySelectedData(arr);
      setCategorySelectionData([...categorySelectionData, val]);
      reset();
    } else {
      toast.error("Nothing is selected");
      reset();
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

  // videoDrop -- handler to handle the video drop
  const videoDrop = (e, videoIndex) => {
    const draggedVideoIndex = e.dataTransfer.getData("draggedVideoIndex");
    if (draggedVideoIndex != videoIndex) {
      const arr = JSON.parse(JSON.stringify(videoPreviewData));
      const draggedData = JSON.parse(JSON.stringify(arr[draggedVideoIndex]));
      const dataToBeSwitched = JSON.parse(JSON.stringify(arr[videoIndex]));
      arr[draggedVideoIndex] = dataToBeSwitched;
      arr[videoIndex] = draggedData;
      setVideoPreviewData(arr);
    }
  };

  // videoDragStart -- handler to handle the video drag start
  const videoDragStart = (e, videoIndex) => {
    e.dataTransfer.setData("draggedVideoIndex", videoIndex);
  };

  // ---------------------------------------------------------------------------------------------------------

  // -------------------------------------------------useEffect-----------------------------------------------

  useEffect(() => {
    if (isVideoAdded) {
      setShowVideoModal(false);
    }
  }, [isVideoAdded]);

  useEffect(() => {
    if (courseId !== "") {
      setIndex(1);
    }

    if (isChapterAdded) {
      setVideoPreviewData([]);
      dispatch(resetVideoState());
      dispatch(resetChapterState());
    }

    if (isCourseUpdated && isQuizAdded) {
      navigate("/courses_list");
      setIndex(0);
      dispatch(fetchCourses());
      dispatch(fetchCategories());
      dispatch(resetChapterData());
      dispatch(resetCourseState());
      dispatch(resetQuizAddStatus(false));
    }

    if (isCourseAdded) {
      setIndex(index + 1);
      dispatch(resetCourseAddState());
    }
  }, [courseId, isChapterAdded, isQuizAdded, isCourseAdded]);

  useEffect(() => {
    if (videoData && Array?.isArray(videoData) && videoData.length > 0) {
      setVideoPreviewData(videoData);
    }
  }, [videoData]);

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

    if (
      categoryData &&
      Array?.isArray(categoryData?.categoryData) &&
      categoryData?.categoryData?.length > 0
    ) {
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
  ) : isLoading ? (
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
      <section className="course_wrapper">
        <div className="container">
          <div className="row">
            {index === 0 && (
              <div className="col-md-6">
                <div className={styles.course_card}>
                  <form onSubmit={handleSubmit(addCourseHandler)}>
                    <h1 style={{ color: "var(--table-font-color)" }}>
                      Add Course{" "}
                    </h1>
                    <div>
                      <h1 className={styles.title}>Course Name</h1>
                    </div>

                    <div>
                      <input
                        value={moduleName}
                        className={`${styles.moduleName}`}
                        {...register("courseName", {
                          required: {
                            value: true,
                            message: "Course Name is required",
                          },
                          onChange: (e) => {
                            setModuleName(e.target.value);
                          },
                        })}
                        type="text"
                        id="courseName"
                        placeholder="Course Name"
                      />
                      {errors.courseName && (
                        <div className="text-danger pt-1">
                          {errors.courseName.message ||
                            "Course Name is required"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className={styles.title}>Course Description</h1>
                    </div>
                    <div>
                      <textarea
                        value={moduleDescription}
                        className={`${styles.description} pt-4`}
                        {...register("courseDescription", {
                          required: {
                            value: true,
                            message: "Course Description is required",
                          },
                          onChange: (e) => {
                            setModuleDescription(e.target.value);
                          },
                        })}
                        type="text"
                        id="courseDescription"
                        placeholder="Course Description"
                      ></textarea>
                      {errors.courseDescription && (
                        <div className="text-danger pt-1">
                          {errors.courseDescription.message ||
                            "Course Description is required"}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.category}`}>
                      <div className={`${styles.courseCategorySelection}`}>
                        <div>
                          <h1 className={styles.title}>Course Category</h1>
                        </div>

                        <select
                          className={`${styles.courseCategory}`}
                          {...register("courseCategory", {
                            required: {
                              value:
                                categorySelectedData?.length === 0
                                  ? true
                                  : false,
                              message: "Course Category is required",
                            },
                            onChange: (e) => {
                              handleCourseCategorySelection(e);
                            },
                          })}
                          type="text"
                          id="courseCategory"
                          placeholder="Course Category"
                        >
                          <option value="">Select Category</option>
                          {Array.isArray(categorySelectionData) &&
                            categorySelectionData?.length > 0 &&
                            categorySelectionData.map((category) => {
                              return (
                                <option value={JSON.stringify(category)}>
                                  {category?.categoryName}
                                </option>
                              );
                            })}
                        </select>
                        {errors.courseCategory && (
                          <div className="text-danger pt-1">
                            {errors.courseCategory.message ||
                              "Course Category is required"}
                          </div>
                        )}
                      </div>
                      <div className={`${styles.courseCategorySelectedItems}`}>
                        <div>
                          <h1 className={styles.title}>Selected Category</h1>
                        </div>
                        <div className={`${styles.assignedCategories}`}>
                          <ul style={{ listStyle: "none" }}>
                            {Array.isArray(categorySelectedData) &&
                              categorySelectedData?.length > 0 &&
                              categorySelectedData.map((category, index) => {
                                return (
                                  <li>
                                    <div className="categoryTag d-flex">
                                      <div className="categoryTagContent col-md-8 py-2">
                                        {category?.categoryName}
                                      </div>
                                      <div
                                        className="categoryButton col-md-4 py-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                          removeCourseCategoryHandler(
                                            e,
                                            category
                                          );
                                        }}
                                      >
                                        <FaTimes />
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h1 className={styles.title}>Course Thumbnail</h1>
                    </div>
                    <div
                      className={`${styles.thumbnail} d-flex flex-column justify-content-start align-items-center`}
                    >
                      <input
                        className={`${styles.thumbnail} pt-1`}
                        {...register("courseThumbnail", {
                          onChange: (e) => {
                            setModuleThumbnail(
                              e.target.files[0]
                                ? URL.createObjectURL(e.target.files[0])
                                : moduleThumbnail
                                ? moduleThumbnail
                                : ""
                            );
                          },
                        })}
                        type="file"
                        accept="image/*"
                        id="courseThumbnail"
                        placeholder="Module Thumbnail"
                      ></input>
                      {errors.courseThumbnail && (
                        <div className="text-danger pt-1">
                          {errors.courseThumbnail.message ||
                            "Module Thumbnail is required"}
                        </div>
                      )}
                      <div
                        className={`${styles.courseImagePreview}`}
                        style={{
                          backgroundImage: `url(${moduleThumbnail || ""})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                    <div className={styles.nextPrevButtonDiv}>
                      <div className="d-flex justify-content-start">
                        <button
                          type="submit"
                          className={`${styles.submit} mx-2`}
                          style={{ cursor: "pointer" }}
                        >
                          Proceed To Add Chapters
                          <span className="mx-2">&gt;</span>
                        </button>
                      </div>
                    </div>
                    {/* </div> */}
                  </form>
                </div>
              </div>
            )}
            {/* --------------------------chapter section --------------------------- */}

            {index === 1 && (
              <>
                {isChapterLoading ? (
                  <VideosSkeleton />
                ) : (
                  <div className="col-md-6">
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
                          defaultValue={""}
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
                          value={chapterName}
                          onChange={(e) => setChapterName(e.target.value)}
                        />
                        {errors.chapterName && (
                          <div className="text-danger pt-1">
                            {errors.chapterName.message ||
                              "Chapter Name is Required"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h1 className={styles.title}>Description</h1>
                      </div>
                      <div>
                        <textarea
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
                          value={chapterDescription}
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
                          <div className="d-flex overflow-auto">
                            {Array.isArray(videoPreviewData) &&
                              videoPreviewData.length > 0 &&
                              videoPreviewData.map((item, videoIndex) => {
                                return (
                                  <div
                                    style={{ width: "auto" }}
                                    className="col-1 px-1"
                                    onClick={() => {
                                      setShowVideoDescriptionModal(
                                        !showVideoDescriptionModal
                                      );
                                      setVideoDetails(item);
                                    }}
                                    draggable={true}
                                    onDrop={(e) => {
                                      videoDrop(e, videoIndex);
                                    }}
                                    onDragStart={(e) => {
                                      videoDragStart(e, videoIndex);
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    <div
                                      style={{
                                        // backgroundColor: "white",
                                        backgroundImage: `url("${item?.localVideoThumbnail}")`,
                                        // backgroundOrigin:"center",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        height: "5rem",
                                        cursor: "pointer",
                                        width: "120px",
                                      }}
                                      className="d-flex justify-content-center align-items-center border"
                                    >
                                      <FaRegCirclePlay
                                        style={{ color: "white" }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles.nextPrevButtonDiv} d-flex justify-content-start align-items-start`}
                      >
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIndex(index + 2);
                            }}
                            className={`${styles.submit} mx-2`}
                            style={{ cursor: "pointer" }}
                          >
                            Next<span className="mx-2">&gt;</span>
                          </button>
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
                  </div>
                )}
              </>
              // -----------------------   quiz section ----------------------------------------------------
            )}

            {index === 3 && (
              <div className="col-md-6">
                <form onSubmit={handleSubmit(courseFinalSubmitHandler)}>
                  <h1>Quiz</h1>
                  {questions?.map((question, questionIndex) => {
                    return (
                      <>
                        <div className="my-3">
                          <p className={styles.questiontext}>{`Question ${
                            questionIndex + 1
                          }`}</p>
                          <select
                            className={styles.chapterDropdown}
                            {...register(`question${questionIndex}chapter`, {
                              required: {
                                value: true,
                                message: "Chapter Name is required",
                              },
                            })}
                            id=""
                            onChange={(e) => {
                              const updatedQuestion = [...questions];
                              updatedQuestion[questionIndex].chapterId =
                                e.target.value;
                              setQuestions(updatedQuestion);
                            }}
                          >
                            <option value="">Select Chapter</option>
                            {chapterData?.map((chapters) => (
                              <option value={chapters?._id ?? "NA"}>
                                {chapters?.chapterName}
                              </option>
                            ))}
                          </select>
                          {errors[`question${questionIndex}chapter`] && (
                            <div className="text-danger pt-1">
                              {errors[`question${questionIndex}chapter`]
                                .message || "Chapter Name is required"}
                            </div>
                          )}
                          <div className="d-flex gap-2">
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
                                  }
                                )}
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
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => {
                          setIndex(index - 2);
                        }}
                        className={`${styles.submit} mx-2`}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="mx-2">&lt;</span> Previous
                      </button>
                      <button className={styles.submit} type="submit">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
          {showVideoModal && (
            <AddVideoModal
              show={showVideoModal}
              hide={() => setShowVideoModal(false)}
              courseId={courseId || ""}
            />
          )}
          {showVideoDescriptionModal && (
            <VideoDescriptionModal
              show={showVideoDescriptionModal}
              hide={() => setShowVideoDescriptionModal(false)}
              videoDetails={videoDetails}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Course;
