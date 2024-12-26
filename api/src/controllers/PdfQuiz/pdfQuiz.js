import chalk from "chalk";
// import chapterModel from "../../models/Chapter/chapterModel.js";
// import courseModel from "../../models/Course/courseModel.js";
import { pdfQuizModel } from "../../models/PdfQuiz/pdfQuiz.js";
import { pdfQuizzes } from "../../routes/PdfQuiz/pdfQuiz.js";
import { urlProvider } from "../../configs/GoogleCloudConsoleProvider/cloudGeneratedUrl.js";
import CryptoJS from 'crypto-js';

export const addPdfQuiz = async (req, res) => {
          try {
                    const bucketName = "gravita-oasis-lms";
                    const { pdfName, pdfDescription, quizzes } =
                              JSON.parse(req?.body?.payload);
                    const originalPdfName = `${Math.ceil(Math.random() * 1000000000)}${req?.file?.originalname}`;

                    const pdfFile = await urlProvider(req?.file?.buffer, originalPdfName)

                    if (pdfFile?.error === 0) {
                              return res.status(400).json({
                                        success: false,
                                        message: "Please try again!!",
                              });
                    }
                    const pdfQuizObj = {
                              pdfName,
                              pdfDescription,
                              // providerDetails,
                              quizzes,
                              mediaFile: pdfFile?.pubilcUrl ?? `https://storage.googleapis.com/${bucketName}/${originalPdfName}`,

                    };
                    // console.log("This is course obj", req?.body);
                    const doc = new pdfQuizModel(pdfQuizObj);

                    await doc.save();

                    // 


                    let deciphered = CryptoJS.AES.encrypt(JSON.stringify(doc), process.env.CRYPTO_SECRET_KEY).toString();

                    return res.status(200).json({
                              success: true,
                              data: deciphered,
                              message: "Added the course successfuly"
                    })
          } catch (error) {
                    return res.status(400).json({
                              success: false,
                              message: error?.message || error,
                    });
          }
}

export const getAllPdfQuizzes = async (req, res) => {
          try {
                    const data = await pdfQuizModel.find().select({'quizzes.options.isCorrect':0});
                    let deciphered = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET_KEY).toString();
                    //  console.log("Encrypted data = " + cip);
                    return res.status(200).json({
                              success: true,
                              data: deciphered,
                              message: "Pdf Quizzes found successfully",
                    });
          } catch (error) {
                    return res.status(400).json({
                              success: false,
                              message: error?.message || error,
                    });
          }
};

//For deleting the pdfQuizz
export const deletePdfQuiz = async (req, res) => {
          try {
                    const { id } = req?.params
                    const data = await pdfQuizModel.findByIdAndDelete(id);
                    return res.status(201).json({
                              success: true,
                              data,
                              message: "Document deleted successfully",
                    });
          } catch (error) {
                    return res.status(400).json({
                              success: false,
                              message: error?.message || error,
                    });
          }
};

//For updating the pdfQuizz
export const updatePdfQuiz = async (req, res) => {
          try {
                    const { id } = req?.params
                    // console.log("Hello",id)
                    const payload = JSON.parse(req?.body?.payload)
                    if (req?.file) {
                              const bucketName = "gravita-oasis-lms";
                              const originalPdfName = `${Math.ceil(Math.random() * 1000000000)}${req?.file?.originalname}`;
                              // console.log("This is thumbnail name", originalThumbnailName);
                              // console.log("This is buffer", req?.file)
                              const pdfFile = await urlProvider(req?.file?.buffer, originalPdfName)
                              if (pdfFile?.error === 0) {
                                        return res.status(400).json({
                                                  success: false,
                                                  message: "Please try again!!",
                                        });
                              }
                              payload.mediaFile = pdfFile?.pubilcUrl ?? `https://storage.googleapis.com/${bucketName}/${originalPdfName}`
                    }
                    const doc = await pdfQuizModel.findByIdAndUpdate(
                              id,
                              { $set: payload },
                              { new: true }
                    );
                    // console.log("This is payload", payload)

                    return res.status(200).json({
                              success: true,
                              message: "Document Updated Successfully",

                    });
          } catch (error) {
                    console.log("Error")
                    return res.status(500).json({
                              success: false,
                              message: `Internal Server Error ! ${error.message}`,
                    });
          }
}

