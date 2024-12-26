// -------------------------------------------Imports------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../pagesCSS/EditUserCategories.module.css";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
import {
  getUsers,
  updateUser,
  updateUserCategories,
} from "../../features/actions/Authentication/authenticationActions";
import { resetUserState } from "../../features/slices/Authentication/authenticationSlice";

// --------------------------------------------------------------------------------------------------------------

const EditUserCategories = () => {
  // -------------------------------------------States-------------------------------------------------------------
  const [selectedCategoryCourses, setSelectedCategoryCourses] = useState([]);
  const [user, setUser] = useState({});
  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------Hooks-------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { categoryData } = useSelector((state) => state?.category);

  const { studyMaterialData } = useSelector((state) => state?.studyMaterial);

  const { isLoading, isUserUpdated } = useSelector((state) => state?.auth);

  const enteredUser = location?.state?.user || {};

  const [assignedCourses, setAssignedCourses] = useState([]);

  const [assignedStudyMaterial, setAssignedStudyMaterial] = useState([]);

  const [leftStudyMaterial, setLeftStudyMaterial] = useState([]);

  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------Functions----------------------------------------------------------

  // addCourseHandler -- handler to add the category to the assigned categories
  const addCourseHandler = (e) => {
    let value = JSON.parse(e.target.value);
    let flag = false;
    for (let i = 0; i < assignedCourses?.length; i++) {
      if (assignedCourses[i]?.courseId == value?.courseId) {
        flag = true;
        break;
      }
    }
    if (flag) {
      toast.error("Course is already assigned");
    } else {
      if (e.target.value !== "") {
        setAssignedCourses([...assignedCourses, value]);
        reset();
      }
    }
  };

  // addStudyMaterialHandler -- handler to add the study material to the user
  const addStudyMaterialHandler = (e) => {
    let value = e.target.value !== "" ? JSON.parse(e.target.value) : "";

    if (value && Object.keys(value).length > 0) {
      let arr = [];

      for (let i = 0; i < leftStudyMaterial.length; i++) {
        if (leftStudyMaterial[i]._id !== value?._id) {
          arr.push(leftStudyMaterial[i]);
        }
      }

      setLeftStudyMaterial(arr);
      setAssignedStudyMaterial((prevData) => {
        return [...prevData, value];
      });
      resetField("selectStudyMaterial");
    }
  };

  // removeCourseHandler -- handler to remove the course
  const removeCourseHandler = (course, index) => {
    setAssignedCourses((prevData) => {
      let copy = JSON.stringify(prevData);
      let copyData = JSON.parse(copy);
      copyData?.splice(index, 1);
      return copyData;
    });
  };

  // removeStudyMaterialHandler -- handler to remove the study material
  const removeStudyMaterialHandler = (studyMaterial, index) => {
    setAssignedStudyMaterial((prevData) => {
      let copy = JSON.stringify(prevData);
      let copyData = JSON.parse(copy);
      copyData?.splice(index, 1);
      return copyData;
    });
    setLeftStudyMaterial((prevData) => {
      return [...prevData, studyMaterial];
    });
  };

  // chooseCategoryHandler -- handler to handle the category selection
  const chooseCategoryHandler = (e) => {
    if (e.target.value === "selectAll") {
      let arr = [];
      let obj = {};

      categoryData.categoryData.forEach((category) => {
        for (let i = 0; i < category?.categoryCourses.length; i++) {
          if (!obj[category?.categoryCourses[i].courseId]) {
            arr.push(category?.categoryCourses[i]);
            obj[category?.categoryCourses[i].courseId] = 1;
            reset();
          }
        }
      });

      setAssignedCourses(arr);
    } else {
      setSelectedCategoryCourses(JSON.parse(e.target.value));
    }
  };

  // courseSubmitHandler -- handler to assign the categories
  const courseSubmitHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: `Are You Sure! You want to assign ${
          assignedCourses?.length == 1 ? "this Category" : "these Categories"
        }`,
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              if (user?._id) {
                let formData = new FormData();

                let arr = [];
                let arr2 = [];
                for (let i of assignedCourses) {
                  arr.push(i?.courseId);
                }
                for (let i of assignedStudyMaterial) {
                  arr2.push(i?._id);
                }
                let obj = JSON.stringify({
                  assignedCategories: arr,
                  assignedStudyMaterial: arr2,
                });
                formData.append("payload", obj);
                dispatch(
                  updateUserCategories({
                    payload: formData,
                    id: user?._id,
                  })
                );
              } else {
                toast.error("Error Assigning! Try Again");
                navigate("/");
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
      console.error(error.message);
      toast.error(error?.message);
    }
  };

  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------useEffects----------------------------------------------------------
  useEffect(() => {
    if (isUserUpdated) {
      dispatch(getUsers("/"));
      dispatch(resetUserState(false));
      navigate("/users");
    }
  }, [isUserUpdated]);

  useEffect(() => {
    if (user && user?.assignedCategories?.length > 0) {
      let arr = [];
      for (let i of user?.assignedCategories) {
        arr.push({ courseName: i?.courseName, courseId: i?._id });
      }
      setAssignedCourses(arr);
    }
    if (user && user?.assignedStudyMaterial?.length > 0) {
      let arr = [];
      for (let i = 0; i < studyMaterialData?.data?.length; i++) {
        let flag = false;
        for (let j = 0; j < user?.assignedStudyMaterial.length; j++) {
          if (
            studyMaterialData?.data[i]._id ===
            user?.assignedStudyMaterial[j]._id
          ) {
            flag = false;
            break;
          } else {
            flag = true;
          }
        }
        if (flag) {
          arr.push(studyMaterialData?.data[i]);
        }
      }
      setLeftStudyMaterial(arr);
      setAssignedStudyMaterial(user?.assignedStudyMaterial);
    } else {
      setLeftStudyMaterial(studyMaterialData?.data);
    }
  }, [user]);

  useEffect(() => {
    if (enteredUser && Object.keys(enteredUser).length > 0) {
      setUser(enteredUser);
    }
  }, []);

  // --------------------------------------------------------------------------------------------------------------

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
            <form onSubmit={handleSubmit(courseSubmitHandler)}>
              <h1 style={{ color: "var(--table-font-color)" }}>
                Edit User Assigned Categories
              </h1>
              <div>
                <h1 className={styles.title}>Choose Category</h1>
              </div>
              <div className={`${styles.category}`}>
                <div className={`${styles.categoryNameField}`}>
                  <select
                    //   value={moduleName}
                    className={`${styles.categoryName}`}
                    type="text"
                    id="categoryName"
                    {...register("categoryName", {
                      onChange: (e) => {
                        chooseCategoryHandler(e);
                      },
                    })}
                  >
                    <option value="">Choose...</option>
                    <option
                      value="selectAll"
                      style={{ fontWeight: "bold", color: "black" }}
                    >
                      Select All
                    </option>
                    {Array?.isArray(categoryData?.categoryData) &&
                      categoryData?.categoryData?.length > 0 &&
                      categoryData?.categoryData.map((cat) => {
                        return (
                          <option
                            value={JSON.stringify(cat?.categoryCourses || [])}
                          >
                            {cat?.categoryName?.toUpperCase()?.trim() || ""}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div>
                <h1 className={styles.title}>Select Course</h1>
              </div>
              <div className={`${styles.category}`}>
                <div className={`${styles.categoryNameField}`}>
                  <select
                    //   value={moduleName}
                    className={`${styles.categoryName}`}
                    type="text"
                    id="categoryName"
                    {...register("selectCourse", {
                      onChange: (e) => {
                        addCourseHandler(e);
                      },
                    })}
                  >
                    <option value="">Choose...</option>
                    {Array?.isArray(selectedCategoryCourses) &&
                      selectedCategoryCourses?.length > 0 &&
                      selectedCategoryCourses.map((course) => {
                        return (
                          <option value={JSON.stringify(course)}>
                            {course?.courseName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <>
                <div>
                  <h1 className={styles.title}>
                    Currently Assigned Categories
                  </h1>
                </div>

                <div className={`${styles.category}`}>
                  <div
                    //   value={moduleName}
                    className={`${styles.updateCategoryNameField}`}
                  >
                    <ul>
                      {Array?.isArray(assignedCourses) &&
                        assignedCourses?.length > 0 &&
                        assignedCourses.map((course, index) => {
                          return (
                            <li>
                              <div className="categoryTag col-md-12 d-flex">
                                <div className="categoryTagContent col-md-8">
                                  {course?.courseName}
                                </div>
                                <div
                                  className="categoryButton col-md-4"
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    removeCourseHandler(course, index);
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
              </>
              <div>
                <h1 className={styles.title}>Select Study Material</h1>
              </div>
              <div className={`${styles.category}`}>
                <div className={`${styles.categoryNameField}`}>
                  <select
                    //   value={moduleName}
                    className={`${styles.categoryName}`}
                    type="text"
                    {...register("selectStudyMaterial", {
                      onChange: (e) => {
                        addStudyMaterialHandler(e);
                      },
                    })}
                  >
                    <option value="">Choose...</option>
                    {Array?.isArray(leftStudyMaterial) &&
                      leftStudyMaterial?.length > 0 &&
                      leftStudyMaterial.map((studyMaterial) => {
                        return (
                          <option value={JSON.stringify(studyMaterial)}>
                            {studyMaterial?.pdfName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <>
                <div>
                  <h1 className={styles.title}>
                    Currently Assigned Study Material
                  </h1>
                </div>

                <div className={`${styles.category}`}>
                  <div
                    //   value={moduleName}
                    className={`${styles.updateCategoryNameField}`}
                  >
                    <ul>
                      {Array?.isArray(assignedStudyMaterial) &&
                        assignedStudyMaterial?.length > 0 &&
                        assignedStudyMaterial.map((studyMaterial, index) => {
                          return (
                            <li>
                              <div className="categoryTag col-md-12 d-flex">
                                <div className="categoryTagContent col-md-8">
                                  {studyMaterial?.pdfName}
                                </div>
                                <div
                                  className="categoryButton col-md-4"
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    removeStudyMaterialHandler(
                                      studyMaterial,
                                      index
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
              </>

              <div
                className={`${styles.nextPrevButtonDiv} d-flex justify-content-start align-items-start`}
              >
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    // disabled = {Array.isArray(videoData) && videoData.length ===0?true:false}
                  >
                    {assignedCourses?.length == 1 ||
                    assignedCourses?.length == 0
                      ? "Assign Category & Study Material"
                      : "Assign Categories & Study Material"}
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditUserCategories;
