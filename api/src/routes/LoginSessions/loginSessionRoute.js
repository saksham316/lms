// -----------------------------------------------Imports-----------------------------------------------
import { Router } from "express";
import { getLoggedInUsersInfo } from "../../controllers/LoginSession/loginSession.js";
// -----------------------------------------------------------------------------------------------------

const loginSessions = Router();
loginSessions.route("/getLoggedInUsersInfo").get(getLoggedInUsersInfo);
export { loginSessions };
