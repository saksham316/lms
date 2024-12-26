import "./App.css";
// import SideBar from "./components/Sidebar/SideBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Course from "./pages/Course/Course";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/UserList/Users";
import Messages from "./pages/Messages";
import FileManager from "./pages/UserProfile/FileManager";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Setting from "./pages/UserProfile/Setting";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile/UserProfile";
import EditProfile from "./pages/UserProfile/EditProfile";
import Layout from "./components/layouts/Layout";
// import RolesAndPermissions from "./pages/RolesAndPermissions";
// import Permission from "./pages/Permission";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import CoursesList from "./pages/Course/CoursesList";
// import ChaptersList from "./pages/ChaptersList";
import CourseEdit from "./pages/Course/CourseEdit";
// import AddChapter from "./pages/AddChapter";
// import ChapterEdit from "./pages/ChapterEdit";
import Login from "./pages/Authentication/Login.jsx";
import useAuth from "./hooks/useAuth";
import ProtectedRoutesHandler from "./components/layouts/ProtectedRoutesHandler";
import "./assets/variables.css";
// import RolesAndPermissionsEdit from "./pages/RolesAndPermissionsEdit";
import ChaptersList from "./pages/Chapter/ChaptersList";
import AddChapter from "./pages/Chapter/AddChapter";
import ChapterEdit from "./pages/Chapter/ChapterEdit";
import RolesAndPermissions from "./pages/Roles&Permissions/RolesAndPermissions";
import RolesAndPermissionsEdit from "./pages/Roles&Permissions/RolesAndPermissionsEdit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "./features/slices/Theme/themeslice";
import Category from "./pages/Category/Category";
import CategoriesList from "./pages/Category/CategoriesList";
import CategoryEdit from "./pages/Category/CategoryEdit";
import QuizzesList from "./pages/Quiz/QuizzesList";
import QuizEdit from "./pages/Quiz/QuizEdit.jsx";
import AddQuizzes from "./pages/Quiz/AddQuizzes.jsx";
import EditUserCategories from "./pages/UserList/EditUserCategories.jsx";
import SignUp from "./pages/Register/SignUp.jsx";
import OtpVerification from "./pages/Register/OtpVerification.jsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword/ForgotPassword.jsx";
import VerifyOtp from "./pages/Authentication/VerifyOtp/VerifyOtp.jsx";
import CreateNewPassword from "./pages/Authentication/CreateNewPassword/CreateNewPassword.jsx";
import StudyMaterial from "./pages/StudyMaterial/StudyMaterial.jsx";
import StudyMaterialList from "./pages/StudyMaterial/StudyMaterialList.jsx";
import StudyMaterialEdit from "./pages/StudyMaterial/StudyMaterialEdit.jsx";

// -------------------------------------------------------------------------------------------

