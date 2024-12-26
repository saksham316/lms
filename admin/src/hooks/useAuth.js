// ---------------------------------------------Imports---------------------------------------------------
import { useSelector } from "react-redux"
// -------------------------------------------------------------------------------------------------------
const useAuth = () => {
  const {
    loggedInUserData,isUserLoggedIn} = useSelector((state)=>state?.auth);

  return {isUserLoggedIn,loggedInUserData};
}

export default useAuth;