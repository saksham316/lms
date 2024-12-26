// ---------------------------------------------- Imports -----------------------------------------------
import React from "react";
import Header from "./Header/Header";
import SideBar from "../Sidebar/SideBar";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// --------------------------------------------------------------------------------------------------------

const Layout = () => {
  // -----------------------------------------------------Hooks---------------------------------------------

  const { isUserLoggedIn } = useAuth(); //custom hook
  // --------------------------------------------------------------------------------------------------------

  return isUserLoggedIn ? (
    <>
      <Header />
      <SideBar>
        <Outlet />
      </SideBar>
    </>
  ) : (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
