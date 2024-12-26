// ------------------------------------------------Imports-------------------------------------------
import React, { useState } from "react";
import "./DropDown.css";
import { useNavigate } from "react-router-dom";

const DropDown = ({ fullName, logoutHandler, closeDropDown, avatar }) => {
  const [open, setOpen] = useState(false);

  // -------------------------------------------------------------------------------------------------//
  // ------------------------------------------------Hooks--------------------------------------------//
  const navigate = useNavigate();
  // -------------------------------------------------------------------------------------------------//
  // ------------------------------------------------Functions----------------------------------------//

  // -------------------------------------------------------------------------------------------------//
  // ------------------------------------------------useEffect----------------------------------------//
  // -------------------------------------------------------------------------------------------------//
  return (
    <>
      <section className="my_dropdown">
        <div className="dropComponent d-md-block d-sm-none d-none">
          <section
            className={`dropdown-menu ${open ? "open" : "close"}`}
            id="dropdown-menu"
          >
            <button
              onClick={() => {
                setOpen(!open);
              }}
              style={{ color: "black", fontWeight: "700" }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  style={{
                    width: "2.2rem",
                    height: "2.2rem",
                    borderRadius: "100%",
                  }}
                  alt="user"
                />
              ) : (
                <span className="material-symbols-sharp"> account_circle </span>
              )}
              {fullName || "N.A"}
              <span
                className="chevron material-symbols-sharp"
                id="dropdown-icon"
              >
                expand_more
              </span>
            </button>
            <section id="navigation-menu" className="navigation-menu">
              <div id="main-menu" className="main-menu">
                <div className="primary-menu">
                  <button
                    onClick={() => {
                      navigate("/user-profile");
                      setOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/user-profile");
                      setOpen(false);
                    }}
                  >
                    Watch History
                  </button>
                  {/* <button
                    onClick={() => {
                      navigate("/study-material");
                      setOpen(false);
                    }}
                  >
                    Study Material
                  </button> */}
                  <button onClick={logoutHandler}>Logout</button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>
    </>
  );
};

export default DropDown;
