// ----------------------------------------------Imports-----------------------------------------------------
import express from "express";
import {
  addPdfQuiz,
  deletePdfQuiz,
  getAllPdfQuizzes,
  updatePdfQuiz,
} from "../../controllers/PdfQuiz/pdfQuiz.js";
import { validateMimeType } from "../../utils/MulterConfigsVideo/uploadVideo.js";
import { mediaUpload } from "../../middlewares/mediaUpload.js";
import { generateStudyMaterialResult } from "../../controllers/PdfQuiz/pdfQuizResultController.js";
import { userIdAttachment } from "../../middlewares/userIdAttachment/userIdAttachment.js";

// ----------------------------------------------------------------------------------------------------------

const pdfQuizzes = express.Router();
//user verification  is needed here  with a middleware

pdfQuizzes.route("/addPdfQuiz").post(mediaUpload("pdfFile"), addPdfQuiz);
//get all quizzes
pdfQuizzes.route("/getPdfQuizzes").get(getAllPdfQuizzes);

//update individul quiz

pdfQuizzes.route("/updatePdfQuiz/:id").patch(mediaUpload("pdfFile"), updatePdfQuiz);



//delete individul quiz
pdfQuizzes.route("/deletePdfQuiz/:id").delete(deletePdfQuiz);


//For results
pdfQuizzes
  .route("/generateStudyMaterialResult")
  .post(userIdAttachment, generateStudyMaterialResult);


// pdfQuizzes.route("/getQuiz/:id").get(getQuiz);
// pdfQuizzes.route("/updateQuiz/:id").patch(updateQuiz);
// pdfQuizzes.route("/deleteQuiz/:id").delete(deleteQuiz);
// pdfQuizzes.route("/searchQuizzes").get(searchQuiz);

export { pdfQuizzes };
