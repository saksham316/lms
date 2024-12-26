import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import login from "../../../assets/images/login.png";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { emailRegex, passwordRegex } from "../../../utils/regexes";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../../features/actions/authActions";
import { useEffect } from "react";
import Loader from "../../common/Loader";
import axios from "axios";
import { PiEyeClosed } from "react-icons/pi";
import { PiEye } from "react-icons/pi";
import { FaLock } from "react-icons/fa";
import { resetLoading } from "../../../features/slices/authSlice";

const Login = () => {
  const siteKey = "6LcXmFQoAAAAALKeZfQ20VjEuPFeytgSVBwjCLfE";

  const [forcedLogin, setForcedLogin] = useState(false);
  // --------------------------------reack hook form--------------------------------------------------
  const captchaRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);

  const { isUserLoggedIn, isLoading, loginChange, isUserLoggedInOtherDevice } =
    useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const iconStyle = {
    height: "20px",
    width: "20px",
  };

  // useEffect(() => {
  //   captchaRef.current.reset();
  // }, [loginChange]);

  const handleLogin = (data) => {
    const tokenReCaptcha = "";

    const { email, password } = data;
    if (email && password) {
      const payload = {
        email: email?.toLowerCase(),
        password: password,
        tokenReCaptcha,
      };
      isUserLoggedInOtherDevice && (payload.forcedLogin = true);
      if (payload) {
        dispatch(logIn(payload));
      }
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate("/");
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (
      captchaRef.current &&
      captchaRef.current.style &&
      captchaRef.current.style.width
    ) {
      captchaRef.current.style.width = "500px";
    }
  }, [captchaRef]);

  useEffect(() => {
    dispatch(resetLoading(false));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.login_wrapper}>
          <div className="row">
            <div className="col-md-6">
              <div className="login_img d-md-block d-none">
                <img className={styles.loginImg} src={login} alt="login" />
              </div>
            </div>
            <div className="col-md-6">
              <div className={styles.login_form}>
                <h2 className="text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit(handleLogin)}>
                  <div className="form-row my-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      {...register(
                        "email",
                        {
                          required: {
                            value: true,
                            message: "Email is required",
                          },
                        },
                        {
                          pattern: {
                            value: emailRegex,
                            message: "Email is not valid",
                          },
                        }
                      )}
                    />
                    <span className="fw-normal fs-6 text-danger">
                      {errors?.email?.message}
                    </span>
                  </div>
                  <div className="form-row my-3">
                    <div className="position-relative">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setToggle(!toggle);
                        }}
                        className={`position-absolute ${styles.login_eye}`}
                      >
                        {toggle ? (
                          <PiEye style={iconStyle} />
                        ) : (
                          <PiEyeClosed style={iconStyle} />
                        )}
                      </span>
                      <input
                        type={`${toggle ? "text" : "password"}`}
                        className="form-control"
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
                    </div>
                    <span className="fw-normal fs-6 text-danger">
                      {errors?.password?.message}
                    </span>
                  </div>

                  {/* <div className="w-100">
                    <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
                  </div> */}

                  <div className="d-flex justify-content-end my-3">
                    <Link
                      to="/forgotpassword"
                      style={{ textDecoration: "none", color: "#568dca" }}
                    >
                      Forgot password
                    </Link>{" "}
                    <br />
                  </div>
                  {isUserLoggedInOtherDevice && (
                    <div>
                      <div className="d-flex  justify-content-start align-items-start gap-2">
                        {/* <input
                          style={{ transform: 'translate(0.3rem,0.3rem)' }}
                          type="checkbox"
                          id="forcedLogin"
                          name="forcedLogin"
                          
                          // defaultValue="Bike"
                          onChange={() => setForcedLogin(!forcedLogin)}
                        /> */}
                        <label
                          className="info"
                          style={{ fontSize: "14px" }}
                          htmlFor="forcedLogin"
                        >
                          {" "}
                          You are logged in another session. Are you sure you
                          want to login ? You will be logged out from other
                          session
                          <style jsx="true">{`
                            .info {
                              border: 1px solid #00bfff;
                              padding: 4px 6px;
                              border-radius: 5px;
                              background: rgba(0, 191, 255, 0.2);
                              margin-bottom: 5px;
                            }
                          `}</style>
                        </label>
                        <br />
                        <br />
                      </div>

                      {/* <h4>
                         
                          </h4> */}
                    </div>
                  )}
                  <div className={styles.login_button}>
                    {isLoading ? (
                      <button
                        style={{
                          cursor: `${isLoading ? "not-allowed" : ""}`,
                          opacity: `${isLoading ? 0.7 : 1}`,
                        }}
                        type="button"
                        className={`w-100 btn`}
                      >
                        <Loader />
                      </button>
                    ) : (
                      <button type="submit" className="btn w-100">
                        {isUserLoggedInOtherDevice ? (
                          <>
                            <FaLock className="mx-2" /> Acknowledge & Login
                          </>
                        ) : (
                          "Login"
                        )}
                      </button>
                    )}
                  </div>
                </form>
                {/* <div className="d-flex align-items-end gap-2 my-3">
                  <p className={styles.para}>
                    New to Learning Management System?
                  </p>
                  <div className={styles.signup_button}>
                    <button onClick={() => navigate("/signup")} className="btn">
                      Sign up
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
