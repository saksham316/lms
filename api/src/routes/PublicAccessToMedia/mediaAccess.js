// ----------------------------------------------Imports-----------------------------------------------------
import express from "express";
import { makePublic } from "../../controllers/PublicAccessController/makePublic.js";

// ----------------------------------------------------------------------------------------------------------

const publicAccessRouter = express.Router();
//user verification  is needed here  with a middleware
publicAccessRouter.route("/makePublic").get(makePublic);
//get all quizzes

export { publicAccessRouter };
