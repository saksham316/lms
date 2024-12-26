import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./components/authentication/Login/Login";
import Layout from "./components/layouts/Layout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import ForgotPassword from "./components/authentication/ForgotPassword/ForgotPassword";
import Logout from "./components/authentication/Logout/Logout";
import CreateNewPassword from "./components/authentication/CreateNewPassword/CreateNewPassword";
import CodeVerification from "./components/authentication/Register/CodeVerification/CodeVerification";
import OtpVerification from "./components/authentication/Register/OtpVerification";
import WelcomePage from "./components/authentication/WelcomePage";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CourseDetails from "./components/course/CourseDetails";
import Quiz from "./components/quiz/Quiz";
import WelcomeQuiz from "./components/quiz/WelcomeQuiz";
import { QuizResult } from "./components/quiz/QuizResult";
import UserProfile from "./pages/userProfile/UserProfile";
import WatchHistory from "./pages/WatchHistory/WatchHistory";
import useAuth from "./hooks/useAuth";
import ChapterDetails from "./components/chapter/ChapterDetails";

// -----------------------------------------------------------------------------------------------

function App() {
  // --------------------------------------------States---------------------------------------------
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Hooks---------------------------------------------
  const { loggedInUserData, isUserLoggedIn } = useAuth();
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Functions------------------------------------------
  const protectedRoutesHandler = (allowedRoles, allowedPermissions) => {
    if (
      loggedInUserData?.role?.toString()?.toUpperCase() === "SUPER_ADMIN" ||
      (allowedRoles?.includes(
        loggedInUserData?.role?.toString()?.toUpperCase()
      ) &&
        loggedInUserData?.permissions?.find((permission) => {
          return allowedPermissions.includes(permission);
        }))
    ) {
      return true;
    } else {
      return false;
    }
  };

  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------useEffects-----------------------------------------
  // -----------------------------------------------------------------------------------------------

  const approuter = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: isUserLoggedIn ? (
              <WelcomePage />
            ) : (
              <Navigate to={"/login"} />
            ),
          },
          {
            path: "/login",
            element: isUserLoggedIn ? <Navigate to="/" /> : <Login />,
          },
          {
            path: "/forgotpassword",
            element: isUserLoggedIn ? <Navigate to="/" /> : <ForgotPassword />,
          },
          {
            path: "/logout",
            element: isUserLoggedIn ? <Logout /> : <Navigate to="/" />,
          },
          {
            path: "/createnewpassword",
            element: isUserLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <CreateNewPassword />
            ),
          },
          {
            path: "/codeverification",
            element: isUserLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <CodeVerification />
            ),
          },
          {
            path: "/emailVerification",
            element: isUserLoggedIn ? <Navigate to="/" /> : <OtpVerification />,
          },
          {
            path: "/courseDetails",
            element: isUserLoggedIn ? (
              protectedRoutesHandler(["STUDENT"], ["VIEW_COURSE"]) ? (
                <CourseDetails />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/chapterDetails",
            element: isUserLoggedIn ? (
              protectedRoutesHandler(["STUDENT"], ["VIEW_CHAPTER"]) ? (
                <ChapterDetails />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/quiz",
            element: isUserLoggedIn ? (
              protectedRoutesHandler(["STUDENT"], ["VIEW_COURSE"]) ? (
                <Quiz />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/welcome-quiz",
            element: isUserLoggedIn ? (
              protectedRoutesHandler(["STUDENT"], ["VIEW_COURSE"]) ? (
                <WelcomeQuiz />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/user-profile",
            element: isUserLoggedIn ? (
              <UserProfile />
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/quizresult",
            element: isUserLoggedIn ? (
              protectedRoutesHandler(["STUDENT"], ["VIEW_COURSE"]) ? (
                <QuizResult />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            ),
          },
          {
            path: "/watch-history",
            element: <WatchHistory />,
          },
        ],
      },
    ]
    // {
    //   basename:
    //     process.env.REACT_APP_WORKING_ENVIRONMENT === "production"
    //       ? "/mern/learning-management-system"
    //       : "",
    // }
  );

  return (
    <RouterProvider router={approuter}>
      <Layout />
    </RouterProvider>
  );
}

export default App;
