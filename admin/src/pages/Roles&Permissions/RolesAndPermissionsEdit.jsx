// ------------------------------------------------Imports-------------------------------------------------
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../pagesCSS/RolesAndPermissionsEdit.module.css";
import "../pagesCSS/RolesAndPermissions.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  updateCourse,
} from "../../features/actions/Course/courseActions";
import { useLocation, useNavigate } from "react-router-dom";
import { resetCourseState } from "../../features/slices/Course/courseSlice";
import { TailSpin } from "react-loader-spinner";
import "../pagesCSS/CourseEdit.module.css";
import { FaTimes } from "react-icons/fa";
import {
  availablePermissions,
  availableRoles,
  availableStudentPermissions,
} from "../../utils";
import {
  getUsers,
  updateUser,
} from "../../features/actions/Authentication/authenticationActions";
import { resetUserState } from "../../features/slices/Authentication/authenticationSlice";

// ------------------------------------------------------------------------------------------------------------

const RolesAndPermissionsEdit = () => {
  // ---------------------------------------------------States----------------------------------------------------
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [isFieldDataChanged, setIsFieldDataChanged] = useState(false);
  const [moduleThumbnail, setModuleThumbnail] = useState("");
  const [editRoleField, setEditRoleField] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [rolesLeft, setRolesLeft] = useState([]);
  const [permissionsLeft, setPermissionsLeft] = useState([]);
  const [addPermissionsField, setAddPermissionsField] = useState(false);
  const [user, setUser] = useState({});

  // ------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Hooks----------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const enteredUser = location?.state?.user || {};

  const [selectedRole, setSelectedRole] = useState(enteredUser?.role || "");

  const { isUserUpdated, isLoading } = useSelector((state) => state?.auth);

  // -------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------Functions-------------------------------------------------
  // editCourseHandler -- editCourseHandler in order to call the edit api
  const updateRolesAndPermissionsHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to Update the Roles and Permissions",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              const formData = new FormData();
              if (user?._id) {
                if (data?.role) {
                  let obj = JSON.stringify({
                    role: data?.role,
                    permissions: userPermissions,
                  });
                  formData.append("payload", obj);
                } else {
                  if (user?.role) {
                    let obj = JSON.stringify({
                      role: user?.role,
                      permissions: userPermissions,
                    });
                    formData.append("payload", obj);
                  } else {
                    return toast.error("No User Found");
                  }
                }
                dispatch(updateUser({ payload: formData, id: user?._id }));
              } else {
                return toast.error("No User Found");
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
      console.log(error.message);
      toast.error(error?.message);
    }
  };

  //   addingEditRoleField -- handler to add the edit role field to the page
  const addingEditRoleField = () => {
    try {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div
              className="custom-ui"
              style={{
                border: "2px solid grey",
                padding: "20px",
                borderRadius: "20px",
                background: "white",
              }}
            >
              <h3>Are you sure? You want to Change the Role</h3>
              <h6 style={{ color: "red" }}>
                Note! All the assigned permissions will be removed
              </h6>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditRoleField(true);
                  setUserPermissions([]);
                  setPermissionsLeft([]);
                  onClose();
                }}
              >
                Yes
              </button>
              <button className="btn btn-secondary mx-2" onClick={onClose}>
                No
              </button>
            </div>
          );
        },
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
    }
  };
  //   addingPermissionsField -- handler to add the add permissions field to the page
  const addingPermissionsField = () => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to Add the Permissions",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              setAddPermissionsField(true);
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
  //   selectPermissionHandler -- handler to add the  permission to the usersPermissions array
  const selectPermissionHandler = (e) => {
    try {
      if (e?.target?.value?.length > 0) {
        if (e?.target?.value === "selectAll") {
          if (selectedRole !== "") {
            if (selectedRole === "STUDENT") {
              setUserPermissions(availableStudentPermissions);
              setPermissionsLeft([]);
              resetField("selectPermissions");
            } else {
              setUserPermissions(availablePermissions);
              setPermissionsLeft([]);
              resetField("selectPermissions");
            }
          }
        } else {
          setUserPermissions([...userPermissions, e.target.value]);
          setIsFieldDataChanged(true);
          resetField("selectPermissions");
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
      reset();
    }
  };
  //   permissionRemoveHandler -- handler to remove the  permission from the permissions array
  const permissionRemoveHandler = (e, index) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are you sure! You want to Remove the Permission",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              let userPermissionsArr = [...userPermissions];
              let removedItem = userPermissionsArr.splice(index, 1);
              setUserPermissions(userPermissionsArr);
              setPermissionsLeft([...permissionsLeft, removedItem]);
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

  // -------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------useEffects-------------------------------------------------
  useEffect(() => {
    if (isUserUpdated) {
      dispatch(getUsers("/"));
      dispatch(resetUserState(false));
      navigate("/roles_permissions");
    }
  }, [isUserUpdated]);

  useEffect(() => {
    if (selectedRole !== "") {
      if (selectedRole === "STUDENT") {
        setPermissionsLeft(availableStudentPermissions);
      } else {
        setPermissionsLeft(availablePermissions);
      }
    }
  }, [selectedRole]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      Array.isArray(user?.permissions) &&
        user?.permissions?.length > 0 &&
        setUserPermissions(user?.permissions);

      //   optimized logic to set the left permissions in the leftPermissions array
      let obj = {};
      let rolesObj = {};
      let arr = [];
      let rolesArr = [];

      let permissionsAvailable =
        user?.role === "STUDENT"
          ? availableStudentPermissions
          : availablePermissions;

      for (let i = 0; i < permissionsAvailable.length; i++) {
        obj[permissionsAvailable[i]] = 1;
      }

      if (Array.isArray(user?.permissions) && user?.permissions.length > 0) {
        user?.permissions?.forEach((permission) => {
          obj[permission] && obj[permission]--;
        });
      }

      if (Object.keys(obj).length > 0) {
        for (let i in obj) {
          obj[i] > 0 && arr.push(i);
        }
        setPermissionsLeft(arr);
      }

      //   ----------------------------------------------------------------------------

      for (let i = 0; i < availableRoles.length; i++) {
        rolesObj[availableRoles[i]] = 1;
      }

      if (user?.role) {
        rolesObj[user?.role] && rolesObj[user?.role]--;
      }

      if (Object.keys(rolesObj).length > 0) {
        for (let i in rolesObj) {
          rolesObj[i] > 0 && rolesArr.push(i);
        }
        setRolesLeft(rolesArr);
      }
    }
  }, [user]);

  useEffect(() => {
    if (enteredUser && Object.keys(enteredUser).length > 0) {
      setUser(enteredUser);
    }
  }, []);

  useEffect(() => {
    if (isFieldDataChanged) {
      //   optimized logic to set the left permissions in the leftPermissions array
      let obj = {};
      let arr = [];

      for (let i = 0; i < permissionsLeft.length; i++) {
        obj[permissionsLeft[i]] = 1;
      }

      if (Array.isArray(userPermissions) && userPermissions.length > 0) {
        userPermissions?.forEach((permission) => {
          obj[permission] && obj[permission]--;
        });
      }

      if (Object.keys(obj).length > 0) {
        for (let i in obj) {
          obj[i] > 0 && arr.push(i);
        }
        setPermissionsLeft(arr);
      }
      setIsFieldDataChanged(false);
    }
  }, [userPermissions]);

  // --------------------------------------------------------------------------------------------------
  return isLoading ? (
    <div className={`${styles.spiner} ${styles.aftersubmitLoading}`}>
      <TailSpin
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  ) : (
    <>
      <Container>
        <Row>
          <Col className="">
            {/* <div className={`${styles.box_shadow}`}> */}
            <form onSubmit={handleSubmit(updateRolesAndPermissionsHandler)}>
              <h1 style={{ color: "var(--table-font-color)" }}>
                Edit Roles And Permissions{" "}
              </h1>
              <div>
                <h1 className={styles.title}>Username</h1>
              </div>

              <div>
                <input
                  defaultValue={user?.userName || ""}
                  // value={moduleName}
                  className={`${styles.moduleName}`}
                  type="text"
                  id="courseName"
                  placeholder={user?.userName || ""}
                  disabled={true}
                />
              </div>
              <div>
                <h1 className={styles.title}>Currently Assigned Role</h1>
              </div>

              <div>
                <input
                  defaultValue={user?.role || ""}
                  // value={moduleName}
                  className={`${styles.currentlyAssignedRole}`}
                  type="text"
                  id="courseName"
                  placeholder={user?.role || ""}
                  disabled={true}
                />
                <button
                  type="button"
                  className={`${styles.submit} mx-2`}
                  style={{ cursor: "pointer" }}
                  onClick={addingEditRoleField}
                  disabled={editRoleField ? true : false}
                >
                  Edit
                </button>
              </div>
              {editRoleField && (
                <>
                  <div>
                    <h1 className={styles.title}>Select Role</h1>
                  </div>

                  <div>
                    <select
                      // value={moduleName}
                      className={`${styles.moduleName}`}
                      {...register("role", {
                        required: {
                          value: true,
                          message: "Role is required",
                        },
                        onChange: (e) => {
                          setSelectedRole(e.target.value);
                          setUserPermissions([]);
                        },
                      })}
                      type="text"
                      id="role"
                      placeholder="Module Name"
                    >
                      <option value="">Select Role</option>
                      {Array.isArray(rolesLeft) &&
                        rolesLeft.length > 0 &&
                        rolesLeft.map((role) => {
                          return <option value={role}>{role}</option>;
                        })}
                    </select>
                    {errors.role && (
                      <div className="text-danger pt-1">
                        {errors.role.message || "Role is required"}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div>
                <h1 className={styles.title}>Currently Assigned Permissions</h1>
              </div>
              <div className="d-flex">
                <div
                  className={`${styles.currentlyAssignedPermissionsDiv} pt-4 d-flex flex-wrap gap-2`}
                  type="text"
                  id="currentlyAssignedPermissions"
                >
                  {Array.isArray(userPermissions) &&
                    userPermissions?.length > 0 &&
                    userPermissions.map((permission, index) => {
                      return (
                        <div
                          className={`${styles.permissioncontainer} permissionCard d-flex position-relative`}
                          style={{ fontSize: "15px" }}
                        >
                          <div className={`${styles.permission} permissionTag col-md-9 d-flex align-items-center`}>
                            {permission}
                          </div>
                          <div
                            className="tag col-md-3 d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => permissionRemoveHandler(e, index)}
                          >
                            <FaTimes className={`${styles.deleteSvg}`}/>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                    onClick={addingPermissionsField}
                    disabled={addPermissionsField ? true : false}
                  >
                    Add
                  </button>
                </div>
                {/* <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                  >
                    Update Roles and Permissions
                  </button>
                </div> */}
              </div>
              {addPermissionsField && (
                <>
                  <div>
                    <h1 className={styles.title}>Add Permission</h1>
                  </div>

                  <div>
                    <select
                      className={`${styles.moduleName}`}
                      {...register("selectPermissions", {
                        onChange: (e) => {
                          selectPermissionHandler(e);
                        },
                      })}
                      type="text"
                      id="role"
                      placeholder="Module Name"
                    >
                      <option value="">Select to add Permission</option>
                      <option
                        value="selectAll"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        Select All
                      </option>
                      {Array.isArray(permissionsLeft) &&
                        permissionsLeft?.length > 0 &&
                        permissionsLeft.map((permission) => {
                          return (
                            <option value={permission}>{permission}</option>
                          );
                        })}
                    </select>
                    {errors.courseName && (
                      <div className="text-danger pt-1">
                        {errors.courseName.message || "Module Name is required"}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className={styles.nextPrevButtonDiv}>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className={`${styles.submit} mx-2`}
                    style={{ cursor: "pointer" }}
                  >
                    Update Roles and Permissions
                  </button>
                </div>
              </div>
              {/* </div> */}
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RolesAndPermissionsEdit;





