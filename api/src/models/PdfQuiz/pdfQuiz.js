// ----------------------------------------------Imports-------------------------------------------------------

import mongoose from "mongoose";
import { Schema } from "mongoose";
// ------------------------------------------------------------------------------------------------------------

const quizSchema = new Schema({
          pdfName: String,
          pdfDescription: String,
          mediaFile: String,
          quizzes: [{
                    question: String,
                    options: [
                              {
                                        option: String,
                                        isCorrect: Boolean,
                              },
                    ],
                    // correctAnswerId:Schema.Types.ObjectId
          }] 
});
const pdfQuizModel = mongoose.model("studyMaterial", quizSchema, "studyMaterial");
export { pdfQuizModel };
