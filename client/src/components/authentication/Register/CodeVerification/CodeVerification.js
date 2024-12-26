import React, { useRef, useState, useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import verification from "../../../../assets/images/verification.png";
import styles from "./CodeVerification.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useOTPTimer from "./useOTPTimer";
import { useDispatch, useSelector } from "react-redux";
import BlurLoader from "../../../common/BlurLoader";
import {
  sendOtp,
  updatePassword,
  verifyOtp,
} from "../../../../features/actions/authActions";
import { clearSignUpState } from "../../../../features/slices/authSlice";

const CodeVerification = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmOtp, setConfirmOtp] = useState(null);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [numericOTP, setNumericOTP] = useState(otp);

  const [minutes, seconds,resetTimer] = useOTPTimer();

  const { isLoading, isMailSent, isOtpVerified, otpGenerated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if(otpGenerated === false){
      navigate('/login')
    }

    
  }, [otpGenerated])

 
  useEffect(() => {

    return () => {
      dispatch(clearSignUpState())
      resetTimer()
    };
  }, []);
  
  
  const handleOtp = (e, index) => {
    const newOtp = [...otp];
    if (!isNaN(Number(e.target.value))) {
      newOtp[index] = e.target.value;
      if (e.target.value != "" && e.target.value != null && index < 5) {
        inputRefs[index + 1].current.focus();
      }
      setOtp(newOtp);
    }
  };

  useEffect(() => {
    if (otp.every((item) => item !== "" && item !== null)) {
      setConfirmOtp(Number(otp.join("")));
    }
  }, [otp]);

  useEffect(() => {
    if (confirmOtp != null) {
      sendPayload();
    }
  }, [confirmOtp]);

  const sendPayload = () => {
    //This function will be called after the otp is confirmed
    const otpObj = {
      email: state,
      otp: confirmOtp,
    };
    dispatch(verifyOtp(otpObj));
  };

  //check otp is verfied or not then redirect user to creteNewPassword
  useEffect(() => {
    if (isOtpVerified) {
      navigate("/createnewpassword", {
        state: { email: state, otp: confirmOtp },
      });
    }
  }, [isOtpVerified]);

   // backspace functionality
   const handleBackspace = (e, index) => {
     if ((e.key === 'Backspace' && index > 0 && otp[index] === '')) {
       inputRefs[index-1].current.focus()
       setOtp(prev =>{
         const newOtp = [...prev]
        //  newOtp[index] = ''
         newOtp[index -1] = ''
         return newOtp
        })
      }
    };

    useEffect(() => {
      const handleBeforeUnload = (event) => {
        const confirmationMessage = `You'll be Redirect to login`;
      event.returnValue = confirmationMessage;
        dispatch(clearSignUpState())
      resetTimer()
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [dispatch]);
    
  return (
    <Container
      className={`${styles.container} d-flex align-items-center justify-content-center`}
    >
      <Row
        className={`${styles.row} d-flex align-items-center  position-relative`}
      >
        {/* <BlurLoader/> */}

        <Col md={5} className={styles.displaynone}>
          <div>
            <img className={styles.img} src={verification} alt="verification" />
          </div>
        </Col>
        <Col>
          <div className="my-2">
            <h1 className={styles.heading}>Code Verification</h1>
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
                    key={index}
                    onChange={(e) => {
                      handleOtp(e, index);
                    }}
                    maxLength={1}
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
                    disabled={isLoading}
                    className={`${styles.input} text-center rounded`}
                  />
                );
              })}
            </form>
            <div className="d-flex justify-content-end my-1 px-4">
              <p className={`${styles.paragraph}`}>
                00:{(seconds < 10 ? `0${seconds}` : seconds)}
              </p>
            </div>
          </div>
          <div>
            <p className={styles.resend}>
              Didn’t receive code?{" "}
              <button
              type="button"
              onClick={()=>{dispatch(sendOtp(state))}}
                style={{
                  cursor: `${seconds > 0 ? "not-allowed" : "pointer"}`,
                  opacity: `${seconds > 0 ? 0.5 : 1}`,
                  color:`${seconds > 0 ? "" : "blue"}`
                }}
                className={`${styles.recieveCode} btn`}
                disabled={  seconds > 0  ? true :( isLoading ? true : false)}
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

export default CodeVerification;
