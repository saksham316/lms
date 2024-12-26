import React, { useRef, useState, useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import verification from "../../assets/Images/verification.png";
import styles from "./CodeVerification.module.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useOTPTimer from "./CodeVerification/useOTPTimer";
import {
  generateOtp,
  signUp,
} from "../../features/actions/Authentication/authenticationActions";
import { clearSignUpState, resetOtpGenerationStatus } from "../../features/slices/Authentication/authenticationSlice";
import BlurLoader from "../../components/common/BlurLoader";
import { toast } from "react-toastify";
// -----------------------------------------------------------------------------------------------

const OtpVerification = () => {
  // --------------------------------------------States--------------------------------------------
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmOtp, setConfirmOtp] = useState(null);
  // -----------------------------------------------------------------------------------------------

  // --------------------------------------------Hooks----------------------------------------------
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const [minutes, seconds,resestTimer] = useOTPTimer();

  const { isLoading, userSignedSuccess,otpGenerated } = useSelector((state) => state.auth);

  // ------------------------------------------------------------------------------------------------

  // ---------------------------------------Functions------------------------------------------------

  const handleOtp = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    if (e.target.value != "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
    setOtp(newOtp);
  };

  const resendOtp = (e) => {
    try {
      if (state?.email) {
        dispatch(generateOtp({ email: state?.email?.toLowerCase() }));
      } else {
        toast.error("No Email Found");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------------------------------useEffects------------------------------------------------
  useEffect(() => {
    if (otp.every((item) => item !== "")) {
      setConfirmOtp(Number(otp.join("")));
    }
  }, [otp]);

  useEffect(() => {
    if (confirmOtp != null) {
      sendPayload();
    }
  }, [confirmOtp]);

  useEffect(() => {
    if(otpGenerated){
      resestTimer()
      dispatch(resetOtpGenerationStatus(false))
    }
  }, [otpGenerated])
  

  const sendPayload = () => {
    //This function will be called after the otp is confirmed
    const { userName, fullName, password, email, phone, avatar } = state;
    const formData = new FormData();
    const obj = {
      userName,
      email:email.toLowerCase(),
      fullName,
      password,
      phone,
      otp: confirmOtp,
    };
    formData.append("payload", JSON.stringify(obj));
    formData.append("avatar", avatar);
    dispatch(signUp(formData));
  };
  // backspace functionality
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index - 1] = "";
        return newOtp;
      });
    }
  };

  useEffect(() => {
    if (userSignedSuccess) {
      dispatch(clearSignUpState());
      navigate("/login");
    }
  }, [userSignedSuccess]);

  // ------------------------------------------------------------------------------------------------

  return (
    <Container
      className={`${styles.container} d-flex align-items-center justify-content-center`}
    >
      <Row
        className={`${styles.row} d-flex align-items-center position-relative`}
      >
        {isLoading && <BlurLoader />}
        <Col md={5} className={styles.displaynone}>
          <div>
            <img className={styles.img} src={verification} alt="verification" />
          </div>
        </Col>
        <Col>
          <div className="my-2">
            <h1 className={styles.heading}>Email Verification</h1>
          </div>
          <div className="my-3">
            <p className={styles.paragraph}>
              Please enter your 6 digits verification code, which have been sent
              to your registered email account.
            </p>
          </div>
          <div>
            <form className="d-flex gap-3 justify-content-evenly">
              {otp.map((item, index) => {
                return (
                  <input
                    onChange={(e) => {
                      handleOtp(e, index);
                    }}
                    maxLength={1}
                    key={index}
                    onKeyDown={(e) => {
                      handleBackspace(e, index);
                    }}
                    value={item}
                    type="text"
                    ref={inputRefs[index]}
                    style={{
                      cursor: `${isLoading ? "not-allowed" : "pointer"}`,
                      opacity: `${isLoading ? 0.5 : 1}`,
                    }}
                    className={`${styles.input} text-center rounded`}
                  />
                );
              })}
            </form>
            <div className="d-flex justify-content-end my-1 px-4">
              <p className={`${styles.paragraph}`}>
                00:{seconds < 10 ? `0${seconds}` : seconds}
              </p>
            </div>
          </div>
          <div>
            <p className={styles.resend}>
              Didn’t recieve code?{" "}
              <button
                disabled={seconds > 0 ? true : false}
                onClick={(e) => {
                  resendOtp(e);
                }}
                style={{
                  cursor: `${seconds > 0 ? "not-allowed" : "pointer"}`,
                  opacity: `${seconds > 0 ? 0.5 : 1}`,
                  border:0,
                  background:"white"
                }}
                className={`${styles.recieveCode}`}
              >
                Resend
              </button>{" "}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpVerification;
