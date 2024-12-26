// ------------------------------------------------Imports---------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import styles from "./CourseDetails.module.css";
import { BsGlobe, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

import Sample from "./assets/Sample.jpg";
import {
  AiOutlineYoutube,
  AiOutlineMobile,
  AiTwotoneStar,
} from "react-icons/ai";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { PiCertificate } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import Accordion from "react-bootstrap/Accordion";
import Slider from "react-slick";
import bg4 from "../../assets/images/bg4.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import { getAllStatus } from "../../features/actions/Video/videoActions";
import { useDispatch, useSelector } from "react-redux";
import CourseAccordion from "./CourseAccordion";
import { resetVideoStatus } from "../../features/slices/Video/videoSlice";
import { TailSpin } from "react-loader-spinner";

// ---------------------------------------------------------------------------------------------------------

const CourseDetails = () => {
  // -------------------------------------------------States---------------------------------------------------
  let video = "";
  let check = false;
  const [ratingStar, setRatingStar] = useState(0);
  const [played, setPlayed] = useState(0);
  const [chapterQuiz, setChapterQuiz] = useState([]);
  const [courseVideos, setCourseVideos] = useState([]);
  const [currentChapter, setCurrentChapter] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [isVideoAlreadyCompleted, setIsVideoAlreadyCompleted] = useState(false);
  const [courseDataChanged, setCourseDataChanged] = useState(false);

  // ---------------------------------------------------------------------------------------------------------
  // -------------------------------------------------Hooks---------------------------------------------------
  const location = useLocation();
  const courseData = location?.state?.courseData || {};
  const navigate = useNavigate();
  const videoEl = useRef(null);
  const dispatch = useDispatch();
  const { isVideoStatusAdded, isLoading } = useSelector(
    (state) => state?.video
  );
  const courseStatus = useSelector((state) => state?.video?.courseStatus);
  const [course, setCourse] = useState(courseData || {});

  console.log("this is the course Data", courseData);

  // ---------------------------------------------------------------------------------------------------------
  // -------------------------------------------------Functions---------------------------------------------------

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
  // ------------------------------------------------useEffect-----------------------------------------------

  useEffect(() => {
    if (isVideoStatusAdded) {
      dispatch(getAllStatus());
      dispatch(resetVideoStatus(false));
    }
  }, [isVideoStatusAdded]);

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

  // ---------------------------------------------------------------------------------------------------------

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
      <div className={`${styles.course_details_banner}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-12 col-12">
              <div className="">
                <div className={styles.courseHeadingTxt}>
                  <h1>
                    {courseData?.courseName ||
                      "100 Days of Code:The Complete Python Pro Bootcamp for 2023"}
                  </h1>
                </div>
                <div>
                  {courseData?.courseDescription ||
                    "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!"}
                </div>
                <span>Created By : </span>
                <span className="text-decoration-underline">
                  {courseData?.providerDetails?.fullName || "N.A"}
                </span>
                <div>
                  Language <BsGlobe /> : <span>English</span>{" "}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-12 text-center">
              <div>
                <div className=" mt-2">
                  <img
                    src={courseData?.courseThumbnail}
                    alt="banner"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="mt-3">
                  <div>Subscribe to LMS top courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className={styles.what_learn_section}>
                <h2 className="fs-3 fw-bold my-3">What you'll learn</h2>
                <p>{courseData?.courseName || "N.A"}</p>
              </div>
              <div className="course_benefits">
                <h2 className="fs-3 fw-bold my-3">This course includes :</h2>
                <ul className={styles.course_benefites_list}>
                  <li className={styles.list_items}>
                    <AiOutlineYoutube className="mx-2" /> 9.5 hours on-demand
                    video
                  </li>
                  <li className={styles.list_items}>
                    <AiOutlineMobile className="mx-2" />
                    95 downloadable resources
                  </li>
                  <li className={styles.list_items}>
                    <HiOutlineFolderDownload className="mx-2" />
                    Access on mobile and Tv
                  </li>
                  <li className={styles.list_items}>
                    <PiCertificate className="mx-2" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
              <div className="py-4">
                <div className="fs-4 fw-bold my-3">Course Content</div>
                <ul className="d-flex gap-md-5 gap-sm-2 gap-2 flex-sm-column flex-column flex-md-row">
                  <li>
                    {Array.isArray(courseData?.courseChapters) &&
                    courseData?.courseChapters.length > 0
                      ? `${courseData?.courseChapters?.length} Chapters`
                      : "N.A."}
                  </li>
                  <li>35 Lectures </li>
                  <li>35 Hours total length</li>
                </ul>
                <div>
                  <Accordion defaultActiveKey="0">
                    {course &&
                      Array.isArray(course?.courseChapters) &&
                      course?.courseChapters?.length > 0 &&
                      course?.courseChapters?.map((ele, index) => {
                        return (
                          <CourseAccordion
                            chapter={ele}
                            chapterIndex={index}
                            key={index}
                            courseData={courseData}
                          />
                        );
                      })}
                  </Accordion>
                </div>
              </div>
              <div className="course_description">
                <h2 className="fs-4 fw-bold my-3">Description</h2>
                {courseData?.courseDescription || (
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                    hic minima fugiat provident laudantium ipsa laboriosam,
                    fugit <strong>doloremque</strong> ipsum dolorum quis animi
                    nobis porro. Laborum repellat numquam rerum illum corporis
                    consequuntur ducimus ,<strong>laboriosam</strong> voluptas.
                    Iusto quam dolorem cupiditate nostrum maiores, dolores
                    officia vero delectus natus accusantium neque incidunt{" "}
                    <strong>reprehenderit</strong> quod.
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className={styles.sidebar_add}>
                <h2 className="text-center">Check out our LinkedIn Page</h2>
                <p>Look out for more information...</p>
                <div className="button_subscribe w-100">
                  <button className="btn btn-dark w-100">
                    <a
                      href="https://www.linkedin.com/company/gravita-oasis-review-solutions-pvt-ltd/about/"
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Click Here
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="course_reviews my-5"
        style={{
          background: "#f7f9fa",
          paddingTop: "40px",
          paddingBottom: "50px",
        }}
      >
        <div className="container">
          <h2 className="mb-3">Courses Reviews</h2>
          <div className="row">
            <Slider {...settings}>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`card ${styles.cardSection}`}
                  style={{
                    // width: "20rem",
                    margin: "10px",
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <div className="card-link d-flex align-items-center">
                      <img
                        src={bg4}
                        alt="bg4"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50px" }}
                      />
                      <div className="profile_content mx-3">
                        <h6 className="card-title">Christopher White</h6>
                        <h6 className="card-subtitle text-muted">Student</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
          <div className="write_review my-5">
            <h2 className="mt-3">Write Your Reviews</h2>
            <ReactStars {...rating} />
            <div>{`${ratingStar} out of 5`}</div>
            <textarea
              className="form-control"
              rows="10"
              placeholder="Your Reivew"
              name="review"
              id="review"
            ></textarea>
            <div className="review_button">
              <button className="btn btn-dark mt-3">Submit</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
