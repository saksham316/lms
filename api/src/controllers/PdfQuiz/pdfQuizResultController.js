import chalk from "chalk";
//
import CryptoJS from "crypto-js";
// import { pdfQuizResultModel } from "../../models/PdfQuiz/pdfQuizResultModel.js";
import { pdfQuizModel } from "../../models/PdfQuiz/pdfQuiz.js";
import { pdfQuizResultModel } from "../../models/PdfQuiz/pdfQuizResultModel.js";
export const generateStudyMaterialResult = async (req, res) => {
  try {
    const { userId } = req;
    // payload is {PdfId,quizzs:[{questionId,answerId}]   }
    const payload = req?.body;

    const { pdfId } = payload;
    //Here comes the delete functionality if such a user with same df id exists.

    //Ends here
    // const quizId = req?.body?.quizId;
    //Result calculation comes here
    let scoreCard = [];
    let totalScore = 0;
    let totalQuestions = 0;
    let totalUnAttemptedQuestions = 0;

    //Getting the data from the backend
    const pdfQuizzes = await pdfQuizModel.find({ _id: pdfId });
    // console.log("Dta base quizzes", pdfQuizzes);
    payload?.quizzes?.forEach((quizzes, index) => {
      // if(quizzes)
      let resultEntries = {
        questionData: quizzes,
        score: 0,

        // chapterId: el?.chapterId || "NA",
      };
      let flag = true;
      pdfQuizzes?.forEach((databaseQuizzes, index2) => {
        //
        totalQuestions = databaseQuizzes?.quizzes?.length;
        databaseQuizzes?.quizzes?.forEach((options, index3) => {
          // console.log("THis is options", options);
          let skipped = 0;

          options?.options?.forEach((answers) => {
            if (
              answers._id == quizzes?.selectedAnswer?.selectedAnswerId &&
              answers?.isCorrect == true
            ) {
              resultEntries.score += 1;
              totalScore += 1;
            } else if (quizzes?.selectedAnswer?.selectedAnswer == "" && flag) {
              flag = false;
              skipped += 1;
              resultEntries.skipped = true;
            }
          });
          totalUnAttemptedQuestions += skipped;
        });
      });

      scoreCard.push(resultEntries);
    });
    const finalPayload = {
      userId,
      pdfQuizId: pdfId,
      pdfName: pdfQuizzes[0]?.pdfName,
      totalScore,
      attempted: totalQuestions - totalUnAttemptedQuestions,
      unattempted: totalUnAttemptedQuestions,
      individualQuestionScore: scoreCard,
      maximumMarks: totalQuestions,
    };
    // console.log(pdfQuizzes);
    const data = new pdfQuizResultModel(finalPayload);
    await data.save();
    // console.log("Total score", totalScore);
    let decipheredData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.CRYPTO_SECRET_KEY
    ).toString();

    return res.status(200).json({
      success: true,
      data: decipheredData,
      message: "Added user details successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};
export const getResults = async (req, res) => {
  try {
    const data = await resultModel
      .find()
      .populate("chapterQuizScore.chapterId")
      .populate("scoreCard.quiz");
    return res.status(200).json({
      success: true,
      data,
      message: "Data found successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || message,
    });
  }
};
