// ------------------------------------------------Imports-------------------------------------------
import React, { useState } from "react";
import "./Dropdown.css";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------

const Dropdown = ({
  userName,
  toggleTheme,
  logoutHandler,
  setTheme,
  theme,
  avatar,
}) => {
  const [open, setOpen] = useState(false);

  // ---------------------------------------------------------------------------------------------------
  const navigate = useNavigate();
  // ---------------------------------------------------------------------------------------------------

  return (
    <>
      <section className="my_dropdown">
        <div className="dropComponent d-md-block">
          <section
            className={`dropdown-menu ${open ? "open" : "close"}`}
            id="dropdown-menu"
          >
            <button
              className="d-flex justify-content-end align-items-center p-2 dropdownButton"
              onClick={() => {
                setOpen(!open);
              }}
              style={{ color: "white" }}
            >
              <style jsx="true">{`
                @media (max-width:475px) {
                  .dropdownButton{
                   background:transparent !important;
                  }
                `}</style>
              {avatar ? (
                <img
                  className="m-2"
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
              <div className="d-sm-none d-none d-md-block">
                {userName || "N.A"}
              </div>
              <span
                className="chevron material-symbols-sharp"
                id="dropdown-icon"
              >
                expand_more
              </span>
            </button>
            <section
              id="navigation-menu"
              className="navigation-menu navigationMenuMobile"
            >
              <style jsx="true">{`
                @media (max-width:475px) {
                  .navigationMenuMobile{
                    position:absolute !important;
                    left:-5rem !important;
                  }
                `}</style>
              <div id="main-menu" className="main-menu">
                <div className="primary-menu">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setOpen(!open);
                    }}
                  >
                    Settings
                  </button>
                  <button
                    onClick={(e) => {
                      toggleTheme(e);
                      setOpen(!open);
                    }}
                  >
                    <span>{theme === "light" ? "Dark" : "Light"}</span> Theme
                  </button>
                  <button
                    onClick={() => {
                      setOpen(!open);
                      logoutHandler();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>
    </>
  );
};

export default Dropdown;
