// ---------------------------------------------------Imports-----------------------------------------
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BsFillPenFill } from "react-icons/bs";
import bcrypt from "bcryptjs";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import ".././pagesCSS/settings.css";
import swal from "sweetalert";
import Swal from "sweetalert2";
import {
  updateLoggedInUser,
  updateUser,
} from "../../features/actions/Authentication/authenticationActions";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

// ----------------------------------------------------------------------------------------------------

const Setting = () => {
  // -----------------------------------------------States-----------------------------------------------
  const initialValue = {
    password: "",
    fullName: "",
    address: "",
  };

  const [editableWindow, setEditableWindow] = useState(false);
  const [currentPasswordVisibility, setCurrentPasswordVisibility] =
    useState(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [customErrorPasswordConfirmation, setCustomErrorPasswordConfirmation] =
    useState(false);
  const [avatarNew, setAvatar] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [showProfileUpdateBtn,setShowProfileUpdateBtn] = useState(false);

  // ----------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks-----------------------------------------------
  const dispatch = useDispatch();

  const { _id, fullName, userName, password, role, email, avatar } =
    useSelector((state) => {
      return state?.auth?.loggedInUserData;
    });

  const { isUserUpdated } = useSelector((state) => state?.auth);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { fullName } });

  //new form for the change password
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setError,
    reset: reset2,
  } = useForm();

  const imgInputRef = useRef();
  // ----------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-----------------------------------------------
  //send password request
  const sendPasswordChangeRequest = async (data) => {
    try {
      let formData = new FormData();
      data.isPasswordChanged = true;
      formData.append("payload", JSON.stringify(data));
      formData.append("avatar", avatarNew);
      dispatch(updateLoggedInUser({ payload: formData, id: _id }));

      // swal("Password change", "Successfully changed password", "success", {
      //   button: "Press to continue",
      // });
      // dispatch(log)
    } catch (error) {
      toast.error(error);
    }
  };

  const onSubmit = (data) => {
    let formData = new FormData();
    formData.append("payload", JSON.stringify(data));
    formData.append("avatar", avatarNew);
    postData(formData);
  };
  const updateProfile = () => {
    let formData = new FormData();
    formData.append("payload", JSON.stringify({}));
    formData.append("avatar", avatarNew);
    postData(formData);
  };
  const postData = async (data) => {
    try {
      dispatch(updateLoggedInUser({ payload: data, id: _id }));
    } catch (error) {
      swal("Error Occured", `${error?.message ?? error}`, "warning", {
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        timer: 15000,
      });
    }
  };

  const onChangePassword = async (data2) => {
    //just to make a good UX
    setCustomErrorPasswordConfirmation(false);
    const { currentPassword, newPassword, confirmPassword } = data2;
    const newVal = await bcrypt.compare(currentPassword, password);
    if (!newVal) {
      setError("currentPassword", {
        type: "manual",
        message: "Wrong password",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setCustomErrorPasswordConfirmation(true);
      return;
    }

    const alert = await swal(
      "Are you sure to change the password?",

      {
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        timer: 5000, // Time in milliseconds (5 seconds)
      }
    );

    alert && sendPasswordChangeRequest(data2);
  };

  // handleButtonClick -- handler to select the image of the profile
  const handleButtonClick = () => {
    imgInputRef.current.click();
  };
  // -------------------------------------------------------------------------------------------------
  // ------------------------------------------useEffect----------------------------------------------
  useEffect(() => {
    if (isUserUpdated) {
      reset2();
      setEditableWindow(false);
      setShowProfileUpdateBtn(false);
    }
  }, [isUserUpdated]);

  // -------------------------------------------------------------------------------------------------
  return (
    <section
      style={{ backgroundColor: "var(--primary-color)" }}
      className="user_profile"
    >
      <div className="container py-5">
        <div className="row">
          <div className="cardParent col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div
                  // style={{ width: "fit-content" }}
                  className="position-relative "
                >
                  <input
                    className="choosefile d-none"
                    type="file"
                    // value={"abcd"}
                    onChange={(e) => {
                      const url = URL.createObjectURL(e?.target?.files[0]);
                      setSelectedAvatar(url);
                      setAvatar(e?.target?.files[0]);
                      setShowProfileUpdateBtn(true)
                    }}
                    ref={imgInputRef}
                  />
                  <div className="w-100 h-100">
                    <img
                      src={selectedAvatar || avatar}
                      alt={fullName}
                      className="rounded-circle img-fluid avatar "
                      style={{
                        width: "200px",
                        height: "200px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        imgInputRef.current.click();
                      }}
                    />
                    <lable
                      for="fileInput"
                      onClick={() => handleButtonClick()}
                      className="inputpicture"
                    >
                      <MdAddAPhoto />
                    </lable>
                  </div>
                </div>
                <h5 className="my-3 name">{fullName}</h5>
                <p className=" mb-1 text-color role">{role}</p>
                {showProfileUpdateBtn && (
                  <input
                    type="button"
                    className="text-muted font-size-sm"
                    style={{
                      background: "pink",
                      border: "0px",
                      fontFamily: "poppins",
                      fontWeight: "bolder",
                      borderRadius:"10px",
                      padding:"10px"
                    }}
                    value="Update Profile Picture"
                    onClick={updateProfile}
                  />
                )}
                {/* <p className=" mb-4 text-color">Bay Area, San Francisco, CA</p> */}
              </div>
            </div>
            <div className="card mb-4 mb-lg-0 p-5">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    {/* <i className="fas fa-globe fa-lg text-warning" /> */}
                    <FaGlobe className="text-warning fs-3" />
                    <p className="mb-0">https://mdbootstrap.com</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <FaGithub
                      style={{ color: "#333333", fontSize: "1.75rem " }}
                    />
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    {/* <i
                      className="fab fa-twitter fa-lg"
                      style={{ color: "#55acee" }}
                    /> */}
                    <FaTwitter
                      style={{ color: "#55acee", fontSize: "1.75rem" }}
                    />
                    <p className="mb-0">@mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    {/* <i
                      className="fab fa-instagram fa-lg"
                      style={{ color: "#ac2bac" }}
                    /> */}
                    <FaInstagram
                      style={{ color: "#ac2bac", fontSize: "1.75rem" }}
                    />
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    {/* <i
                      className="fab fa-facebook-f fa-lg"
                      style={{ color: "#3b5998" }}
                    /> */}
                    <FaFacebook
                      style={{ color: "#3b5998", fontSize: "1.75rem" }}
                    />
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        disabled={!editableWindow}
                        className="form-control w-50"
                        {...register("fullName", { required: true })}
                      />{" "}
                      {errors.fullName && (
                        <span style={{ color: "red" }}>
                          Full Name is required
                        </span>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      {/* <p className="text-muted mb-0">{email}</p> */}
                      <input
                        type="text"
                        disabled
                        defaultValue={email}
                        style={{
                          color: "var(--table-font-color)",
                          width: "100%",
                          border: "none",
                        }}
                      />{" "}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Phone</p>
                    </div>
                    <div className="col-sm-9">
                      <p
                        className=" mb-0"
                        style={{ color: "var(--table-font-color) !important" }}
                      >
                        (097) 234-5678
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address</p>
                    </div>
                    <div className="col-sm-9">
                      {/* <p className="text-muted mb-0">1234567890</p> */}
                      <input
                        type="text"
                        disabled={!editableWindow}
                        defaultValue="1234567890"
                        className="form-control w-50"
                        // style={{
                        //   border: "none",
                        //   borderBottom: editableWindow
                        //     ? "1px solid black"
                        //     : "0px",
                        // }}
                        // {...register("fullName", { required: true })}
                      />{" "}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Username</p>
                    </div>
                    <div className="col-sm-9">
                      {/* <p className="text-muted mb-0">{userName}</p> */}
                      <input
                        type="text"
                        disabled
                        value={userName}
                        style={{
                          border: "none",
                        }}
                      />{" "}
                    </div>
                  </div>
                  <hr />
                  <br />

                  <input
                    className="btn btn-priamry"
                    onClick={(e) => setEditableWindow(true)}
                    type="button"
                    value="Edit Profile"
                  />

                  {(editableWindow) && (
                    <button className="btn btn-primary mx-3" type="submit">
                      Update Profile
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* //change password section from here */}
            <div className="border p-4">
              <h1>Change Password</h1>
              <div>
                <form key={2} onSubmit={handleSubmit2(onChangePassword)}>
                  <label htmlFor="" className="text">
                    Old Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      size="lg"
                      type={currentPasswordVisibility ? "text" : "password"}
                      placeholder="Current Password"
                      {...register2("currentPassword", { required: true })}
                    />
                    {!currentPasswordVisibility ? (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          right: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        <IoIosEye
                          size={25}
                          onClick={(e) => setCurrentPasswordVisibility(true)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          cursor: "pointer",
                          right: "1rem",
                        }}
                      >
                        <IoMdEyeOff
                          size={25}
                          onClick={(e) => setCurrentPasswordVisibility(false)}
                        />
                      </span>
                    )}
                  </div>
                  {errors2?.currentPassword && (
                    <span style={{ color: "red" }}>
                      {errors2.currentPassword.message}
                    </span>
                  )}
                  <br />
                  <label htmlFor="" className="text">
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={newPasswordVisibility ? "text" : "password"}
                      size="lg"
                      placeholder="New Password"
                      {...register2("newPassword", { required: true })}
                    />
                    {!newPasswordVisibility ? (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          cursor: "pointer",
                          right: "1rem",
                        }}
                      >
                        <IoIosEye
                          size={25}
                          onClick={(e) => setNewPasswordVisibility(true)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          right: "1rem",
                        }}
                      >
                        <IoMdEyeOff
                          size={25}
                          onClick={(e) => setNewPasswordVisibility(false)}
                        />
                      </span>
                    )}
                  </div>
                  {errors.newPassword && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                  <br />
                  <label htmlFor="" className="text">
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      size="lg"
                      type={newPasswordVisibility ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...register2("confirmPassword", { required: true })}
                    />
                    {!newPasswordVisibility ? (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          cursor: "pointer",
                          right: "1rem",
                        }}
                      >
                        <IoIosEye
                          size={25}
                          onClick={(e) => setNewPasswordVisibility(true)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.8rem",
                          right: "1rem",
                        }}
                      >
                        <IoMdEyeOff
                          size={25}
                          onClick={(e) => setNewPasswordVisibility(false)}
                        />
                      </span>
                    )}
                    {errors2.confirmPassword && (
                      <span style={{ color: "red" }}>
                        This field is required
                      </span>
                    )}
                  </div>
                  {customErrorPasswordConfirmation && (
                    <span style={{ color: "red" }}>
                      Password is not matching
                    </span>
                  )}
                  <br />
                  <br />
                  <br />
                  <input
                    className="btn btn-priamry"
                    type="submit"
                    value={"Update Password"}
                  />
                  {/* <button
                    className="btn btn-primary "
                    type="submit"
                    value={"update Password"}
                  >
                    Update Password
                  </button> */}
                  <br />
                  <br />
                </form>
              </div>
            </div>

            <>
              {/* <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0">
                    <div className="card-body">
                      <p className="mb-4">
                        {/* <span className="text-primary font-italic me-1">
                        assigment
                      </span> */}
              {/* Project Status */}
              {/* </p>
                      <p className="mb-1" style={{ fontSize: ".77rem" }}>
                        Web Design
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "80%" }}
                          aria-valuenow={80}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Website Markup
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "72%" }}
                          aria-valuenow={72}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        One Page
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "89%" }}
                          aria-valuenow={89}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Mobile Template
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={55}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Backend API
                      </p>
                      <div
                        className="progress rounded mb-2"
                        style={{ height: 5 }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "66%" }}
                          aria-valuenow={66}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              // </div> */}
            </>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Setting;
