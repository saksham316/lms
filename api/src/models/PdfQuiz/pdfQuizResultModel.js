// ----------------------------------------------Imports-------------------------------------------------------


import mongoose from "mongoose";
import { Schema } from "mongoose";
// ------------------------------------------------------------------------------------------------------------

const pdfQuizResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "User ID is a required field"],
  },
  pdfQuizId: {
    type: Schema.Types.ObjectId,
    ref: "studyMaterial",
  },
  pdfName: String,
  totalScore: {
    type: Number,
  },
  attempted: Number,
  unattempted: Number,
  individualQuestionScore: [
    {
      questionData: {
        question: String,
        options: [
          {
            option: String,
            isCorrect: Boolean,
          },
        ],
      },
      score: {
        type: Number,
        default: 0, // Set a default value or modify as needed
      },
      skipped: {
        type: Boolean,
        default: false, // Set a default value or modify as needed
      },
      // Reference to the Quiz
    },
  ],
  // totalQuestions: {
  //   type: Number,
  // },

  maximumMarks: {
    type: Number,
  },
});
const pdfQuizResultModel = mongoose.model(
  "pdfQuizResult",
  pdfQuizResultSchema,
  "pdfQuizResult"
);
export { pdfQuizResultModel };
