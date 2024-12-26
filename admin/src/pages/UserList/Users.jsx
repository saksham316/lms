// ------------------------------------------------Imports-------------------------------------------
import React, { useEffect, useState } from "react";
import CourseViewModal from "../Videos/CourseViewModal";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Accordion, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentsData,
  fetchTeachersData,
  getUsers,
} from "../../features/actions/Authentication/authenticationActions";
import CourseListSkeleton from "../Course/CourseListSkeleton";
import {
  resetUserState,
  setStudentsData,
  setTeachersData,
} from "../../features/slices/Authentication/authenticationSlice";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import StudentsListViewModal from "../Videos/StudentsListViewModal";
import "./user.css";
import { CourseBulkAssignmentModal } from "../../components/Modals/CourseBulkAssignmentModal/CourseBulkAssignmentModal";
// ---------------------------------------------------------------------------------------------------

const Users = () => {
  // --------------------------------------------------States--------------------------------------------
  let timeout;
  let timeout2;
  const [render1, setRender1] = useState(false);
  const [debounceValue1, setDebounceValue1] = useState("");
  const [debounceValue2, setDebounceValue2] = useState("");
  const [teachersSearchChanged, setTeachersSearchChanged] = useState(false);
  const [studentsSearchChanged, setStudentsSearchChanged] = useState(false);
  const [studentsListViewModal, setStudentsListViewModal] = useState(false);
  const [individualStudentsData, setIndividualStudentsData] = useState({});
  const [modalShow, setModalShow] = useState(false);

  // ----------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Hooks--------------------------------------------
  const dispatch = useDispatch();

  const usersList = useSelector((state) => state?.auth?.usersList) || [];
  const studentsList = useSelector((state) => state?.auth?.studentsList) || [];
  const teachersList = useSelector((state) => state?.auth?.teachersList) || [];
  const {
    isStudentsListLoading,
    isTeachersListLoading,
    isLoading,
    isUserUpdated,
  } = useSelector((state) => state?.auth);
  const theme = useSelector((state) => state.theme);
  const { loggedInUserData } = useAuth();
  const navigate = useNavigate();

  // ----------------------------------------------------------------------------------------------------

  // ------------------------------------------------Functions-------------------------------------------

  // setData - function to set the student and the teacher data in the redux store
  const setData = async () => {
    let students = [];
    let admins = [];
    usersList?.data?.map((elements) => {
      if (elements.role == "STUDENT") {
        students.push(elements);
      } else {
        admins.push(elements);
      }
    });

    dispatch(setStudentsData(students));
    dispatch(setTeachersData(admins));
  };

  const debounceFunction1 = async (searchQuery = searchQuery.trim()) => {
    if (searchQuery === "") {
      dispatch(fetchTeachersData(``));
    } else {
      dispatch(fetchTeachersData(`?searchQuery=${searchQuery}`));
    }
  };
  const debounceFunction2 = async (searchQuery = searchQuery.trim()) => {
    if (searchQuery === "") {
      dispatch(fetchStudentsData(``));
    } else {
      dispatch(fetchStudentsData(`?searchQuery=${searchQuery}`));
    }
  };
  // ----------------------------------------------------------------------------------------------------

  // ------------------------------------------------useEffects------------------------------------------
  useEffect(() => {
    if (timeout) clearTimeout(timeout);

    if (debounceValue1.length == 0 && teachersSearchChanged) {
      debounceFunction1("");
    } else if (teachersSearchChanged) {
      timeout = setTimeout(() => {
        debounceFunction1(debounceValue1);
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [debounceValue1]);
  useEffect(() => {
    if (timeout2) clearTimeout(timeout2);

    if (debounceValue2.length == 0 && studentsSearchChanged) {
      debounceFunction2("");
    } else if (studentsSearchChanged) {
      timeout2 = setTimeout(() => {
        debounceFunction2(debounceValue2);
      }, 500);
    }

    return () => {
      clearTimeout(timeout2);
    };
  }, [debounceValue2]);

  useEffect(() => {
    if (isUserUpdated) {
      dispatch(getUsers("/"));
      dispatch(resetUserState(false));
    }
  }, [isUserUpdated]);

  useEffect(() => {
    if (usersList?.data?.length > 0) {
      setData();
    }
  }, [usersList]);

  useEffect(() => {
    return () => {
      setData();
    };
  }, []);
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-offset-1 col-md-12">
            {/* //Section 1 starts */}
            <div className="panel">
              <div className="panel-heading">
                <div className="row">
                  <div className="col  teacher d-flex ">
                    <h4 className="title text-center ">Teachers List</h4>
                  </div>
                  <div className="col-sm-9 col-xs-12 text-right d-flex justify-content-end">
                    <div className="btn_group">
                      <input
                        type="text"
                        value={debounceValue1}
                        className="form-control w-100"
                        placeholder="Search admin and teachers"
                        onChange={(e) => {
                          setDebounceValue1(e.target.value);
                          setTeachersSearchChanged(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel-body table-responsive">
                <table
                  className={
                    theme === "light"
                      ? "table table-striped"
                      : "table table-striped table-dark"
                  }
                >
                  <thead>
                    <tr className="text-center">
                      <th>#</th>
                      <th>User ID</th>
                      <th>ROLE</th>
                      <th> Name</th>
                      <th>Associated courses</th>
                      <th>No of Students</th>
                      <th>Total</th>
                      <th>CRUD</th>
                    </tr>
                  </thead>
                  {isLoading || isTeachersListLoading ? (
                    <CourseListSkeleton />
                  ) : (
                    <tbody className="text-center">
                      {Array?.isArray(teachersList) &&
                      teachersList?.length == 0 ? (
                        <h1 style={{ color: "red" }}>
                          No results for {debounceValue1}
                        </h1>
                      ) : (
                        Array?.isArray(teachersList) &&
                        teachersList?.map(
                          (el, i) =>
                            (el.role === "TEACHER" ||
                              el.role === "ADMIN" ||
                              el.role === "SUPER_ADMIN") && (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{el?._id}</td>
                                <td>{el?.role}</td>
                                <td>{el?.fullName}</td>

                                {el?.creations?.length === 0 ? (
                                  <td
                                    style={{
                                      background: "rgb(79 99 118)",
                                      textAlign: "center",
                                      color: "white",
                                    }}
                                  >
                                    No Courses Found
                                  </td>
                                ) : (
                                  <td
                                    style={{
                                      padding: "0px ",
                                    }}
                                  >
                                    {el?.creations?.map((course, j) => (
                                      <div
                                        style={{
                                          padding: "4px",
                                        }}
                                      >
                                        {course?.courseName}
                                      </div>
                                    ))}
                                  </td>
                                )}
                                {/* </td> */}
                                <td>Nil</td>
                                <td>Nil</td>
                                <td>Nil</td>
                              </tr>
                            )
                        )
                      )}
                    </tbody>
                  )}
                </table>
              </div>

              <div className="panel-footer">
                <div className="row">
                  <div className="col-sm-6 col-xs-6">
                    <div className="pagination">
                      {/* <span>&raquo;</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* //Section 2 for students starts */}
            <div className="panel">
              <div className="panel-heading">
                <div className="row">
                  <div className="col d-flex ">
                    <h4 className="title">Students List</h4>
                  </div>
                  <div className="col-sm-9 col-xs-12 text-center d-flex justify-content-end">
                    <div className="btn_group">
                      <input
                        type="text"
                        className="form-control w-100"
                        placeholder="Search"
                        onChange={(e) => {
                          setDebounceValue2(e.target.value);
                          setStudentsSearchChanged(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-12 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      style={{
                        color: "red",
                        border: "2px solid #c5c5c5",
                        backgroundColor: "white",
                        fontWeight: "bolder",
                        boxShadow: "2px 2px 6px 0px #c5c5c5",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                      }}
                      className="col-md-2 col-6 col-sm-6 mt-3"
                      onClick={() => setModalShow(true)}
                    >
                      Bulk Assign Course
                    </Button>
                  </div>
                </div>
              </div>
              <div className="panel-body table-responsive">
                <table
                  className={
                    theme === "light"
                      ? "table table-striped"
                      : "table table-striped table-dark"
                  }
                >
                  <thead>
                    <tr className="text-center">
                      <th>#</th>
                      <th>User ID</th>
                      <th> Name</th>
                      <th>Associated courses</th>
                      <th>Total</th>
                      <th>EDIT CATEGORIES</th>
                    </tr>
                  </thead>
                  {isLoading || isStudentsListLoading ? (
                    <CourseListSkeleton />
                  ) : (
                    <tbody className="text-center">
                      {Array?.isArray(studentsList) &&
                      studentsList?.length === 0 ? (
                        <h1 style={{ color: "red" }}>
                          No results for {debounceValue2}
                        </h1>
                      ) : (
                        Array?.isArray(studentsList) &&
                        studentsList?.map(
                          (el, i) =>
                            el.role === "STUDENT" && (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{el?._id}</td>
                                <td>{el?.fullName}</td>
                                {/* <td style={{ padding: "0", background:"var(--primary-color)" }}> */}
                                {el.assignedCategories?.length === 0 ? (
                                  <td
                                    style={{
                                      // background: "rgb(79 99 118)",
                                      textAlign: "center",
                                      color: "red",
                                    }}
                                  >
                                    No Courses Found
                                  </td>
                                ) : (
                                  <div className="associatedCourseParent">
                                    <td
                                      style={{
                                        padding: "0px",
                                        background: "transparent",
                                      }}
                                    >
                                      {el?.assignedCategories?.map(
                                        (course, j) => (
                                          <div
                                            style={{
                                              borderBottom:
                                                j < el?.creations?.length - 1 &&
                                                "1px solid black",
                                              padding: "4px",
                                            }}
                                          >
                                            <ul
                                              style={{ listStyle: "none" }}
                                              className="associatedCourse"
                                            >
                                              <li>{course?.courseName}</li>
                                            </ul>
                                          </div>
                                        )
                                      )}
                                    </td>
                                  </div>
                                )}
                                {/* </td> */}
                                <td>Nil</td>
                                <td>
                                  <div className="d-flex justify-content-center column-gap-2 align-items-center">
                                    {doesUserHaveRoleToAccess(
                                      ["SUPER_ADMIN", "ADMIN", "TEACHER"],
                                      loggedInUserData?.role
                                    ) &&
                                      doesUserHavePermissions(
                                        ["VIEW_CATEGORY"],
                                        loggedInUserData
                                      ) && (
                                        <div
                                          onClick={() => {
                                            setStudentsListViewModal(
                                              !studentsListViewModal
                                            );
                                            setIndividualStudentsData(el);
                                          }}
                                        >
                                          <AiOutlineEye
                                            size={20}
                                            style={{ cursor: "pointer" }}
                                          />
                                        </div>
                                      )}
                                    {doesUserHaveRoleToAccess(
                                      ["SUPER_ADMIN", "ADMIN", "TEACHER"],
                                      loggedInUserData?.role
                                    ) &&
                                      doesUserHavePermissions(
                                        ["EDIT_CATEGORY"],
                                        loggedInUserData
                                      ) && (
                                        <AiTwotoneEdit
                                          size={20}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            navigate("/edit_user_categories", {
                                              state: { user: el },
                                            });
                                          }}
                                        />
                                      )}
                                  </div>
                                </td>
                              </tr>
                            )
                        )
                      )}
                    </tbody>
                  )}
                </table>
              </div>
              <div className="panel-footer">
                <div className="row">
                  <div className="col-sm-6 col-xs-6">
                    <div className="pagination">
                      {/* <span>&raquo;</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {studentsListViewModal && (
          <StudentsListViewModal
            student={individualStudentsData}
            show={studentsListViewModal}
            hide={() => setStudentsListViewModal(false)}
          />
        )}
      </div>
      <CourseBulkAssignmentModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        studentsList={studentsList}
      />
    </>
  );
};

export default Users;
