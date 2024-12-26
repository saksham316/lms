// ---------------------------------------------------Imports--------------------------------------
import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Col, NavDropdown, Row } from "react-bootstrap";
import { logOut } from "../../../features/actions/authActions";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { resetReduxStoreData } from "../../../features/slices/authSlice";
import { IoIosNotifications } from "react-icons/io";
import DropDown from "../../DropDown/DropDown";

// --------------------------------------------------------------------------------------------

const Header = () => {
  // --------------------------------------------States---------------------------------------------
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Hooks---------------------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserLoggedIn, loggedInUserData } = useSelector(
    (state) => state?.auth
  );
  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------Functions------------------------------------------
  const logoutHandler = () => {
    try {
      confirmAlert({
        title: "Logout Confirmation!",
        message: "Are you sure you want to logout?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const logoutResponse = dispatch(logOut());
              const res = await logoutResponse;
              if (res?.payload?.success) {
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
      toast.error(error?.message);
    }
  };

  // -----------------------------------------------------------------------------------------------
  // --------------------------------------------useEffect------------------------------------------
  // -----------------------------------------------------------------------------------------------

  return (
    <>
      <nav className={`${styles.main_header} navbar navbar-expand-lg`}>
        <div className="container-fluid">
          <div
            className={`d-flex align-items-center justify-content-md-center jusify-content-start h-100 border-0 p-2`}
          >
            <Link to="/">
              <img src={logo} alt="logo" width="220px" />
            </Link>
          </div>
          <div
            className="search d-md-flex justify-content-center text-cener d-none"
            style={{ width: "calc(100% - 1000px)", margin: "0 200px" }}
          >
            {/* <form className="w-100 mx-3 position-relative">
              <BiSearch
                style={{ position: "absolute", top: "10px", right: "0" }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
            </form> */}
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {isUserLoggedIn ? (
                <>
                  <li className="nav-item my-2 d-inline-grid w-100">
                    <Link to="/" className="nav-link fw-bold me-4">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item my-2 d-inline-grid w-100">
                    <Link
                      to="/study-material"
                      className="nav-link fw-bold me-4"
                    >
                      Study Material
                    </Link>
                  </li>
                  {/* <li className="nav-item my-2 d-inline-grid w-100">
                    <Link
                      type="button"
                      className="nav-link fw-bold d-flex gap-2 position-relative"
                    >
                    Notification
                      <IoIosNotifications style={{fontSize:"20px"}}/>
                      <span className="notify translate-middle badge rounded-pill bg-danger">
                        99+
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </Link>
                  </li> */}

                  <li className="nav-item dropdown fw-bold d-md-none d-sm-block d-block">
                    <Link
                      className="nav-link dropdown-toggle mx-2 my-2"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ fontWeight: "700 !important" }}
                    >
                      {loggedInUserData?.fullName.split(" ")[0]}
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/user-profile">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/watch-history">
                          Watch History
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" onClick={logoutHandler}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <div
                      className={`dropDownBox `}
                      style={{
                        width: "200px",
                        fontWeight: "700",
                      }}
                    >
                      <DropDown
                        fullName={loggedInUserData?.fullName?.split(" ")[0]}
                        logoutHandler={logoutHandler}
                        avatar={loggedInUserData?.avatar ?? null}
                      />
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item my-2 d-inline-grid w-100">
                    <Link className="btn btn-dark text-white" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item my-2 mx-md-2 mx-0 d-inline-grid w-100">
                    <Link className="btn btn-dark text-white" to="/signup">
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
