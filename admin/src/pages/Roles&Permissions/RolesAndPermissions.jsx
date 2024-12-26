// -----------------------------------------------Imports--------------------------------------------------
import React, { useEffect, useState } from "react";
import "../pagesCSS/RolesAndPermissions.css";
import { AiTwotoneEdit, AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import useAuth from "../../hooks/useAuth";

import {
  getUsers,
  updateUser,
} from "../../features/actions/Authentication/authenticationActions";
import { resetUserState } from "../../features/slices/Authentication/authenticationSlice";
import CourseListSkeleton from "../Course/CourseListSkeleton";
import RolesAndPermissionsViewModal from "../Videos/RolesAndPermissionsViewModal";
// ---------------------------------------------------------------------------------------------------------

const RolesAndPermissions = () => {
  // -----------------------------------------------States----------------------------------------------------
  const [rolesAndPermissionsViewModal, setRolesAndPermissionsViewModal] =
    useState(false);
  const [pageChanged, setPageChanged] = useState(false);
  const [searchChanged, setSearchChanged] = useState(false);
  const [search, setSearch] = useState("");
  const [individualUserData, setIndividualUserData] = useState({});
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Hooks----------------------------------------------------
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, usersList, isUserUpdated } = useSelector(
    (state) => state?.auth
  );
  const theme = useSelector((state) => state.theme);
  const { loggedInUserData } = useAuth();

  let rolesPage =
    searchParams.getAll("page").length > 0 ? searchParams?.get("page") : 1;
  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions-------------------------------------------------

  // coursePaginationHandler -- handler to handle the course list pagination
  const rolesPaginationHandler = (index) => {
    setPageChanged(true);
    setSearchParams((searchParams) => {
      searchParams.set("page", index + 1);
      return searchParams;
    });
  };

  // activateCheckboxHandler -- handler to handle the checkbox changes
  const activateCheckboxHandler = (e, user) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: `Are You Sure, You want to ${
          user?.disabled ? "enable" : "disable"
        } this user`,
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              const formData = new FormData();
              if (user?._id) {
                let obj = JSON.stringify({ disabled: e.target.checked });
                formData.append("payload", obj);
              } else {
                return toast.error("No User Found");
              }
              dispatch(updateUser({ payload: formData, id: user?._id }));
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
    }
  };

  // ---------------------------------------------------------------------------------------------------------
  // -----------------------------------------------useEffects------------------------------------------------

  useEffect(() => {
    let url = [];

    if (search === "") {
      if (rolesPage > 0 && pageChanged) {
        dispatch(getUsers("/" || `page=${rolesPage}`));
      } else if (searchChanged) {
        dispatch(getUsers("/" || `page=${rolesPage}`));
      }
    }
  }, [rolesPage, search]);

  useEffect(() => {
    let timer;
    if (search !== "") {
      setSearchChanged(true);
      timer = setTimeout(() => {
        setSearchParams((searchParams) => searchParams.set("page", 1));
        dispatch(getUsers(`?searchQuery=${search}`));
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    return () => {
      if (pageChanged) {
        // dispatch(fetchCourses());
      }
    };
  }, [pageChanged]);

  useEffect(() => {
    if (isUserUpdated) {
      dispatch(getUsers("/"));
      dispatch(resetUserState(false));
    }
  }, [isUserUpdated]);

  // ---------------------------------------------------------------------------------------------------------
  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-offset-1 col-xm-12">
            <div className="panel border ">
              <div className="panel-heading">
                <div className="row">

                  <div className="col col-sm-3 col-xs-12 header d-flex justify-content-center">
                    <h4 className="title ">Roles And Permissions List</h4>
                  </div>

                  <div className="col-sm-9 col-xs-12 text-right d-flex justify-content-end">
                    <div className="btn_group">
                      <input
                        type="text"
                        className="form-control w-100"
                        placeholder="Search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-body table-responsive">
                <table
                  className={
                    theme === "light"
                      ? "table table-striped"
                      : "table table-striped table-dark"
                  }
                >
                  <thead>
                    <tr className="text-center">
                      <th>#</th>
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Assigned Role</th>
                      <th>Assigned Permissions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  {isLoading ? (
                    <CourseListSkeleton />
                  ) : (
                    <tbody>
                      {Array.isArray(usersList?.data) &&
                        usersList?.data.length > 0 &&
                        usersList?.data.map((user, index) => {
                          return (
                            <tr style={{ backgroundColor: "white" }}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{user?._id}</td>
                              <td className="text-center">{user?.userName}</td>
                              <td className="text-center">{user?.role}</td>
                              <td className="text-center">
                                <div
                                  className="permissionsMainCard"
                                  style={{
                                    maxHeight: "200px",
                                    overflow: "auto",
                                    overflowX:"hidden"
                                    // padding: "10px",
                                  }}
                                >
                                  {(Array.isArray(user?.permissions) &&
                                    user?.permissions?.length > 0 &&
                                    user?.permissions?.map((user) => {
                                      return (
                                        <div className="permissionCard">
                                          {user}
                                        </div>
                                      );
                                    })) ||
                                    "NA"}
                                </div>
                              </td>
                              <td className="">
                                <div className="d-flex justify-content-center align-items-center">
                                  {doesUserHaveRoleToAccess(
                                    ["SUPER_ADMIN", "ADMIN"],
                                    loggedInUserData?.role
                                  ) &&
                                    doesUserHavePermissions(
                                      ["VIEW_ROLES_&_PERMISSIONS"],
                                      loggedInUserData
                                    ) && (
                                      <div
                                        className={"col-md-2"}
                                        onClick={() => {
                                          setRolesAndPermissionsViewModal(
                                            !rolesAndPermissionsViewModal
                                          );
                                          setIndividualUserData(user);
                                        }}
                                      >
                                        <AiOutlineEye
                                          size={25}
                                          style={{ cursor: "pointer" }}
                                        />
                                      </div>
                                    )}
                                  {doesUserHaveRoleToAccess(
                                    ["SUPER_ADMIN", "ADMIN"],
                                    loggedInUserData?.role
                                  ) &&
                                    doesUserHavePermissions(
                                      ["EDIT_ROLES_&_PERMISSIONS"],
                                      loggedInUserData
                                    ) && (
                                      <div className="col-md-2">
                                        <AiTwotoneEdit
                                          size={25}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            navigate(
                                              "/roles_permissions_edit",
                                              {
                                                state: { user },
                                              }
                                            );
                                          }}
                                        />
                                      </div>
                                    )}
                                  {doesUserHaveRoleToAccess(
                                    ["SUPER_ADMIN", "ADMIN"],
                                    loggedInUserData?.role
                                  ) &&
                                    doesUserHavePermissions(
                                      ["DISABLE_USER"],
                                      loggedInUserData
                                    ) &&
                                    user?.role !== "SUPER_ADMIN" && (
                                      <div className="form-check form-switch d-flex justify-content-center align-items-center col-md-8 row">
                                        <div className="activeUserCheckBox col-md-4 d-flex align-items-center justify-content-center">
                                          <input
                                            className="form-check-input "
                                            type="checkbox"
                                            id="flexSwitchCheckDefault"
                                            onChange={(e) => {
                                              activateCheckboxHandler(
                                                e,
                                                user || {}
                                              );
                                            }}
                                            checked={!user?.disabled}
                                          />
                                        </div>

                                        <div className="activeUserCheckBoxContent col-md-8 d-flex align-items-center justify-content-center text-center">
                                          <p className="mb-0">
                                            {user?.disabled
                                              ? "Activate"
                                              : "Deactivate"}
                                          </p>
                                        </div>
                                      </div>
                                    ) || (
                                      <div className="form-check form-switch d-flex justify-content-center align-items-center col-md-8 row" style={{visibility:"hidden"}}>
                                        <div className="activeUserCheckBox col-md-4 d-flex align-items-center justify-content-center">
                                          <input
                                            className="form-check-input "
                                            type="checkbox"
                                            id="flexSwitchCheckDefault"
                                            // onChange={(e) => {
                                            //   activateCheckboxHandler(
                                            //     e,
                                            //     user || {}
                                            //   );
                                            // }}
                                            checked={!user?.disabled}
                                          />
                                        </div>

                                        <div className="activeUserCheckBoxContent col-md-8 d-flex align-items-center justify-content-center text-center">
                                          <p className="mb-0">
                                            {user?.disabled
                                              ? "Activate"
                                              : "Deactivate"}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                </table>
              </div>
              <div className="panel-footer">
                <div className="row">
                  <div className="col col-sm-6 col-xs-6 text-center" >***+-*
                  
                    <span className="pagecontainer">
                    Showing <b>{rolesPage}</b> Out Of{" "}
                    <b>{usersList?.totalPages}</b> Entries
                    </span>
                  </div>
                  <div className="col-sm-6 col-xs-6  d-flex justify-content-center ">
                    <div className="num   text-secondary"
                     >
                      <span 
                        onClick={() => {
                          if (rolesPage > 1) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", --rolesPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &laquo;
                      </span>
                      
                      {usersList?.totalPages >1   
                        ? Array(usersList?.totalPages)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className={`${
                                  rolesPage == index + 1 ? "active" : ""
                                } `
                              
                              }
                                onClick={() => rolesPaginationHandler(index)}
                              >
                                {index + 1}
                              </span>
                            ))
                        : Array(1)
                            .fill(0)
                            .map((key, index) => (
                              <span
                                className="active"
                                onClick={() => rolesPaginationHandler(index)}
                              >
                                1
                              </span>
                            ))}
                       <span style={{backgroundColor:"gery"}}
                        onClick={() => {
                          if (rolesPage < usersList?.totalPages) {
                            setPageChanged(true);
                            setSearchParams((searchParams) => {
                              searchParams.set("page", ++rolesPage);
                              return searchParams;
                            });
                          }
                        }}
                      >
                        &raquo;
                  
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {rolesAndPermissionsViewModal && (
          <RolesAndPermissionsViewModal
            user={individualUserData}
            show={rolesAndPermissionsViewModal}
            hide={() => setRolesAndPermissionsViewModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default RolesAndPermissions;
