import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import forgotPassword from "../../../assets/images/forgot.png";
import styles from "./ForgotPassword.module.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../../features/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  // const [otpGenerated, setOtpGenerated] = useState(false);

  const { isLoading, userSignedSuccess, otpGenerated } = useSelector(
    (state) => state.auth
  );

  const [isUpdateApiCalled, setIsUpdateApiCalled] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleSendVerifyOtp = (data) => {
    setEmail(data?.email);
    dispatch(sendOtp(data.email));
    setIsUpdateApiCalled(true);
  };

  useEffect(() => {
    if (otpGenerated) {
      navigate("/codeverification", { state: email });
    }
  }, [otpGenerated]);

  return (
    <Container
      className={`${styles.container} d-flex justify-content-center align-items-center `}
    >
      <Row
        className={`${styles.row} py-4 px-2 d-flex justify-content-center align-items-center`}
        style={{ height: "100vh" }}
      >
        <Col className={`${styles.displaynone} `} md={6}>
          <div>
            <img
              className={styles.img}
              src={forgotPassword}
              alt="forgotpassword"
            />
          </div>
        </Col>
        <Col className={styles.full}>
          <div>
            <h1 className={`${styles.heading} my-3`}>Forgot Password?</h1>
          </div>
          <div>
            <p className={styles.paragraph}>
              Please enter your email for the verification process, we will send
              a password reset otp on your registered email id, please check
              your email to continue resetting your password.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSendVerifyOtp)}>
            <input
              {...register("email", { required: true })}
              className={`${styles.email} my-3`}
              type="text"
              name="email"
              placeholder="Email"
            />
            {errors.email && (
              <span className="text-danger">This field is required</span>
            )}

            {isLoading ? (
              <button type="button" className={`${styles.btn} my-2`}>
                <Loader />
              </button>
            ) : (
              <button type="submit" className={`${styles.btn} my-2`}>
                Send OTP
              </button>
            )}
          </form>
          <div className="d-flex flex-column align-items-center"></div>
          <div className="d-flex flex-column align-items-center"></div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
