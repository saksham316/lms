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
import WelcomePage from "./components/authentication/WelcomePage";
import {
  Navigate,
  Route,
  RouterProvider,
  Routes,
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
import ProtectedRoutesHandler from "./components/layouts/ProtectedRoutesHandler";
import TermsAndPolicies from "./pages/TermsAndPolicies/TermsAndPolicies";
import Feedback from "./pages/Feedback/Feedback";
import StudyMaterial from "./pages/StudyMaterial/StudyMaterial";

// -----------------------------------------------------------------------------------------------

function App() {
  // --------------------------------------------States---------------------------------------------
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Hooks---------------------------------------------
  const { loggedInUserData, isUserLoggedIn } = useAuth();
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Functions------------------------------------------

  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------useEffects-----------------------------------------
  // -----------------------------------------------------------------------------------------------
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ---------------------------------Non Protected Routes---------------------------- */}
        <Route index element={isUserLoggedIn ? <WelcomePage /> : <Login />} />
        <Route path="*" element={<> not found</>} />

        <Route
          path="/login"
          element={isUserLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/forgotpassword"
          element={isUserLoggedIn ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/logout"
          element={isUserLoggedIn ? <Logout /> : <Navigate to="/" />}
        />
        <Route
          path="/createnewpassword"
          element={isUserLoggedIn ? <Navigate to="/" /> : <CreateNewPassword />}
        />
        <Route
          path="/codeverification"
          element={isUserLoggedIn ? <Navigate to="/" /> : <CodeVerification />}
        />
        <Route
          path="/user-profile"
          element={isUserLoggedIn ? <UserProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/watch-history"
          element={isUserLoggedIn ? <WatchHistory /> : <Navigate to="/login" />}
        />
        <Route
          path="/tap"
          element={
            isUserLoggedIn ? <TermsAndPolicies /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/feedback"
          element={isUserLoggedIn ? <Feedback /> : <Navigate to="/login" />}
        />
        <Route
          path="/study-material"
          element={
            isUserLoggedIn ? <StudyMaterial /> : <Navigate to="/login" />
          }
        />
        {/* ---------------------------------------------------------------------------------- */}

        {/* ---------------------------------Protected Routes--------------------------------- */}

        <Route
          element={
            <ProtectedRoutesHandler
              allowedRoles={["STUDENT"]}
              allowedPermissions={["VIEW_COURSE"]}
            />
          }
        >
          <Route path="/courseDetails" exact element={<CourseDetails />} />
        </Route>
        <Route
          element={
            <ProtectedRoutesHandler
              allowedRoles={["STUDENT"]}
              allowedPermissions={["VIEW_CHAPTER"]}
            />
          }
        >
          <Route path="/chapterDetails" exact element={<ChapterDetails />} />
        </Route>
        <Route
          element={
            <ProtectedRoutesHandler
              allowedRoles={["STUDENT"]}
              allowedPermissions={["VIEW_CHAPTER"]}
            />
          }
        >
          <Route path="/welcome-quiz" exact element={<WelcomeQuiz />} />
        </Route>
        <Route
          element={
            <ProtectedRoutesHandler
              allowedRoles={["STUDENT"]}
              allowedPermissions={["VIEW_CHAPTER"]}
            />
          }
        >
          <Route path="/quiz" exact element={<Quiz />} />
        </Route>
        <Route
          element={
            <ProtectedRoutesHandler
              allowedRoles={["STUDENT"]}
              allowedPermissions={["VIEW_CHAPTER"]}
            />
          }
        >
          <Route path="/quizresult" exact element={<QuizResult />} />
        </Route>
        {/* ---------------------------------------------------------------------------------- */}
      </Route>
    </Routes>
  );
}

export default App;
