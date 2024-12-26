// ----------------------------------------------Imports------------------------------------------------

import styles from "./WelcomePage.module.css";
import Slider from "react-slick";
import { AiTwotoneStar } from "react-icons/ai";
import DataScience from "../../assets/images/data-science.png";
import Categoryskeleton from "../Loader/skeletons/categorySkeleton/Categoryskeleton";
import OutCome from "../../assets/images/pics1.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchCourses,
  fetchUserCourses,
  searchUserCourses,
} from "../../features/actions/courseAction";
import { getAllStatus } from "../../features/actions/Video/videoActions";
import TopCoursesSkeleton from "../Loader/skeletons/topCoursesSkeleton/TopCoursesSkeleton";
import Banerskeleton from "../Loader/skeletons/Banerskeleton/Banerskeleton";
import { toast } from "react-toastify";
import CommonCarousel from "../Carousel/CommonCarousel";
import TopCarousel from "../Carousel/TopCarousel";
import { lowerSlideImages } from "../../assets/lowerSlideImage.js";
import DropDown from "../DropDown/DropDown";
import { setCourseMappingData } from "../../features/slices/courseSlice.js";
// -----------------------------------------------------------------------------------------------

const WelcomePage = () => {
  // --------------------------------------------States-----------------------------------------------
  const [active, setActive] = useState(0);
  const [categoryName, setCategoryName] = useState("All");
  const [showLoader, setShowLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [searchChanged, setSearchChanged] = useState(false);
  // -------------------------------------------------------------------------------------------------
  // --------------------------------------------Hooks-----------------------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    isCourseLoading,
    isSearchCourseLoading,
    isCourseMappingDataLoading,
  } = useSelector((state) => state.course);
  const courseData = useSelector((state) => state.course.courseData) || {};

  const courseMappingData =
    useSelector((state) => state.course.courseMappingData) || {};

  const courseStatus = useSelector((state) => state?.video?.courseStatus);

  // -------------------------------------------------------------------------------------------------
  // --------------------------------------------useEffects-------------------------------------------

  useEffect(() => {
    let timer;
    if (search !== "") {
      timer = setTimeout(() => {
        dispatch(searchUserCourses(`searchCourses=${search}`));
      }, 500);
    } else {
      if (searchChanged) {
        (async () => {
          setShowLoader(true);
          let courseRes = dispatch(fetchUserCourses());
          let res = await courseRes;
          if (res?.payload?.success) {
            dispatch(setCourseMappingData(res?.payload));
          }
          setShowLoader(false);
        })();
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    // dispatch(fetchCourses());
    let getData = async () => {
      try {
        setShowLoader(true);
        let courseRes = dispatch(fetchUserCourses());
        let res = await courseRes;
        if (res?.payload?.success) {
          dispatch(setCourseMappingData(res?.payload));
          dispatch(getAllStatus());
        }
        setShowLoader(false);
      } catch (error) {
        console.error(error.message);
      }
    };
    getData();
  }, []);

  // -------------------------------------------------------------------------------------------------
  // --------------------------------------------Functions--------------------------------------------
  // -------------------------------------------------------------------------------------------------

  const settings = {
    dots: true,
    infinite: courseData?.length > 3,
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
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 767,
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

  // ---------------------------------------------------------------------------------------------------
  return (
    <>
      {/* Course banner  */}
      <section className={styles.home_carousel}>
        {isLoading ? <Banerskeleton /> : <TopCarousel />}
      </section>

      {/* Top Categories */}
      <section className={`top-categories ${styles.top_categories}`}>
        <div className="container">
          <div className="row">
            <div>
              <ul
                className={`nav nav-pills mb-5 d-flex gap-3`}
                id="pills-tab"
                role="tablist"
              >
                <li
                  className="nav-item "
                  role="presentation"
                  style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                >
                  <button
                    className={`nav-link ${active == 0 && "active"} ${
                      styles.nav_link
                    }`}
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target={`#cat0`}
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                    onClick={(e) => {
                      setActive(0);
                      setCategoryName("All");
                      dispatch(fetchUserCourses());
                    }}
                    style={{
                      zIndex: 1,
                      position: "relative",
                      boxShadow: "none",
                    }}
                  >
                    All
                  </button>
                </li>
                {Array.isArray(courseData?.categories) &&
                  courseData?.categories?.length > 0 &&
                  courseData?.categories?.map((cat, index) => {
                    return (
                      <li
                        className="nav-item"
                        role="presentation"
                        style={{
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                      >
                        <button
                          className={`nav-link ${
                            index + 1 == active && "active"
                          }`}
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target={`#cat0`}
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                          onClick={(e) => {
                            setActive(index + 1);
                            setCategoryName(cat?.categoryName);
                            dispatch(fetchUserCourses(`id=${cat?._id || ""}`));
                          }}
                          style={{
                            zIndex: 1,
                            position: "relative",
                            boxShadow: "none",
                          }}
                        >
                          {cat?.categoryName?.toUpperCase() || "N.A"}
                        </button>
                      </li>
                    );
                  })}
              </ul>
              {/* <h2 className="my-5">{categoryName?.toUpperCase() || "N.A"}</h2> */}

              <div className="tab-content" id="pills-tabContent">
                {isCourseLoading ? (
                  <Categoryskeleton />
                ) : (
                  <div
                    className="tab-pane fade show active"
                    id="cat0"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabIndex={0}
                  >
                    <div className="row">
                      <Slider {...settings}>
                        {Array.isArray(courseData?.data) &&
                        courseData?.data?.length > 0
                          ? courseData?.data?.map((course, index) => {
                              return (
                                <div
                                  className={`col-md-4 ${styles.allcategoryCard}`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    navigate("/courseDetails", {
                                      state: { courseData: course },
                                    });
                                  }}
                                >
                                  <div
                                    className={`${styles.cardImage} card`}
                                    style={{
                                      height: "200px",
                                      marginTop: "45px",
                                    }}
                                  >
                                    <img
                                      src={
                                        course?.courseThumbnail || DataScience
                                      }
                                      className={styles.card_img_top}
                                      alt="..."
                                    />
                                    <div className="card-body text-center mt-4">
                                      <h5 className="card-title">
                                        {course?.courseName.length > 15
                                          ? `${course?.courseName
                                              ?.toUpperCase()
                                              .slice(0, 16)}...`
                                          : `${
                                              course?.courseName
                                                ? course?.courseName?.toUpperCase()
                                                : "N.A"
                                            }`}
                                      </h5>
                                      <p className="card-text fs-6">
                                        {course?.courseDescription.length > 50
                                          ? `${course?.courseDescription
                                              ?.toUpperCase()
                                              .slice(0, 50)}...`
                                          : `${
                                              course?.courseDescription
                                                ? course?.courseDescription?.toUpperCase()
                                                : "N.A"
                                            }`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : Array(3)
                              .fill(true)
                              .map((item) => {
                                return (
                                  <div
                                    className={`col-md-4 ${styles.allcategoryCard}`}
                                    style={{
                                      cursor: "pointer",
                                      display: "flex !important",
                                    }}
                                  >
                                    <div
                                      className={`${styles.cardImage} card d-flex justify-content-center align-items-center`}
                                      style={{
                                        height: "200px",
                                        marginTop: "45px",
                                      }}
                                    >
                                      <h2 className="text-center">
                                        No Category Assigned
                                      </h2>
                                    </div>
                                  </div>
                                );
                              })}
                      </Slider>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className={styles.top_courses}>
        <div className={styles.background_overlay}></div>
        <div className="container">
          <div className="search_bar position-relative d-flex justify-content-between align-items-center w-100 h-100">
            <h2 className="mb-3 position-relative text-white fs-1">
              Top Courses
            </h2>
            {courseMappingData &&
            Object?.keys(courseMappingData).length > 0 &&
            Array.isArray(courseMappingData?.data) &&
            courseMappingData?.data?.length > 0 ? (
              <input
                disabled={showLoader ? true : false}
                type="text"
                className="form-control w-25"
                placeholder="Search Courses.."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchChanged(true);
                }}
                style={{ opacity: `${showLoader ? "0.7" : "1"}` }}
              />
            ) : (
              searchChanged && (
                <input
                  disabled={showLoader ? true : false}
                  type="text"
                  className="form-control w-25"
                  placeholder="Search Courses.."
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchChanged(true);
                  }}
                  style={{ opacity: `${showLoader ? "0.7" : "1"}` }}
                />
              )
            )}
          </div>
          <div className="row">
            {isCourseMappingDataLoading || showLoader ? (
              <TopCoursesSkeleton />
            ) : (
              <div className="col-md-12">
                <Slider {...settings}>
                  {courseMappingData &&
                  Object?.keys(courseMappingData).length > 0 &&
                  Array.isArray(courseMappingData?.data) &&
                  courseMappingData?.data?.length > 0
                    ? courseMappingData?.data?.map((item) => {
                        let progress = 0;

                        if (
                          Array?.isArray(courseStatus?.courseData) &&
                          courseStatus?.courseData?.length > 0
                        ) {
                          for (
                            let i = 0;
                            i < courseStatus?.courseData?.length;
                            i++
                          ) {
                            if (
                              item?._id == courseStatus?.courseData[i]?.courseId
                            ) {
                              progress =
                                courseStatus?.courseData[i]
                                  ?.courseCompletionStatus >= 100
                                  ? 100
                                  : Math.floor(
                                      courseStatus?.courseData[i]
                                        ?.courseCompletionStatus
                                    );
                              break;
                            }
                          }
                        }
                        return (
                          <>
                            <div
                              onClick={() =>
                                navigate("/courseDetails", {
                                  state: { courseData: item },
                                })
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`card ${styles.cardSection} border-0`}
                                style={{ width: "20rem", height: "400px" }}
                              >
                                <img
                                  style={{
                                    height: "250px",
                                    objectFit: "cover",
                                  }}
                                  src={
                                    item?.courseThumbnail ||
                                    "https://source.unsplash.com/random/900×700/?technology"
                                  }
                                  className={`card-img-top ${styles.img}`}
                                  alt="..."
                                />
                                <div className="card-body card_body">
                                  <h5
                                    className={`${styles.card_heading} card-title`}
                                  >
                                    {item?.courseName.length > 15
                                      ? `${item?.courseName
                                          ?.toUpperCase()
                                          .slice(0, 16)}...`
                                      : `${
                                          item?.courseName
                                            ? item?.courseName.toUpperCase()
                                            : "N.A"
                                        }`}
                                  </h5>
                                  <p
                                    className={`${styles.card_para} card-text `}
                                    style={{ height: "30px" }}
                                  >
                                    {item?.courseDescription.length > 50
                                      ? `${item?.courseDescription
                                          ?.toUpperCase()
                                          .slice(0, 50)}...`
                                      : `${
                                          item?.courseDescription
                                            ? item?.courseDescription?.toUpperCase()
                                            : "N.A"
                                        }`}
                                  </p>
                                  <div className="progress">
                                    <div
                                      className="progress-bar px-1"
                                      role="progressbar"
                                      style={{
                                        width: `${progress}%`,
                                        background: "blue",
                                        fontSize: "15px",
                                        fontWeight: "bolder",
                                        letterSpacing: "2px",
                                      }}
                                      aria-valuenow={`${progress}%`}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    >
                                      {progress}% Completed
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    : Array(3)
                        .fill(true)
                        .map((item) => {
                          return (
                            <>
                              <div style={{ cursor: "pointer" }}>
                                <div
                                  className={`card ${styles.cardSection} border-0 d-flex justify-content-center align-items-center`}
                                  style={{ width: "20rem", height: "400px" }}
                                >
                                  <h2 className="text-center">
                                    {searchChanged
                                      ? "No Data Found"
                                      : "No Category Assigned"}
                                  </h2>
                                </div>
                              </div>
                            </>
                          );
                        })}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OutComes */}
      <section className={styles.outcomes}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 p-0 m-0 ">
              <div className="image_section">
                <img
                  src={OutCome}
                  alt="outcome"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-md-6 p-0 m-0">
              <div className={styles.outcome_content}>
                <h2>Outcomes Of LMS</h2>
                <p>
                  At Gravita, our mission is to provide comprehensive expertise
                  in reviewing home health charts and related services. We are
                  dedicated to ensuring the accuracy, compliance, and quality of
                  documentation, ultimately supporting the delivery of
                  exceptional patient care. Through our specialized knowledge
                  and commitment to excellence, we strive to streamline
                  processes, optimize revenue, and reduce denials for home
                  health agencies. Our mission is to be a trusted partner,
                  empowering healthcare providers to focus on their core mission
                  of improving patient outcomes while we handle the intricacies
                  of chart review with expertise and diligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Courses */}
      <section className={styles.new_courses}>
        <div className="container">
          <h1 className="mb-3 text-white">Trending Courses</h1>
          <div className="row">
            <Slider {...settings}>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?technology"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?online-study"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?online-study"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?online-study"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?online-study"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div>
                <Link to={"/courseDetails"} style={{ textDecoration: "none" }}>
                  <div
                    className={`card ${styles.cardSection} border-0`}
                    style={{ width: "20rem" }}
                  >
                    <img
                      src="https://source.unsplash.com/random/900×700/?online-study"
                      className={`card-img-top ${styles.img}`}
                      alt="..."
                    />
                    <div className="card-body card_body">
                      <h5 className={`${styles.card_heading} card-title`}>
                        Java Programming and Software Engineering
                        Fundamentals....
                      </h5>
                      <p className={`${styles.card_para} card-text`}>
                        Morem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* Happy Students */}
      <section className={styles.happy_students}>
        <div className="container">
          <h2 className="mb-3">Our Happy Students</h2>
          <div className="row">
            <div className="carousel1 col-md-6 mt-4 mt-md-0">
              <CommonCarousel images={lowerSlideImages.lowerSlideImage1} />
            </div>
            <div className="carousel2 col-md-6 mt-4 mt-md-0">
              <CommonCarousel images={lowerSlideImages.lowerSlideImage2} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WelcomePage;
