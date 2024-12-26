// ---------------------------------------------------Imports-------------------------------------------------
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../pagesCSS/CourseEdit.module.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import { useLocation, useNavigate } from "react-router-dom";
import { resetCourseState } from "../../features/slices/Course/courseSlice";
import { TailSpin } from "react-loader-spinner";
import "../pagesCSS/CourseEdit.module.css";
import { FaTimes } from "react-icons/fa";

// ------------------------------------------------------------------------------------------------------------

const CourseEdit = () => {
  // ---------------------------------------------------States----------------------------------------------------
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [isFieldDataChanged, setIsFieldDataChanged] = useState(false);
  const [moduleThumbnail, setModuleThumbnail] = useState("");
  const [leftCategories, setLeftCategories] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  // -------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Hooks----------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const course = location?.state?.course || {};

  const { isCourseUpdated, isLoading } = useSelector((state) => state?.course);

  const { categoryData } = useSelector((state) => state?.category);

  // -------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Functions-------------------------------------------------
  // editCourseHandler -- editCourseHandler in order to call the edit api
  const editCourseHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to Update the Course Fields",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              let payload;
              const formData = new FormData();

              let arr = [];
              for (let i of assignedCategories) {
                arr.push(i?._id);
              }

              if (moduleThumbnail) {
                payload = JSON.stringify({
                  courseName: data?.courseName,
                  courseDescription: data?.courseDescription,
                  courseCategory: arr,
                });
              } else {
                payload = JSON.stringify({
                  courseName: data?.courseName,
                  courseDescription: data?.courseDescription,
                  courseCategory: arr,
                  courseThumbnail: course?.courseThumbnail,
                });
              }

              formData.append("payload", payload);
              formData.append(
                "courseThumbnail",
                data?.courseThumbnail[0] || ""
              );
              dispatch(
                updateCourse({ payload: formData, courseId: course?._id })
              );
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

  // addCategoryHandler -- handler to add the category to the assigned categories
  const addCategoryHandler = (e) => {
    if(assignedCategories.length == 0 ){
      let value = JSON.parse(e.target.value);
    let val = value?.categoryName?.trim().toLowerCase().replaceAll(" ", "");
    if (e.target.value !== "") {
      let arr = [];
      for (let i of leftCategories) {
        if (i?.categoryName?.trim().toLowerCase().replaceAll(" ", "") !== val) {
          arr.push(i);
        }
      }
      setLeftCategories(arr);
      setAssignedCategories([...assignedCategories, value]);
      reset();
    }
    }else{
      toast.error("Course can only have 1 category")
      reset();
    }
  };

  // removeCategoryHandler -- handler to remove the category
  const removeCategoryHandler = (e, cat) => {
    let val = cat?.categoryName?.trim().toLowerCase().replaceAll(" ", "");
    let arr = [];
    for (let i of assignedCategories) {
      if (i?.categoryName?.trim().toLowerCase().replaceAll(" ", "") !== val) {
        arr.push(i);
      }
    }
    setAssignedCategories(arr);
    setLeftCategories([...leftCategories, cat]);
  };
  // -------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------useEffects-------------------------------------------------
  useEffect(() => {
    if (isCourseUpdated) {
      dispatch(fetchCourses());
      setIsFieldDataChanged(false);
      dispatch(resetCourseState());
      navigate("/courses_list");
    }
  }, [isCourseUpdated]);

  useEffect(() => {
    if (
      categoryData &&
      Array?.isArray(categoryData.categoryData) &&
      categoryData?.categoryData.length > 0
    ) {
      if (course?.courseCategory?.length == 0) {
        setLeftCategories(categoryData?.categoryData);
      } else {
        let arr = [];
        let assArr = [];
        for (let i = 0; i < categoryData?.categoryData?.length; i++) {
          let flag = false;
          let cat = categoryData?.categoryData[i]?._id
            ?.trim()
            ?.toLowerCase()
            ?.replaceAll(" ", "");
          for (let j = 0; j < course?.courseCategory?.length; j++) {
            let assignCat = course?.courseCategory[j]
              ?.trim()
              ?.toLowerCase()
              ?.replaceAll(" ", "");

            if (assignCat == cat) {
              flag = false;
              assArr.push(categoryData?.categoryData[i]);
              break;
            } else {
              flag = true;
            }
          }
          flag && arr.push(categoryData?.categoryData[i]);
        }
        setLeftCategories(arr);
        setAssignedCategories(assArr);
      }
    }
  }, []);

  useEffect(() => {
    setModuleThumbnail(course?.courseThumbnail || "");
  }, []);
  // -------------------------------------------------------------------------------------------------------------
  return isLoading ? (
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
      <Container>
        <Row>
          <Col className="">
            {/* <div className={`${styles.box_shadow}`}> */}
            <form onSubmit={handleSubmit(editCourseHandler)}>
              <h1>Edit Course </h1>
              <div>
                <h1 className={styles.title}>Course Name</h1>
              </div>

              <div>
                <input
                  defaultValue={course?.courseName || ""}
                  // value={moduleName}
                  className={`${styles.moduleName}`}
                  {...register("courseName", {
                    required: {
                      value: true,
                      message: "Course Name is required",
                    },
                    onChange: (e) => {
                      setIsFieldDataChanged(true);
                      setModuleName(e.target.value);
                    },
                  })}
                  type="text"
                  id="courseName"
                  placeholder="Course Name"
                />
                {errors.courseName && (
                  <div className="text-danger pt-1">
                    {errors.courseName.message || "Course Name is required"}
                  </div>
                )}
              </div>
              <div>
                <h1 className={styles.title}>Course Description</h1>
              </div>
              <div>
                <textarea
                  defaultValue={course?.courseDescription || ""}
                  // value={moduleDescription}
                  className={`${styles.description} pt-4`}
                  {...register("courseDescription", {
                    required: {
                      value: true,
                      message: "Course Description is required",
                    },
                    onChange: (e) => {
                      setIsFieldDataChanged(true);

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
                        value: assignedCategories?.length === 0 ? true : false,
                        message: "Course Category is required",
                      },
                      onChange: (e) => {
                        addCategoryHandler(e);
                      },
                    })}
                    type="text"
                    id="courseCategory"
                    placeholder="Course Category"
                  >
                    <option value="">Choose...</option>
                    {Array?.isArray(leftCategories) &&
                      leftCategories?.length > 0 &&
                      leftCategories.map((left) => {
                        return (
                          <option value={JSON.stringify(left)}>
                            {left?.categoryName}
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
                    <div className="categoryTag">
                      <ul style={{ listStyle: "none" }}>
                        {Array?.isArray(assignedCategories) &&
                          assignedCategories?.length > 0 &&
                          assignedCategories.map((cat) => {
                            return (
                              <li>
                                <div className="categoryTag  d-flex">
                                  <div className="categoryTagContent col-md-8 py-2">
                                    {cat?.categoryName}
                                  </div>
                                  <div
                                    className="categoryButton col-md-4 py-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      removeCategoryHandler(e, cat);
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
              </div>
              <div>
                <h1 className={styles.title}>Course Thumbnail</h1>
              </div>
              <div
                className={`${styles.thumbnail}`}
              >
                <input
                  className={`${styles.thumbnail} pt-1`}
                  {...register("courseThumbnail", {
                    onChange: (e) => {
                      setModuleThumbnail(
                        URL.createObjectURL(e.target.files[0])
                      );
                      setIsFieldDataChanged(true);
                    },
                  })}
                  type="file"
                  accept="image"
                  id="courseThumbnail"
                  placeholder="Module Thumbnail"
                ></input>
                {errors.courseThumbnail && (
                  <div className="text-danger pt-1">
                    {errors.courseThumbnail.message ||
                      "Course Thumbnail is required"}
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
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                  >
                    Update Course Fields
                  </button>
                  <button
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    type="button"
                    onClick={() => {
                      if (isFieldDataChanged) {
                        toast.error(
                          "Please Save the Course Field Changes First Before Proceeding"
                        );
                      } else {
                        confirmAlert({
                          title: "NOTE!",
                          message:
                            "Click on Yes to add Chapters to this course",
                          buttons: [
                            {
                              label: "Yes",
                              onClick: () => {
                                navigate("/add_chapters", {
                                  state: { courseId: course?._id },
                                });
                              },
                            },
                            {
                              label: "No",
                              onClick: () => {},
                            },
                          ],
                        });
                      }
                    }}
                  >
                    Want to add more chapter!
                  </button>
                </div>
              </div>
              {/* </div> */}
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CourseEdit;
