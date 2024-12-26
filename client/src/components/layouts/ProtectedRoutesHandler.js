// ------------------------------------------------Imports---------------------------------------------
import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// ----------------------------------------------------------------------------------------------------

const ProtectedRoutesHandler = ({ allowedRoles, allowedPermissions }) => {
  // ----------------------------------------------Hooks-----------------------------------------------
  const { isUserLoggedIn, loggedInUserData } = useAuth();
  // --------------------------------------------------------------------------------------------------
  return isUserLoggedIn &&
    (loggedInUserData?.role?.toString()?.toUpperCase() === "SUPER_ADMIN" ||
      (allowedRoles?.includes(
        loggedInUserData?.role?.toString()?.toUpperCase()
      ) &&
        loggedInUserData?.permissions?.find((permission) => {
          return allowedPermissions.includes(permission);
        }))) ? (
    <Outlet />
  ) : isUserLoggedIn ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutesHandler;
