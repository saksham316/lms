// ----------------------------------------------Imports-----------------------------------------------
import { Button, Col, Container, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import styles from "./CourseBulkAssignmentModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getUsers, updateUsers } from "../../../features/actions/Authentication/authenticationActions";
import { resetUserState } from "../../../features/slices/Authentication/authenticationSlice";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------------------------------------

export const CourseBulkAssignmentModal = (props) => {
  // ---------------------------------------------States-------------------------------------------------
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCategoryCourses, setSelectedCategoryCourses] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [leftStudents, setLeftStudents] = useState([]);

  // ----------------------------------------------------------------------------------------------------
  // ---------------------------------------------Hooks-------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm();

  const { categoryData } = useSelector((state) => state?.category);
  const { isLoading, areUsersUpdated } = useSelector((state) => state?.auth);

  const dispatch = useDispatch();

  const closeRef = useRef();

  // ----------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-------------------------------------------------
  // assigningHandler -- handler to bulk assign the courses to the students
  const assigningHandler = () => {
    try {
      if (assignedCourses.length === 0) {
        toast.error("Please Select a Course before Assignment");
      } else {
        if (selectedStudents.length === 0) {
          toast.error("Please Select Student/Students before Assignment");
        } else {
          let arr = [];
          for (let i = 0; i < selectedStudents.length; i++) {
            arr.push(selectedStudents[i]._id);
          }
          dispatch(
            updateUsers({
              students: arr,
              courseId: assignedCourses[0].courseId,
            })
          );
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
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

  // addCourseHandler -- handler to add the category to the assigned categories
  const addCourseHandler = (e) => {
    let value = JSON.parse(e.target.value);
    let flag = false;

    if (assignedCourses.length > 0) {
      toast.error("You Can Assign Only One Course For Bulk Updation");
    } else {
      setAssignedCourses([...assignedCourses, value]);
      reset();
    }

    // for (let i = 0; i < assignedCourses?.length; i++) {
    //   if (assignedCourses[i]?.courseId == value?.courseId) {
    //     flag = true;
    //     break;
    //   }
    // }
    // if (flag) {
    //   toast.error("Course is already assigned");
    // } else {
    //   if (e.target.value !== "") {
    //     setAssignedCourses([...assignedCourses, value]);
    //     reset();
    //   }
    // }
  };
  // addStudentHandler -- handler to add the students to the selected students array
  const addStudentHandler = (e) => {
    const { student, index } = JSON.parse(e.target.value);
    setSelectedStudents([...selectedStudents, student]);
    setLeftStudents((prevState) => {
      const copy = JSON.parse(JSON.stringify(prevState));
      copy.splice(index, 1);
      return copy;
    });
    resetField("selectStudent");
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

  // removeStudentHandler -- handler to remove the student
  const removeStudentHandler = (student, index) => {
    setSelectedStudents((prevData) => {
      let copyData = JSON.parse(JSON.stringify(prevData));
      copyData?.splice(index, 1);
      return copyData;
    });
    setLeftStudents([...leftStudents, student]);
  };
  // ----------------------------------------------------------------------------------------------------

  // ---------------------------------------------useEffects-------------------------------------------------

  useEffect(() => {
    if (areUsersUpdated) {
      dispatch(resetUserState(false));
      setLeftStudents(props.studentsList);
      setSelectedStudents([]);
      setAssignedCourses([]);
      dispatch(getUsers("/"));
      closeRef.current.click();
    }
  }, [areUsersUpdated]);

  useEffect(() => {
    const studentsList = JSON.parse(JSON.stringify(props.studentsList));
    setLeftStudents(studentsList);
  }, []);

  // ----------------------------------------------------------------------------------------------------

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ paddingTop: "5rem" }}
    >
      <style jsx="true">{`
        .modal-content {
          margin: ${isLoading ? "0px" : "22rem 0rem 2rem 0rem"} !important;
          width: 80vw;
          max-width: 80vw;
        }

        .modal {
          padding-top: ${isLoading && "0px !important"};
        }

        @media (min-width: 576px) {
          .modal-dialog {
            max-width: 80vw;
          }
        }
      `}</style>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Course Assigning
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <Container>
            <Row>
              <Col className="">
                {isLoading ? (
                  <div className="d-flex justify-content-center p-5">
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
                  <form onSubmit={handleSubmit(assigningHandler)}>
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
                          {Array?.isArray(categoryData?.categoryData) &&
                            categoryData?.categoryData?.length > 0 &&
                            categoryData?.categoryData.map((cat) => {
                              return (
                                <option
                                  value={JSON.stringify(
                                    cat?.categoryCourses || []
                                  )}
                                >
                                  {cat?.categoryName?.toUpperCase()?.trim() ||
                                    ""}
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
                        <h1 className={styles.title}>Selected Courses</h1>
                      </div>

                      <div className={`${styles.category}`}>
                        <div
                          //   value={moduleName}
                          className={`${styles.updateCategoryNameField} d-flex align-items-center`}
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
                      <h1 className={styles.title}>Select Students</h1>
                    </div>
                    <div className={`${styles.category}`}>
                      <div className={`${styles.categoryNameField}`}>
                        <select
                          //   value={moduleName}
                          className={`${styles.categoryName}`}
                          type="text"
                          id="categoryName"
                          {...register("selectStudent", {
                            onChange: (e) => {
                              addStudentHandler(e);
                            },
                          })}
                        >
                          <option value="">Choose...</option>
                          {Array?.isArray(leftStudents) &&
                            leftStudents?.length > 0 &&
                            leftStudents.map((student, index) => {
                              return (
                                <option
                                  value={JSON.stringify({ student, index })}
                                >
                                  {student?.fullName}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                    <>
                      <div>
                        <h1 className={styles.title}>Selected Students</h1>
                      </div>

                      <div className={`${styles.category}`}>
                        <div
                          //   value={moduleName}
                          className={`${styles.updateCategoryNameField}`}
                        >
                          <ul>
                            {Array?.isArray(selectedStudents) &&
                              selectedStudents?.length > 0 &&
                              selectedStudents.map((student, index) => {
                                return (
                                  <li>
                                    <div className="categoryTag col-md-12 d-flex">
                                      <div className="categoryTagContent col-md-8">
                                        {student?.fullName}
                                      </div>
                                      <div
                                        className="categoryButton col-md-4"
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                          removeStudentHandler(student, index);
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
                            ? "Assign Category"
                            : "Assign Categories"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Col>
            </Row>
          </Container>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} ref={closeRef}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
