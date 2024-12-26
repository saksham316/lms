import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NewPassword from "../../../assets/images/newpassword.png";
import styles from "./CreateNewPassword.module.css";
import { useForm } from "react-hook-form";
import { passwordRegex } from "../../../utils/regexes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  verifyOtp,
} from "../../../features/actions/authActions";
import { toast } from "react-toastify";
import { clearSignUpState } from "../../../features/slices/authSlice";
import Loader from "../../common/Loader";

const CreateNewPassword = () => {
  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is mendatory")
      .min(3, "Password must be at 3 char long")
      .max(10, "Password must not be at 10 char long"),
    confirmPassword: Yup.string()
      .required("Password is mendatory")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
  });

  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { forgetPasswordOtpValid, isLoading } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data) => {
    const formData = {
      ...data,
      email: state?.email,
      otp: state?.otp,
    };
    dispatch(resetPassword(formData));
  };

  // useEffect(() => {
  //   if (isOtpVerified) {
  //     navigate("/login");
  //     toast.success("Password changes Successfully",{
  //       position:'top-right'
  //     })
  //   }
  // }, [isOtpVerified]);

  useEffect(() => {
    if (forgetPasswordOtpValid !== null) {
      if (forgetPasswordOtpValid) {
        navigate("/login");
      } else {
        navigate("/forgotpassword");
      }
    }
    return () => {
      dispatch(clearSignUpState());
    };
  }, [forgetPasswordOtpValid]);

  return (
    <Container
      className={`${styles.container} d-flex justify-content-center align-items-center`}
    >
      <Row className={`${styles.row} py-4 px-2`}>
        <Col className={styles.displaynone}>
          <img className={styles.img} src={NewPassword} alt="new password" />
        </Col>
        <Col>
          <div>
            <h1 className={styles.heading}>Create New Password</h1>
          </div>
          <div className="my-2">
            <p className={styles.paragraph}>
              Password must be 10 characters long
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("password")}
              className={`${styles.input} my-2`}
              type="text"
              placeholder="Create new password"
            ></input>
            <div className="text-danger">
              {errors.password && <span>This field is required</span>}
            </div>
            <input
              {...register("confirmPassword")}
              className={`${styles.input} my-2`}
              type="text"
              placeholder="Re-enter new password"
            ></input>
            <div className="text-danger">
              {errors.confirmPassword && <span>This field is required</span>}
            </div>
            <div className="d-flex justify-content-center my-3">
              {isLoading ? (
                <button type="button" className={`${styles.btn} my-2`}>
                  <Loader />
                </button>
              ) : (
                <button type="submit" className={`${styles.btn} my-2`}>
                  Send link
                </button>
              )}
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateNewPassword;
