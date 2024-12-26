import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";

import { Container, Row, Col } from "react-bootstrap";
import signup from "../../assets/Images/signup.png";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { emailRegex, passwordRegex } from "../../utils/regexes";
import { Dispatch } from "react";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import {
  generateOtp,
  redirectToGoogle,
} from "../../features/actions/Authentication/authenticationActions";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import Avatar from "react-avatar";
import { setGoogleApiCall } from "../../features/slices/Authentication/authenticationSlice";

// ------------------------------------------------------------------------------------------------------------

const SignUp = () => {
  // --------------------------------------------------States--------------------------------------------------
  const [isOtpApiCalled, setIsOtpApiCalled] = useState(false);
  const [userData, setUserData] = useState();
  const [googleWindow, setGoogleWindow] = useState(false);
  const [avatarFile, setAvatarFile] = useState("");
  // -----------------------------------------------------------------------------------------------------

  // --------------------------------------------------Hooks----------------------------------------------
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { otpGenerated } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // ----------------------------------------------------------------------------------------------------------

  // ---------------------------------------------Functions----------------------------------------------------

  const handleSignUp = (data) => {
    const { email } = data;
    setUserData(data);
    const payload = {
      email: email?.toLowerCase(),
    };
    if (payload) {
      dispatch(generateOtp(payload));
      setIsOtpApiCalled(true);
    }
  };

  // googleRedirectionHandler - function to call the redirectToGoogle api
  const googleRedirectionHandler = () => {
    try {
      window.open(
        `${
          process.env.REACT_APP_WORKING_ENVIRONMENT === "development"
            ? process.env.REACT_APP_API_BASE_URL_DEVELOPMENT
            : process.env.REACT_APP_API_BASE_URL_PRODUCTION
        }/auth/google`,
        "_self"
      );
      setGoogleWindow(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  // ---------------------------------------------------------------------------------------

  // ------------------------------------------useEffect------------------------------------

  useEffect(() => {
    dispatch(setGoogleApiCall(false));
  }, []);

  useEffect(() => {
    if (googleWindow) {
      dispatch(setGoogleApiCall(true));
    }
  }, [googleWindow]);

  useEffect(() => {
    if (otpGenerated && isOtpApiCalled) {
      navigate("/emailVerification", {
        state: { ...userData, avatar: avatarFile },
      });
    }
  }, [otpGenerated]);

  // ----------------------------------------react router-----------------------------------
  return (
    <Container className={`${styles.container}`}>
      <Row className={`${styles.row} p-1`}>
        <div>
          <h1 className={styles.heading}>Sign Up a New User</h1>
        </div>
        {/* <div>
          <p className={styles.paragraph}>
            Your Gateway to Smarter Learning Starts Here!
          </p>
        </div> */}
        <Col className={styles.displaynone}>
          <div className={` ${styles.imageH} d-flex align-items-center`}>
            <img className={styles.img} src={signup} alt="signup" />
          </div>
        </Col>
        <Col className="p-5">
          <form onSubmit={handleSubmit(handleSignUp)}>
            <div className="mb-3">
              <label
                style={{ cursor: "pointer" }}
                for="formFile"
                className="form-label d-flex justify-content-center align-items-center flex-column"
              >
                {avatar === null ? (
                  <Avatar
                    facebookId="100008343750912"
                    size="100"
                    round={true}
                  />
                ) : (
                  <Avatar size="100" round={true} src={avatar} />
                )}
                User Avatar
              </label>
              <input
                {...register("avatar", {
                  required: {
                    value: true,
                    message: "User Avatar is required",
                  },
                })}
                onChange={handleAvatar}
                className="form-control d-none"
                type="file"
                id="formFile"
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.avatar?.message}
              </span>
            </div>
            <div className="form-row my-2">
              <input
                className={`${styles.input} my-2`}
                type="text"
                placeholder="User Name"
                {...register("userName", {
                  required: {
                    value: true,
                    message: "User Name is required",
                  },
                })}
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.userName?.message}
              </span>
            </div>
            <div className="form-row my-2">
              <input
                className={`${styles.input} my-2`}
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "Full Name is required",
                  },
                })}
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.fullName?.message}
              </span>
            </div>
            <div className="form-row my-2">
              <input
                className={`${styles.input} my-2`}
                type="number"
                placeholder="Mobile No."
                {...register("phone", {
                  required: {
                    value: true,
                    message: "Mobile No. is required",
                  },
                })}
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.phone?.message}
              </span>
            </div>
            <div className="form-row my-2">
              <input
                className={`${styles.input} my-2`}
                type="text"
                placeholder="Email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: emailRegex,
                    message: "Email is not valid",
                  },
                })}
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.email?.message}
              </span>
            </div>
            <div className="form-row">
              <input
                className={`${styles.input} my-2`}
                type="password"
                placeholder="Password"
                {...register(
                  "password",
                  {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  },
                  {
                    patter: {
                      value: passwordRegex,
                      message: "Password is invalid",
                    },
                  }
                )}
              />
              <span className="fw-normal fs-6 text-danger">
                {errors?.password?.message}
              </span>
            </div>
            <div className="d-flex justify-content-center my-3">
              {isLoading ? (
                <button
                  style={{
                    cursor: `${isLoading ? "not-allowed" : ""}`,
                    opacity: `${isLoading ? 0.7 : 1}`,
                  }}
                  type="button"
                  className={styles.btn}
                >
                  <Loader />
                </button>
              ) : (
                <button type="submit" className={styles.btn}>
                  SignUp
                </button>
              )}
            </div>
          </form>
          {/* <div className="d-flex align-items-center gap-1 justify-content-center">
            <div className={styles.line}></div>
            <div>OR</div>
            <div className={styles.line}></div>
          </div> */}
          {/* <div className="d-flex justify-content-center my-2 align-items-center gap-3">
            <div
              className={` d-flex ${styles.google_box} my-3 justify-content-end`}
              onClick={googleRedirectionHandler}
            >
              <div className="d-flex mx-auto justify-content-start align-items-center gap-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M31.6937 12.6654H30.425V12.6H16.25V18.9H25.1511C23.8525 22.5674 20.3631 25.2 16.25 25.2C11.0312 25.2 6.8 20.9688 6.8 15.75C6.8 10.5312 11.0312 6.3 16.25 6.3C18.659 6.3 20.8506 7.20877 22.5193 8.69321L26.9742 4.23832C24.1612 1.61674 20.3985 0 16.25 0C7.55206 0 0.5 7.05206 0.5 15.75C0.5 24.4479 7.55206 31.5 16.25 31.5C24.9479 31.5 32 24.4479 32 15.75C32 14.694 31.8913 13.6631 31.6937 12.6654Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M2.31598 8.41916L7.49064 12.2141C8.89082 8.74755 12.2818 6.3 16.25 6.3C18.659 6.3 20.8506 7.20877 22.5193 8.69321L26.9742 4.23832C24.1612 1.61674 20.3986 0 16.25 0C10.2004 0 4.9541 3.41539 2.31598 8.41916Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M16.25 31.5C20.3182 31.5 24.0147 29.9431 26.8096 27.4113L21.935 23.2864C20.3537 24.4841 18.3881 25.2 16.25 25.2C12.1534 25.2 8.67504 22.5878 7.36464 18.9425L2.22856 22.8997C4.83519 28.0003 10.1288 31.5 16.25 31.5Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M31.6937 12.6653H30.425V12.6H16.25V18.9H25.1511C24.5274 20.6616 23.3942 22.1807 21.9326 23.2871C21.9334 23.2863 21.9342 23.2864 21.935 23.2856L26.8096 27.4105C26.4647 27.7239 32 23.625 32 15.75C32 14.6939 31.8913 13.6631 31.6937 12.6653Z"
                    fill="#1976D2"
                  />
                </svg>
                <div>Sign up with Google</div>
              </div>
            </div>
            <div
              className={` d-flex ${styles.microsoft_box} justify-content-end`}
            >
              <div className="d-flex mx-auto justify-content-start align-items-center gap-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.5 0H15.3235V14.8235H0.5V0Z"
                    fill="#E43535"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.5 16.6765H15.3235V31.5H0.5V16.6765Z"
                    fill="#5EA7FF"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.1765 16.6765H32V31.5H17.1765V16.6765Z"
                    fill="#FFAF40"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.1765 0H32V14.8235H17.1765V0Z"
                    fill="#80D25B"
                  />
                </svg>
                <div>Sign up with Microsoft</div>
              </div>
            </div>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
