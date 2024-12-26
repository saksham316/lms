// -----------------------------------------------Imports-------------------------------------------------
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/actions/Course/courseActions";
import { FaSearch } from "react-icons/fa";
import {
  setChapterData,
  setQuizData,
} from "../features/slices/Course/courseSlice";
import { makePublic } from "../features/actions/PublicAccess/publicAccessActions";
import useAuth from "../hooks/useAuth";
import { getUsers } from "../features/actions/Authentication/authenticationActions";
import "./pagesCSS/Dashboard.css";
import { fetchCategories } from "../features/actions/Category/categoryActions";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import {
  setStudentsData,
  setTeachersData,
} from "../features/slices/Authentication/authenticationSlice";
import styles from "./pagesCSS/DashBoard.module.css";
import MyResponsiveLine from "../components/Charts and graph/MyResponsiveLine";
import { toast } from "react-toastify";
import moment from "moment";
import Loader from "../components/common/Loader";
import { getPdfQuizzes } from "../features/actions/StudyMaterial/studyMaterialActions";
import axios from "axios";
import Button from "react-bootstrap/Button";
import DashboardModal from "./Dashboard/DashboardModal";
import { getMetaData } from "../features/actions/MetaData/metaDataActions";
import { CSVLink } from "react-csv";
import Table from "react-bootstrap/Table";
// import moment from "moment/moment";
// -------------------------------------------------------------------------------------------------------
//
const Dashboard = () => {
  const [modal, setModal] = useState(false);
  const [wishing, setWishing] = useState();
  const [searchMetaData, setSearchUserMetaData] = useState(" ");
  const [hoveredRow, setHoveredRow] = useState(null);
  // -----------------------------------------------States-------------------------------------------------
  const [data, setDatum] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [userIndex, setUserIndex] = useState("");

  const handleChange = async (e, index) => {
    setModal(true);
    setDatum(data);
    setUserIndex(index);
  };

  // let csvData;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state?.course);

  const { loggedInUserData } = useAuth();

  const { usersList } = useSelector((state) => state?.auth);

  const { isMakePublicApiLoading } = useSelector(
    (state) => state?.publicAccess
  );

  const { metaData, isMetaDataLoading } = useSelector(
    (state) => state?.metaData
  );
  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-----------------------------------------------

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

  // fetchCoursesData -- function to call the fetchCourses api
  const fetchCoursesData = async () => {
    try {
      return new Promise(async (resolve, reject) => {
        const fetchCoursesRes = dispatch(fetchCourses());
        const fetchCoursesPayload = await fetchCoursesRes;
        if (fetchCoursesPayload.payload.success) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      });
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // fetchCategoriesData -- function to call the fetchCategories api
  const fetchCategoriesData = async () => {
    try {
      return new Promise(async (resolve, reject) => {
        const fetchCategoriesRes = dispatch(fetchCategories());

        const fetchCategoriesPayload = await fetchCategoriesRes;
        if (fetchCategoriesPayload.payload.success) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      });
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // fetchUsersData -- function to call the fetchUsers api
  const fetchUsersData = async () => {
    try {
      if (["SUPER_ADMIN", "ADMIN"].includes(loggedInUserData?.role)) {
        return new Promise(async (resolve, reject) => {
          const getUsersRes = dispatch(getUsers("/"));
          const getUsersPayload = await getUsersRes;
          if (getUsersPayload.payload.success) {
            resolve({ success: true });
          } else {
            reject({ success: false });
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve({ success: true });
        });
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // fetchStudyMaterialData -- function to call the getPdfQuizzes api
  const fetchStudyMaterialData = async () => {
    try {
      return new Promise(async (resolve, reject) => {
        const fetchStudyMaterialRes = dispatch(getPdfQuizzes());

        const fetchStudyMaterialPayload = await fetchStudyMaterialRes;

        if (fetchStudyMaterialPayload.payload.success) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      });
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };
  // fetchMetaData -- function to call the fetchMetaData api
  const fetchMetaData = async () => {
    try {
      return new Promise(async (resolve, reject) => {
        const fetchMetaDataRes = dispatch(getMetaData(searchMetaData));

        const fetchMetaDataPayload = await fetchMetaDataRes;

        if (fetchMetaDataPayload.payload.success) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      });
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // promiseExecution -- function to resolve all the promises
  const promiseExecution = async () => {
    try {
      const fetchCourseRes = await fetchCoursesData();
      const fetchCategoriesRes =
        fetchCourseRes.success && (await fetchCategoriesData());
      const fetchStudyMaterialRes =
        fetchCategoriesRes.success && (await fetchStudyMaterialData());
      const fetchUsersRes =
        fetchStudyMaterialRes.success && (await fetchUsersData());
      const fetchMetaDataRes = fetchUsersRes.success && (await fetchMetaData());
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message);
    }
  };
  // ------------------------------------------------------------------------------------------------------
  // -----------------------------------------------useEffects------------------------------------------------

  useEffect(() => {
    promiseExecution();
  }, []);

  useEffect(() => {
    if (usersList?.data?.length > 0) {
      setData();
    }
  }, [usersList]);

  useEffect(() => {
    if (courseData?.data?.length > 0) {
      dispatch(setChapterData(courseData));
      dispatch(setQuizData(courseData));
    }
  }, [courseData]);

  //Time calculations
  useEffect(() => {
    timeZone();

    let data =
      metaData?.data?.map((item) => ({
        fullName: item?.fullName,
        // chatpterName: generateData(),
        chapterName: item?.assignedCategories?.flatMap((categories) =>
          categories?.courseChapters?.map((_) => _?.chapterName)
        ),
        noOfQuestions: item?.assignedCategories?.flatMap((categories) =>
          categories?.courseChapters?.map((_) => _?.chapterQuizzes?.length)
        ),
        unAttempted: 0,
        score: item?.assignedCategories?.flatMap((categories) =>
          categories?.courseChapters?.map((_) => _?.score)
        ),
        completionRateOfChapter: `${item?.assignedCategories?.flatMap(
          (categories) =>
            categories?.courseChapters?.map((_) =>
              Math.ceil(_?.videoStatus?.completion)
            )
        )}`,
        // categories?.courseChapters?.map((_) => _?.chapterName);
      })) || [];
    setCsvData(data);
  }, [metaData]);
  const timeZone = async () => {
    try {
      const currentTime = await moment().format("HH");
      if (currentTime >= 0 && currentTime < 12) {
        setWishing("Good Morning!!");
      } else if (currentTime >= 12 && currentTime < 18) {
        setWishing("Good Afternooon!!");
      } else if (currentTime >= 18 && currentTime <= 24) {
        setWishing("Good Evening!!");
      } else {
        setWishing("Hello !!");
      }
      // return "Hello"
    } catch (error) {
      console.log("Error");
      // return "Hey";
    }
  };

  const headers = [
    { label: "First Name", key: "fullName" },
    { label: "Chapter Name", key: "chapterName" },
    { label: "No of questions	", key: "noOfQuestions" },
    { label: "Chapter Name", key: "chapterName" },
    { label: "UnAttempted", key: "unAttempted" },
    { label: "Score", key: "score" },
    { label: "Completion Rate of chapter", key: "completionRateOfChapter" },
  ];

  // ======CSV ENDED
  //-----------------------------------------------------------------------------------------------------
  return (
    <>
      <div className={`${styles.headingContainer} text-center`}>
        <h1>Dashboard</h1>
      </div>
      <div className="container">
        <div className="  mb-3 row ">
          <div
            className="card greetingCard mb-3 col-md-3 "
            style={{ border: "0" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                {wishing} {loggedInUserData?.fullName}
              </h5>
              <p className="card-text">
                Here’s what’s happening with your web App today.
              </p>
            </div>
          </div>
          <div className="makePublicButton col-md-8 d-flex  align-items-center">
            <div
              className="makePublicBox col-md-4 d-flex flex-column justify-content-center align-items-center"
              style={{
                bordeRadius: "16px",
                padding: "15px",
                background: "var(--card-background-color)",
                width: "300px",
                boxShadow: "rgba(0, 0, 0, 0.25) 2px 2px 14px -4px",
              }}
            >
              <h6 className="col-md-12 text-center" style={{ color: "red" }}>
                Clicking this button will make all the media files public
              </h6>
              {isMakePublicApiLoading ? (
                <button
                  type="button"
                  className="btn btn-info col-md-4"
                  style={{ opacity: "0.4" }}
                >
                  <Loader />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-info col-md-4"
                  onClick={() => {
                    dispatch(makePublic());
                  }}
                >
                  Make Public
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="container my-3">
          <CSVLink data={csvData} headers={headers}>
            <button type="button" className="btn btn-primary">
              Download report
            </button>
          </CSVLink>
          <br />
          <br />

          <div className="row">
            <div className="col-md-4 my-3 my-md-0">
              <button type="button" className="btn btn-primary">
                Total No. of Logged in Users{" "}
                <span className="badge text-bg-secondary">
                  {metaData?.activeUsers}
                </span>
              </button>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  onChange={(e) => setSearchUserMetaData(e.target.value)}
                />
                <div>
                  <button
                    className="btn btn-primary "
                    type="button"
                    aria-expanded="false"
                    onClick={() => fetchMetaData()}
                  >
                    <FaSearch />
                  </button>
                  {/* <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Name
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul> */}
                </div>
              </div>
            </div>
          </div>

          {/* <Button variant="primary" onClick={() => setModal(true)}>
          Launch vertically centered modal
        </Button> */}

          {isMetaDataLoading ? (
            <h1>Loading...</h1>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Chapter Name</th>
                  <th scope="col">No of questions</th>
                  <th scope="col">Un-attempted</th>
                  {/* <th scope="col">Score</th> */}
                  <th scope="col">Completion rate of chapter</th>
                </tr>
              </thead>
              <tbody>
                {metaData?.data?.map((data, index) => (
                  <>
                    <tr
                      key={index}
                      className={`tableRow${index} tr ${
                        hoveredRow === index ? "hovered" : ""
                      }`}
                      onClick={(e) => {
                        handleChange(e, index);
                      }}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <style jsx="true">{`
                        .tableRow${index}:hover {
                          cursor: pointer;
                          background: teal;
                        }
                        .tableRow${index} td {
                          opacity: 0.52;
                        }
                      `}</style>
                      <td className={`tableData`} scope="row">
                        {index + 1}
                      </td>
                      <td className={`tableData`}>{data?.fullName || "N/A"}</td>
                      <td className={`tableData`}>
                        <ul>
                          {data?.assignedCategories?.[0]?.courseChapters[0]
                            ?.chapterName || "N/A"}
                        </ul>
                      </td>
                      <td className={`tableData`}>
                        <ul>
                          {
                            data?.assignedCategories?.[0]?.courseChapters[0]
                              ?.chapterQuizzes?.length
                          }
                        </ul>
                      </td>
                      <td className={`tableData`}>
                        <ul>0</ul>
                      </td>

                      {/* <td>@mdo</td> */}
                      {/* <td className={`tableData`}>
                        {
                          data?.assignedCategories?.[0]?.courseChapters[0]
                            ?.chapterQuizzes?.length
                        }
                      </td> */}
                      <td className={`tableData`}>
                        <ul>
                          {`${Math.ceil(
                            data?.assignedCategories?.[0]?.courseChapters[0]
                              ?.videoStatus?.completion
                              ? data?.assignedCategories?.[0]?.courseChapters[0]
                                  ?.videoStatus?.completion
                              : 0
                          )}%`}
                        </ul>
                      </td>
                    </tr>
                    {/* <style jsx>{`
                    .tr {
                      color: initial;
                      transition: color 0.3s;
                      cursor: pointer;
                    }

                    .tr:hover {
                      background-color: red !important;
                    }
                  `}</style> */}

                    {modal && (
                      <DashboardModal
                        show={modal && index == userIndex}
                        data={data}
                        index={index + 1}
                        onHide={() => setModal(false)}
                      />
                    )}
                  </>
                ))}
                {/* <style jsx>{`
                .tr {
                  color: initial;
                  transition: background-color 0.3s, color 0.3s;
                  cursor: pointer;
                }
                .tr:hover,
                .tr.hovered {
                  background-color: teal !important;
                  color: white;
                }
              `}</style> */}
                {/*            
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr> */}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
