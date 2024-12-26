// ----------------------------------------------Imports-----------------------------------------------------
import express from "express";
import { userMetaDataController } from "../../controllers/UserMetaData/userMetaData.js";

// ----------------------------------------------------------------------------------------------------------

const userMetaData = express.Router();
// courseCompletionRouter.use(checkLoginSessionStatus);
// userMetaData.route("/getAllData").get(videoCompletion);
userMetaData.route("/getAllStatus").get(userMetaDataController);
// quizRouter.route("/getQuiz/:id").post(getQuiz);

export { userMetaData };
