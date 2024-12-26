// availableRoles -- roles available in our application
export const availableRoles = ["ADMIN", "TEACHER", "STUDENT", "GUEST"];

// availablePermissions -- permissions available in our application
export const availablePermissions = [
  "SIGN_USER",
  "CREATE_COURSE",
  "VIEW_COURSE",
  "DELETE_COURSE",
  "EDIT_COURSE",
  "CREATE_CHAPTER",
  "VIEW_CHAPTER",
  "DELETE_CHAPTER",
  "EDIT_CHAPTER",
  "VIEW_ROLES_&_PERMISSIONS",
  "EDIT_ROLES_&_PERMISSIONS",
  "DISABLE_USER",
  "VIEW_USERS",
  "EDIT_USERS_CATEGORIES",
  "CREATE_CATEGORY",
  "VIEW_CATEGORY",
  "EDIT_CATEGORY",
  "DELETE_CATEGORY",
  "CREATE_QUIZ",
  "VIEW_QUIZ",
  "EDIT_QUIZ",
  "DELETE_QUIZ",
  "CREATE_STUDY_MATERIAL",
  "VIEW_STUDY_MATERIAL",
  "EDIT_STUDY_MATERIAL",
  "DELETE_STUDY_MATERIAL",
];
// availableStudentPermissions -- permissions available for the student in our application
export const availableStudentPermissions = ["VIEW_COURSE", "VIEW_CHAPTER"];

// doesUserHavePermissions -- function to check whether the user have required permissions for accessibility
export const doesUserHavePermissions = (allowedPermissions, user) => {
  let flag = false;
  if (user?.role === "SUPER_ADMIN") {
    flag = true;
  } else {
    user?.permissions?.forEach((permission) => {
      if (allowedPermissions.includes(permission)) {
        flag = true;
      }
    });
  }

  return flag;
};

// doesUserHaveRoleToAccess -- function to check the users role
export const doesUserHaveRoleToAccess = (allowedRoles, role) => {
  let userRole = role?.toString()?.toUpperCase();

  if (userRole === "SUPER_ADMIN") {
    return true;
  } else if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    return false;
  }
};
