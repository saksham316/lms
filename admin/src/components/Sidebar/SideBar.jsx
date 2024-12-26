import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaBrain,
  FaFile,
  FaHome,
  FaRegFilePowerpoint,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import {
  MdSecurity,
  MdDarkMode,
  MdOutlineDarkMode,
  MdSignalCellular0Bar,
  MdSick,
  MdPinEnd,
} from "react-icons/md";
import { SiChatwoot } from "react-icons/si";
import { BiSolidVideos } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { IoCreateOutline } from "react-icons/io5";
import { TbListCheck } from "react-icons/tb";
import { CgPlayList } from "react-icons/cg";
// import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
// import { BsCartCheck } from "react-icons/bs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import useAuth from "../../hooks/useAuth";
import { doesUserHavePermissions, doesUserHaveRoleToAccess } from "../../utils";
import { FaCubesStacked } from "react-icons/fa6";

const SideBar = ({ children }) => {
  // -------------------------------------------------States------------------------------------------------

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  // -------------------------------------------------------------------------------------------------------
  // -------------------------------------------------Hooks------------------------------------------------
  const { loggedInUserData } = useAuth();
  // -------------------------------------------------------------------------------------------------------
  // -------------------------------------------------Functions---------------------------------------------
  // -------------------------------------------------------------------------------------------------------
  // -----------------------------------------------useEffects----------------------------------------------
  // -------------------------------------------------------------------------------------------------------

  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaHome />,
    },

    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      loggedInUserData?.role
    ) &&
    doesUserHavePermissions(
      [
        "CREATE_COURSE",
        "CREATE_CHAPTER",
        "VIEW_COURSE",
        "VIEW_CHAPTER",
        "EDIT_COURSE",
        "EDIT_CHAPTER",
        "DELETE_COURSE",
        "DELETE_CHAPTER",
        "EDIT_QUIZ",
        "VIEW_QUIZ",
        "DELETE_QUIZ",
      ],
      loggedInUserData
    )
      ? {
          name: "Course",
          icon: <BiSolidVideos />,
          subRoutes: [
            doesUserHavePermissions(
              ["CREATE_COURSE", "CREATE_CHAPTER"],
              loggedInUserData
            )
              ? {
                  path: "/course",
                  icon: <IoCreateOutline />,
                  name: "Create",
                }
              : {},
            doesUserHavePermissions(
              [
                "VIEW_COURSE",
                "VIEW_CHAPTER",
                "EDIT_COURSE",
                "EDIT_CHAPTER",
                "DELETE_COURSE",
                "DELETE_CHAPTER",
              ],
              loggedInUserData
            )
              ? {
                  path: "/courses_list",
                  icon: <TbListCheck />,
                  name: "Courses",
                }
              : {},
            doesUserHavePermissions(
              [
                "VIEW_COURSE",
                "VIEW_CHAPTER",
                "EDIT_COURSE",
                "EDIT_CHAPTER",
                "DELETE_COURSE",
                "DELETE_CHAPTER",
              ],
              loggedInUserData
            )
              ? {
                  path: "/chapters_list",
                  icon: <CgPlayList />,
                  name: "Chapters",
                }
              : {},
            doesUserHavePermissions(
              ["VIEW_QUIZ", "EDIT_QUIZ", "DELETE_QUIZ"],
              loggedInUserData
            )
              ? {
                  path: "/quizzes_list",
                  icon: <FaBrain />,
                  name: "Quizzes",
                }
              : {},
          ],
        }
      : {},
    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      loggedInUserData?.role
    ) &&
    doesUserHavePermissions(
      ["EDIT_CATEGORY", "DELETE_CATEGORY", "VIEW_CATEGORY"],
      loggedInUserData
    )
      ? {
          name: "Category",
          icon: <FaCubesStacked />,
          subRoutes: [
            doesUserHavePermissions(["CREATE_CATEGORY"], loggedInUserData)
              ? {
                  path: "/category",
                  icon: <IoCreateOutline />,
                  name: "Create",
                }
              : {},
            doesUserHavePermissions(
              ["VIEW_CATEGORY", "EDIT_CATEGORY", "DELETE_CATEGORY"],
              loggedInUserData
            )
              ? {
                  path: "/categories_list",
                  icon: <TbListCheck />,
                  name: "Categories",
                }
              : {},
          ],
        }
      : {},
    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      loggedInUserData?.role
    ) &&
    doesUserHavePermissions(
      ["EDIT_STUDY_MATERIAL", "DELETE_STUDY_MATERIAL", "VIEW_STUDY_MATERIAL"],
      loggedInUserData
    )
      ? {
          name: "Study Material",
          icon: <FaFile />,
          subRoutes: [
            doesUserHavePermissions(["CREATE_STUDY_MATERIAL"], loggedInUserData)
              ? {
                  path: "/study_material",
                  icon: <IoCreateOutline />,
                  name: "Create",
                }
              : {},
            doesUserHavePermissions(
              ["VIEW_STUDY_MATERIAL", "EDIT_STUDY_MATERIAL", "DELETE_STUDY_MATERIAL"],
              loggedInUserData
            )
              ? {
                  path: "/study_material_list",
                  icon: <TbListCheck />,
                  name: "Study Material List",
                }
              : {},
          ],
        }
      : {},
    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN"],
      loggedInUserData?.role
    ) &&
      doesUserHavePermissions(["VIEW_USERS"], loggedInUserData) && {
        path: "/users",
        name: "Users",
        icon: <FaUser />,
      },

    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN"],
      loggedInUserData?.role
    ) &&
      doesUserHavePermissions(
        [
          "VIEW_ROLES_&_PERMISSIONS",
          "EDIT_ROLES_&_PERMISSIONS",
          "DISABLE_USER",
        ],
        loggedInUserData
      ) && {
        path: "/roles_permissions",
        name: "Roles and Permissions",
        icon: <MdSecurity />,
      },
    doesUserHaveRoleToAccess(
      ["SUPER_ADMIN", "ADMIN"],
      loggedInUserData?.role
    ) &&
      doesUserHavePermissions(["SIGN_USER"], loggedInUserData) && {
        path: "/signup",
        name: "Sign Up a New User",
        icon: <MdPinEnd />,
      },
    {
      path: "/settings",
      name: "Settings",
      icon: <BiCog />,
      exact: true,
    },
  ];
  // --------------------------------------------------------------------------------------------------------

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <div className="bars" style={{ cursor: "pointer" }}>
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {routes.map((route, index) => {
              if (Object.keys(route).length === 0) {
                return;
              } else {
                if (route.subRoutes) {
                  return (
                    <SidebarMenu
                      setIsOpen={setIsOpen}
                      route={route}
                      showAnimation={showAnimation}
                      isOpen={isOpen}
                      key={index}
                    />
                  );
                }

                return (
                  <NavLink
                    to={route.path}
                    key={index}
                    className="link"
                    activeclassname="active"
                  >
                    <div className="icon">{route.icon}</div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              }
            })}
          </section>
        </motion.div>

        <main
          style={{
            width: "100%",
            backgroundColor: "var(--main-background-color)",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default SideBar;
