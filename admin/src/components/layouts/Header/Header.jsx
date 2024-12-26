import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
// import logoImg from "../../../assets/Images/logo-bg.png"
// import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import logo from "../../../assets/Images/logowhite.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { logout } from "../../../features/actions/Authentication/authenticationActions";
import { useDispatch } from "react-redux";
import {
  resetReduxStoreData,
  resetState,
} from "../../../features/slices/Authentication/authenticationSlice";
import useAuth from "../../../hooks/useAuth";
import { changeTheme } from "../../../features/slices/Theme/themeslice";
import {
  doesUserHavePermissions,
  doesUserHaveRoleToAccess,
} from "../../../utils";
// import Dropdown from "../dropdown/Dropdown";
import DropDown from "../dropdown/Dropdown";

const Header = () => {
  // ----------------------state-----------------------------------------------------------
  const [theme, setTheme] = useState("light");

  // --------------------------------------react form hook ---------------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedInUserData } = useAuth();

  // ---------------------------------------function--------------------------------------------
  // logoutHandler - handler to log out the user
  const logoutHandler = () => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure! You want to Logout",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const logoutResponse = dispatch(logout());
              const res = await logoutResponse;
              if (res.payload.success) {
                dispatch(resetReduxStoreData());
              }
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // const dispatch= useDispatch();

  // -----------------------------useEffect-----------------------

  useEffect(() => {
    dispatch(changeTheme(theme));
  }, [theme]);

  return (
    <>
      {/* <section className={styles.header_main}>
        <Navbar expand="lg" className={styles.navbar_nav}>
          <Container>
            <Link
              to="/"
              className="d-flex align-items-center justify-content-center h-100"
            >
              <img src={logo} alt="logo" width="200px" />
            </Link>
            <Dropdown/>

            <DropdownButton
              id="dropdown-basic-button"
              title={`${loggedInUserData?.userName}`}
            >
              <Dropdown.Item
                as={Link}
                className={styles.buttonhover}
                to="/settings"
              >
                User Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={toggleTheme}
                className={styles.buttonhover}
              >
                <span>{theme === "light" ? "Dark" : "Light"}</span> Theme
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                className={styles.buttonhover}
                onClick={logoutHandler}
              >
                Logout
              </Dropdown.Item>
            </DropdownButton>
          </Container>
        </Navbar>
      </section> */}
      <nav className={`${styles.navbar_nav} navbar navbar-expand-lg`}>
        <div className="container-fluid">
          <div
            className={`d-flex  h-100 border-0 p-2`}
          >
            <Link
              to="/"
              className="d-flex align-items-center justify-content-center h-100"
            >
              <img src={logo} alt="logo" width="200px" />
            </Link>
          </div>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button> */}
          {/* <div className="collapse navbar-collapse" id="navbarSupportedContent"> */}
            <ul className="navbar-nav ms-auto mb-5 ">
              <>
                {/* <li className="nav-item dropdown fw-bold d-md-none d-sm-block d-block">
                  <Link
                    className="nav-link dropdown-toggle mx-2 my-2"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {loggedInUserData?.fullName}
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <div onClick={toggleTheme} className={styles.buttonhover}>
                        <span>{theme === "light" ? "Dark" : "Light"}</span>{" "}
                        Theme
                      </div>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          logoutHandler();
                        }}
                        className={styles.buttonhover}
                      >
                        Logout
                      </div>
                    </li>
                  </ul>
                </li> */}
                <li className="nav-item dropdown">
                  <div
                    className="dropDownBox d-flex"
                    style={{
                      width: "200px",
                    }}
                  >
                    <style jsx ="true">
                      {
                        `
                        @media (max-width:475px) {
                          .dropDownBox{
                            width:65px !important;
                          }
                        `
                      }
                    </style>
                    <DropDown
                      userName={loggedInUserData?.userName}
                      avatar={loggedInUserData?.avatar}
                      toggleTheme={toggleTheme}
                      logoutHandler={logoutHandler}
                      setTheme={setTheme}
                      theme={theme}
                    />
                  </div>
                </li>
              </>
            </ul>
          {/* </div> */}
        </div>
      </nav>
    </>
  );
};

export default Header;
