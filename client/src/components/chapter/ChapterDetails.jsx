// ----------------------------------------------Imports---------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import styles from "./ChapterDetails.module.css";
import { BsGlobe, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

import {
  AiOutlineYoutube,
  AiOutlineMobile,
  AiTwotoneStar,
} from "react-icons/ai";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { PiCertificate } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import Accordion from "react-bootstrap/Accordion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import {
  addVideoStatus,
  getAllStatus,
} from "../../features/actions/Video/videoActions";
import { useDispatch, useSelector } from "react-redux";
import { resetVideoStatus } from "../../features/slices/Video/videoSlice";
import { TailSpin } from "react-loader-spinner";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BiLock } from "react-icons/bi";

// -----------------------------------------------------------------------------------------------------

const ChapterDetails = () => {
  // -----------------------------------------------States----------------------------------------------
  let video = "";
  let check = false;
  const [ratingStar, setRatingStar] = useState(0);
  const [played, setPlayed] = useState(0);
  const [selectedChapterVideo, setSelectedChapterVideo] = useState({});
  const [currentChapter, setCurrentChapter] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [chapterVideoIndex, setChapterVideoIndex] = useState(0);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------Hooks---------------------------------------------------
  const location = useLocation();
  const navigate = useNavigate();
  const videoEl = useRef(null);
  const dispatch = useDispatch();
  const modalRef = useRef();
  const { isVideoStatusAdded, isLoading } = useSelector(
    (state) => state?.video
  );
  const chapterVideo = location?.state?.chapterVideo || {};
  const chapterIndex = location?.state?.chapterIndex || "";
  const chapter = location?.state?.chapter || {};
  const courseData = location?.state?.courseData || {};
  const courseStatus = useSelector((state) => state?.video?.courseStatus);
  const [course, setCourse] = useState(courseData || {});

  // -----------------------------------------------------------------------------------------------------
  // --------------------------------------------Functions---------------------------------------------------
  const videoCompletionChecker = (video) => {
    if (
      Array.isArray(courseStatus?.videoData) &&
      courseStatus?.videoData?.length > 0
    ) {
      for (let j = 0; j < courseStatus?.videoData?.length; j++) {
        if (video?._id === courseStatus?.videoData[j]?.videoId) {
          check = true;
          video = {
            ...video,
            unlocked: true,
            finished: true,
          };
          return video;
        }
      }
      check = false;
      let newVideo = {
        ...video,
        unlocked: true,
        finished: false,
      };
      return newVideo;
    } else {
      check = false;
      video = {
        ...video,
        unlocked: true,
        finished: false,
      };
      return video;
    }
  };
  // ----------------------------------------------useEffect---------------------------------------------
  useEffect(() => {
    if (chapterVideo && Object.keys(chapterVideo).length > 0) {
      setSelectedChapterVideo(chapterVideo);
    }
  }, [chapterVideo]);

  useEffect(() => {
    if (isVideoStatusAdded) {
      dispatch(getAllStatus());
      dispatch(resetVideoStatus(false));
    }
  }, [isVideoStatusAdded]);

  useEffect(() => {
    if (chapterIndex + 1) {
      setSelectedChapterIndex(chapterIndex);
    }
  }, [chapterIndex]);

  useEffect(() => {
    if (chapter && Object.keys(chapter).length > 0) {
      setCurrentChapter(chapter);
    }
  }, [chapter]);
  console.log("isVideoFinished", isVideoFinished);

  useEffect(() => {
    // logic to set the users chapter video completion data
    if (
      played >=
      0.9 * selectedChapterVideo?.videoGoogleCloudDetails?.[0]?.duration
    ) {
      if (!selectedChapterVideo?.finished && !isVideoFinished) {
        setIsVideoFinished(true);
        dispatch(
          addVideoStatus({
            videoId: selectedChapterVideo?._id,
            chapterId: selectedChapterVideo?.chapterId,
            courseId: selectedChapterVideo?.courseId,
          })
        );
      }
    }
    if (
      played === selectedChapterVideo?.videoGoogleCloudDetails?.[0]?.duration
    ) {
      if (
        currentChapter?.chapterVideos?.indexOf(selectedChapterVideo) ==
        currentChapter?.chapterVideos?.length - 1
      ) {
        toast.success("Now Complete the Quiz", {
          position: "top-right",
        });
        navigate("/welcome-quiz", {
          state: {
            QuizData: currentChapter,
            courseData,
            videoId: selectedChapterVideo?._id,
            chapterId: currentChapter?._id,
          },
        });
      }
    }
  }, [played]);

  useEffect(() => {
    if (
      courseData &&
      courseData?.courseChapters &&
      Array.isArray(courseData?.courseChapters) &&
      courseData?.courseChapters?.length > 0
    ) {
      courseData?.courseChapters?.map((chapter, chapterIndex) => {
        check = false;
        if (
          Array?.isArray(chapter?.chapterVideos) &&
          chapter?.chapterVideos?.length > 0
        ) {
          for (let i = 0; i < chapter?.chapterVideos?.length; i++) {
            let videoIndex = i;
            let video = chapter?.chapterVideos[i];
            if (videoIndex == 0) {
              const changedVideo = videoCompletionChecker(video);
              setCourse((prevData) => {
                if (prevData !== undefined) {
                  let cour = JSON.parse(
                    JSON.stringify(prevData?.courseChapters)
                  );
                  cour[chapterIndex].chapterVideos.splice(i, 1, changedVideo);
                  let obj = { ...prevData, courseChapters: cour };
                  return obj;
                }
              });
            } else if (check) {
              if (
                Array?.isArray(courseStatus?.videoData) &&
                courseStatus?.videoData?.length > 0
              ) {
                const changedVideo = videoCompletionChecker(video);
                setCourse((prevData) => {
                  if (prevData !== undefined) {
                    let cour = JSON.parse(
                      JSON.stringify(prevData?.courseChapters)
                    );
                    cour[chapterIndex].chapterVideos.splice(i, 1, changedVideo);
                    let obj = { ...prevData, courseChapters: cour };
                    return obj;
                  }
                });
              } else {
                break;
              }
            } else {
              break;
            }
          }
        }
      });
    }
  }, [courseStatus]);

  // ------------------------------------------------------------------------------------------------------

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    // cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const rating = {
    size: 20,
    count: 5,
    color: "black",
    activeColor: "orange",
    value: ratingStar,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStar />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: (newValue) => {
      setRatingStar(newValue);
    },
  };

  // --------------------------------------------------------------------------------------------------
  return (
    <div>
      {isLoading && (
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
      )}
      <div
        className="mediaContainer col-md-12 col-12 col-sm-12 d-flex justify-content-center"
        style={{ overflow: "scroll" }}
      >
        <div
          className={`${styles.container} row col-md-12 d-flex justify-content-center `}
        >
          <div
            className={`${styles.videocontainer} mediaPlayer col-md-8 col-sm-8 col-12 d-flex gap-3align-items-center flex-column`}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            <div className="reactmPlayer col-md-12 col-12 col-sm-12 d-flex justify-content-center align-items-center">
              <div className="player col-md-12 col-12 col-sm-12 d-flex justify-content-center align-items-center">
                <ReactPlayer
                  //url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
                  // url="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
                  url={`${selectedChapterVideo?.videoLink || ""}`}
                  playing={playing}
                  controls={true}
                  config={{
                    file: { attributes: { controlsList: "nodownload" } },
                  }}
                  // playIcon={<button>Play</button>}
                  onProgress={(progress) => {
                    setPlayed(progress.playedSeconds);
                  }}
                  className={styles.reactPlayer}
                />
              </div>
            </div>
            <div
              className="videoTitle col-md-12 col-sm-12 col-12 "
              style={{ fontSize: "24px", fontWeight: "800" }}
            >
              {selectedChapterVideo?.videoTitle || "N.A"}
            </div>
            <div className="videoTitle col-md-12 col-sm-12 col-12 ">
              {selectedChapterVideo?.videoDescription || "N.A"}
            </div>
          </div>
          <div
            className={`${styles.playlistcontainer} mediaPlaylist col-md-4 col-sm-4 col-12 overflow-x-hidden`}
            // style={{
            //   height: "80vh",
            //   background: "black",
            // }}
          >
            <Accordion
              style={{ marginTop: "0px !important" }}
              defaultActiveKey={[`${chapterIndex || 0}`]}
            >
              <Accordion.Item eventKey={""}>
                {course &&
                  Array?.isArray(course?.courseChapters) &&
                  course?.courseChapters?.length > 0 &&
                  course?.courseChapters?.map((chapter, chapterIndex) => {
                    return (
                      <>
                        <Accordion.Item eventKey={`${chapterIndex}`}>
                          <Accordion.Header className={styles.accordionHeader}>
                            {chapter?.chapterName?.toUpperCase() || "N.A"}
                          </Accordion.Header>
                          <Accordion.Body className="col-md-12 col-sm-12 col-12">
                            {Array.isArray(chapter?.chapterVideos) &&
                              chapter?.chapterVideos?.length > 0 &&
                              chapter?.chapterVideos?.map(
                                (chapterVideo, videoIndex) => {
                                  return (
                                    <div
                                      className="col-md-12 col-sm-12 col-12"
                                      // data-bs-toggle={`${videoFlag ? "modal" : ""}`}
                                      // data-bs-target={`${videoFlag ? "#exampleModal" : ""}`}
                                      style={{
                                        cursor: `${
                                          chapterVideo?.unlocked
                                            ? "pointer"
                                            : "not-allowed"
                                        }`,
                                        color: `${
                                          chapterVideo?._id ==
                                          selectedChapterVideo?._id
                                            ? "blue"
                                            : ""
                                        }`,
                                      }}
                                      onClick={
                                        chapterVideo?.unlocked
                                          ? () => {
                                              currentChapter !== chapter &&
                                                setCurrentChapter(chapter);
                                              setSelectedChapterVideo(
                                                chapterVideo
                                              );
                                              setChapterVideoIndex(videoIndex);
                                              setSelectedChapterIndex(
                                                chapterIndex
                                              );
                                              setIsVideoFinished(false);
                                            }
                                          : () => {}
                                      }
                                    >
                                      {/* <AiOutlineYoutube className="me-2" /> */}
                                      <div
                                        className=" m-2 d-flex col-md-12 gap-2"
                                        style={{
                                          boxShadow:
                                            "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                        }}
                                      >
                                        <div className="col-md-3 col-sm-3 col-3">
                                          <img
                                            src={chapterVideo?.thumbnail}
                                            alt="thumbnail"
                                            style={{
                                              opacity: `${
                                                chapterVideo?.unlocked ? 1 : 0.6
                                              }`,
                                              height: "100px",
                                              objectFit: "contain",
                                            }}
                                            className={`${styles.cousesThumbnail}m-1 col-md-12 col-sm-12 col-12`}
                                            // style={{width:"200px", height:"100px", objectFit:"contain"}}
                                          />
                                        </div>

                                        <div
                                          className="col-md-3 col-sm-3 col-3 d-flex align-items-center w-md-75"
                                          style={{ width: "60%" }}
                                        >
                                          <p
                                            className={
                                              styles.descriptionofChapter
                                            }
                                            style={{
                                              margin: 0,
                                              opacity: `${
                                                chapterVideo?.unlocked ? 1 : 0.6
                                              }`,
                                            }}
                                          >
                                            {chapterVideo?.videoDescription
                                              .length > 180
                                              ? `${chapterVideo?.videoDescription
                                                  ?.toUpperCase()
                                                  .slice(0, 180)}...`
                                              : `${
                                                  chapterVideo?.videoDescription
                                                    ? chapterVideo?.videoDescription?.toUpperCase()
                                                    : "N.A"
                                                }`}
                                          </p>
                                        </div>
                                        {chapterVideo?.finished && (
                                          <div className="checkIcon  d-flex align-items-center justify-content-start col-md-3 col-sm-3 col-3">
                                            <IoCheckmarkCircle
                                              size={"35"}
                                              style={{
                                                color: "green",
                                              }}
                                              className="col-md-3 col-sm-3 col-3"
                                            />
                                          </div>
                                        )}

                                        {!chapterVideo?.unlocked && (
                                          <div className="lockIcon d-flex align-items-center justify-content-start col-md-3 col-sm-3 col-3">
                                            <BiLock
                                              size={"35"}
                                              className="col-md-3 col-sm-3 col-3"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </>
                    );
                  })}
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetails;