function App() {
  // ------------------------------------------------Hooks----------------------------------------------
  const { isUserLoggedIn } = useAuth();

  const theme = useSelector((state) => state.theme);

  // ---------------------------------------------------------------------------------------------------

  const rootStyles = {
    "--primary-color": theme === "light" ? "#F5F7F8" : "#717171",
    "--secondary-color": theme === "light" ? "#30475E" : "#3f3f3f",
    "--table-font-color": theme === "light" ? "#45474B" : "#EEE",
    "--main-background-color": theme === "light" ? "#fff" : "#282828",
    "--table-head-background-color": theme === "light" ? "#EEEDED" : "#575757",
    "--table-body-even-child: ": theme === "light" ? "" : "#666666",
    "--card-background-color": theme === "light" ? "#F5F7F8" : "#3f3f3f",
    "--table-border-color": theme === "light" ? "#45474B" : "#e50000",
  };

  return (
    <div style={rootStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* ---------------------------------Non Protected Routes---------------------------- */}
          <Route
            path="/login"
            element={isUserLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/forgot_password"
            element={isUserLoggedIn ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/otp_verification"
            element={isUserLoggedIn ? <Navigate to="/" /> : <VerifyOtp />}
          />
          <Route
            path="/create_new_password"
            element={
              isUserLoggedIn ? <Navigate to="/" /> : <CreateNewPassword />
            }
          />
          {/* ---------------------------------------------------------------------------------- */}
          {/* ---------------------------------Protected Routes--------------------------------- */}
          <Route path="*" element={<> not found</>} />
          <Route index element={isUserLoggedIn ? <Dashboard /> : <Login />} />
          <Route
            path="/settings"
            element={isUserLoggedIn ? <Setting /> : <Login />}
          />

          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN"]}
                allowedPermissions={["SIGN_USER"]}
              />
            }
          >
            <Route path="/signup" exact element={<SignUp />} />
            <Route
              path="/emailVerification"
              exact
              element={<OtpVerification />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["CREATE_COURSE", "CREATE_CHAPTER"]}
              />
            }
          >
            <Route path="/course" exact element={<Course />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={[
                  "EDIT_COURSE",
                  "VIEW_COURSE",
                  "DELETE_COURSE",
                ]}
              />
            }
          >
            <Route path="/course_edit" exact element={<CourseEdit />} />
            <Route path="/courses_list" exact element={<CoursesList />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={[
                  "EDIT_CHAPTER",
                  "VIEW_CHAPTER",
                  "DELETE_CHAPTER",
                ]}
              />
            }
          >
            <Route path="/add_chapters" exact element={<AddChapter />} />
            <Route path="/chapter_edit" exact element={<ChapterEdit />} />
            <Route path="/chapters_list" exact element={<ChaptersList />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["EDIT_QUIZ", "VIEW_QUIZ", "DELETE_QUIZ"]}
              />
            }
          >
            <Route path="/quizzes_list" exact element={<QuizzesList />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["CREATE_QUIZ"]}
              />
            }
          >
            <Route path="/add_quizzes" exact element={<AddQuizzes />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["EDIT_QUIZ"]}
              />
            }
          >
            <Route path="/quiz_edit" exact element={<QuizEdit />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN"]}
                allowedPermissions={[
                  "VIEW_ROLES_&_PERMISSIONS",
                  "DISABLE_USER",
                ]}
              />
            }
          >
            <Route
              path="/roles_permissions"
              element={<RolesAndPermissions />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN"]}
                allowedPermissions={["EDIT_ROLES_&_PERMISSIONS"]}
              />
            }
          >
            <Route
              path="/roles_permissions_edit"
              element={<RolesAndPermissionsEdit />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["CREATE_CATEGORY"]}
              />
            }
          >
            <Route path="/category" element={<Category />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["EDIT_CATEGORY"]}
              />
            }
          >
            <Route path="/category_edit" element={<CategoryEdit />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={[
                  "VIEW_CATEGORY",
                  "EDIT_CATEGORY",
                  "DELETE_CATEGORY",
                ]}
              />
            }
          >
            <Route path="/categories_list" element={<CategoriesList />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["CREATE_STUDY_MATERIAL"]}
              />
            }
          >
            <Route path="/study_material" element={<StudyMaterial />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={["EDIT_STUDY_MATERIAL"]}
              />
            }
          >
            <Route
              path="/study_material_edit"
              element={<StudyMaterialEdit />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
                allowedPermissions={[
                  "VIEW_STUDY_MATERIAL",
                  "EDIT_STUDY_MATERIAL",
                  "DELETE_STUDY_MATERIAL",
                ]}
              />
            }
          >
            <Route
              path="/study_material_list"
              element={<StudyMaterialList />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN"]}
                allowedPermissions={["VIEW_USERS"]}
              />
            }
          >
            <Route path="/users" element={<Users />} />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
                allowedRoles={["SUPER_ADMIN", "ADMIN"]}
                allowedPermissions={["EDIT_USERS_CATEGORIES"]}
              />
            }
          >
            <Route
              path="/edit_user_categories"
              element={<EditUserCategories />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoutesHandler
              // allowedRoles={["SUPER_ADMIN", "ADMIN", "TEACHER"]}
              // allowedPermissions={[
              //   "CREATE_COURSE",
              //   "EDIT_COURSE",
              //   "CREATE_CHAPTER",
              //   "EDIT_CHAPTER",
              // ]}
              />
            }
          >
            {/* <Route path="/videos/quiz"  element={<Quiz/>} /> */}

            <Route path="/messages" element={<Messages />} />
            <Route path="/home" element={<Home />} />
            <Route path="/file-manager" element={<FileManager />} />
            <Route path="/order" element={<Order />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/settings" element={<Setting />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={1000} />
      {/* ---------------------------------------------------------------------------------- */}
    </div>
  );
}

export default App;
