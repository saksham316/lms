// ---------------------------------------------Imports---------------------------------------------------
import { useSelector } from "react-redux";
// -------------------------------------------------------------------------------------------------------
const useAuth = () => {
  const loggedInUserData  = useSelector(
    (state) => state?.auth?.loggedInUserData || {}
  );
  const isUserLoggedIn  = useSelector(
    (state) => state?.auth?.isUserLoggedIn || ""
  );


  return { isUserLoggedIn, loggedInUserData };
};

export default useAuth;
