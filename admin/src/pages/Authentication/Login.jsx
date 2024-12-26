// --------------------------------------------------Imports-------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import LoginImage from "../../assets/Images/login2.jpg";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/actions/Authentication/authenticationActions";
import { Link } from "react-router-dom";
import "./Login.css";

import ReCAPTCHA from "react-google-recaptcha";
import { FaLock } from "react-icons/fa";
import Loader from "../../components/common/Loader";
import { resetLoading } from "../../features/slices/Authentication/authenticationSlice";
// ----------------------------------------------------------------------------------------------------------

const Login = () => {
  const [forcedLogin, setForcedLogin] = useState(false);
  // --------------------------------------------------States--------------------------------------------------
  // siteKey -- key for the google recaptcha
  const siteKey = "6LcXmFQoAAAAALKeZfQ20VjEuPFeytgSVBwjCLfE";

  // ----------------------------------------------------------------------------------------------------------

  // --------------------------------------------------Hooks--------------------------------------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const captchaRef = useRef();

  const { loginChange, isLoading, isUserLoggedInOtherDevice } = useSelector(
    (state) => state?.auth
  );

  const disable = { disabled: isLoading ? "disabled" : "" };

  // ----------------------------------------------------------------------------------------------------------
  // --------------------------------------------------Functions-----------------------------------------------

  // loginHandler -- handler to handle the login
  const loginHandler = (data) => {
    try {
      // token from the recaptcha after verifying as human
      const tokenReCaptcha = captchaRef.current.getValue();
      const { email, password } = data;
      const finalPayload = {
        email: email?.toLowerCase(),
        password,
        tokenReCaptcha,
      };
      isUserLoggedInOtherDevice && (finalPayload.forcedLogin = true);
      dispatch(login(finalPayload));
    } catch (error) {
      toast.error(error.message);
    }
  };
  // ------------------------------------------------------------------------------------------------------

  // --------------------------------------------------useEffects-----------------------------------------------
  useEffect(() => {
    captchaRef.current.reset();
  }, [loginChange]);

  useEffect(() => {
    dispatch(resetLoading(false));
  }, []);
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <section
        className="login_wrapper p-3 p-md-4 p-xl-5 d-flex align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="container">
          <div className="card border-light-subtle shadow-sm">
            <div className="row g-0">
              <div className="col-12 col-md-6">
                <div className="img_section">
                  <img
                    className="img-fluid rounded-start"
                    loading="lazy"
                    src={LoginImage}
                    alt="BootstrapBrain Logo"
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-5">
                        <h2>Log in to Gravita Oasis LMS</h2>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(loginHandler)}>
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label for="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          {...disable}
                          type="email"
                          className="form-control p-2"
                          name="email"
                          id="email"
                          placeholder="Enter Email"
                          {...register("email", {
                            required: {
                              value: true,
                              message: "Email is required",
                            },
                            onChange: (e) => {},
                          })}
                        />
                        {errors.email && (
                          <div className="text-danger pt-1">
                            {errors.email.message || "Email is Required"}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label for="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          // {isLoading? "disabled":""}
                          {...disable}
                          type="password"
                          className="form-control p-2"
                          name="password"
                          id="password"
                          {...register("password", {
                            required: {
                              value: true,
                              message: "Password is required",
                            },
                            onChange: (e) => {},
                          })}
                        />
                        {errors.password && (
                          <div className="text-danger pt-1">
                            {errors.password.message || "Password is Required"}
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <hr className="mt-1 mb-1 border-secondary-subtle" />
                          <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-start">
                            <Link
                              className="link-secondary text-decoration-none"
                              to="/forgot_password"
                            >
                              Forgot password
                            </Link>
                          </div>
                        </div>
                      </div>
                      {isUserLoggedInOtherDevice && (
                        <div>
                          <div>
                            {/* <input
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
                              You are logged in another session. Are you sure
                              you want to login ? You will be logged out from
                              other session
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
                      <div className="w-100">
                        <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          {/* <button
                            {...disable}
                            className="btn bsb-btn-xl btn-primary"
                            type="submit"
                          >
                            {isLoading ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              "Log In"
                            )}
                          </button> */}
                          {isLoading ? (
                            <button
                              type="button"
                              className="btn w-100 btn-primary"
                              style={{ opacity: "0.4" }}
                              disabled={true}
                            >
                              <Loader />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn w-100 btn-primary"
                            >
                              {isUserLoggedInOtherDevice ? (
                                <>
                                  <FaLock className="mx-2" /> Acknowledge &
                                  Login
                                </>
                              ) : (
                                "Login"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                  {/* <div className="row">
                    <div className="col-12">
                      <p className="my-3 text-center">Or sign in with</p>
                      <div className="d-flex gap-3 flex-column flex-xl-row">
                        <a
                          href="#!"
                          className="btn bsb-btn-xl btn-outline-primary w-md-50 w-sm-100 w-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-google"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                          </svg>
                          <span className="ms-2 fs-6">Google</span>
                        </a>
                        <a
                          href="#!"
                          className="btn bsb-btn-xl btn-outline-primary w-md-50 w-sm-100 w-100"
                        >
                          <svg
                            enable-background="new 0 0 2499.6 2500"
                            viewBox="0 0 2499.6 2500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                          >
                            <path
                              d="m1187.9 1187.9h-1187.9v-1187.9h1187.9z"
                              fill="#f1511b"
                            />
                            <path
                              d="m2499.6 1187.9h-1188v-1187.9h1187.9v1187.9z"
                              fill="#80cc28"
                            />
                            <path
                              d="m1187.9 2500h-1187.9v-1187.9h1187.9z"
                              fill="#00adef"
                            />
                            <path
                              d="m2499.6 2500h-1188v-1187.9h1187.9v1187.9z"
                              fill="#fbbc09"
                            />
                          </svg>
                          <span className="ms-2 fs-6">Microsoft</span>
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
