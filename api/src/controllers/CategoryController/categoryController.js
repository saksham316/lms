// ---------------------------------------------Imports-------------------------------------------------
import chalk from "chalk";
import categoryModel from "../../models/Category/categoryModel.js";
import chapterModel from "../../models/Chapter/chapterModel.js";
import courseModel from "../../models/Course/courseModel.js";
import { quizModel } from "../../models/Quiz/quiz.js";
import { videoModel } from "../../models/Video/videoModel.js";
import { categoryValidation } from "../../utils/Validations/Category/categoryValidation.js";
import UserModel from "../../models/Authentication/userAuthModel.js";
import CryptoJS from "crypto-js"
// -----------------------------------------------------------------------------------------------------

// @desc - Create Category
// @route - post /category
// @access - private
export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req?.body;

    const validationResult = categoryValidation({
      categoryName,
    });

    const categoriesDoc = await categoryModel.find();

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.details[0].message,
      });
    }

    if (categoriesDoc.length > 0) {
      for (let i = 0; i < categoriesDoc.length; i++) {
        if (
          categoriesDoc[i]?.categoryName
            ?.trim()
            ?.toLowerCase()
            ?.replaceAll(" ", "") ==
          categoryName?.trim()?.toLowerCase()?.replaceAll(" ", "")
        ) {
          return res.status(400).json({
            success: false,
            message: "Category Name must be unique",
          });
        }
      }
    }

    const doc = new categoryModel({ categoryName });

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error ! ${error.message}`,
    });
  }
};

// @desc - Fetch Categories
// @route - GET /category
// @access - private
export const fetchCategories = async (req, res) => {
  try {
    let doc = await categoryModel.find();
    const doc2 = await courseModel.find();
    // console.log("This is array avove", doc);
    let arr = [];
    // let
    for (let i = 0; i < doc.length; i++) {
      let categoryName = doc[i]?.categoryName;
      let _id = doc[i]?._id;
      let categoryCourses = [];
      for (let j = 0; j < doc2.length; j++) {
        let payload = {};
        if (doc2[j]?.courseCategory?.includes(doc[i]?._id)) {
          // console.log("INside ")
          payload.courseName = doc2[j]?.courseName;
          payload.courseId = doc2[j]?._id;
          categoryCourses.push(payload);
          // break;
        }
      }
      // console.log("This is category names", categoryCourses);
      const finalPayload = {
        categoryName,
        _id,
        categoryCourses,
      };
      arr.push(finalPayload);
    }
    // let arr = [...doc];
    // console.log("This is array", arr);
    // const userCourses = await courseModel.find({
    //   courseCategory: { $in: arr },
    // });
    // console.log("This is courses", userCourses);
    let decipheredData = CryptoJS.AES.encrypt(JSON.stringify(arr), process.env.CRYPTO_SECRET_KEY).toString();
    return res.status(200).json({
      success: true,
      message: "Data Found Successfully",
      categoryData: decipheredData,
      // categoryNames,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error ! ${error.message}`,
    });
  }
};

// @desc - Delete Category
// @route - DELETE /category/:id
// @access - private
export const deleteCategory = async (req, res) => {
  try {
    let { id } = req?.params;
    const { userId } = req
    const doc = await categoryModel.findByIdAndDelete({ _id: id });
    //     // Deleting all the data associated with the categoryId
    //     // 1 : --> Deleting all the associated courses 
    // console.log("This is doc",doc)
    // if (doc?.length == 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "No Such Document Exists",
    //   });
    // }
    // id = "6583d63e696b7144f30cf305"
    const linkedCoursesData = await courseModel.find({ courseCategory: id }).select('_id').lean()
    const linkedCoursesDeletion = await courseModel.deleteMany({ courseCategory: id })
    //Delted the linked course successfully
    // console.log("This is linked courses data", linkedCoursesData,linkedCoursesDeletion)

    console.log(chalk.bgBlueBright("Deleted the course successfully"))
    //Delete the chapters
    const linkedChaptersData = await chapterModel.find({
      courseId: { $in: linkedCoursesData },
    }).select('_id').lean()
    const linkedChaptersDeletion = await chapterModel.deleteMany({
      courseId: { $in: linkedCoursesData },
    })
    // console.log("This is linkedchaptersdata", linkedChaptersData,linkedChaptersDeletion)
    //Chapters deleted successfully
    console.log(chalk.bgBlueBright("Deleted the chapters successfully"))

    //videos deletion


    // const linkedVideosData = await videoModel.find({
    //   chapterId: { $in: linkedChaptersData?._id },
    // }).select('_id')
    const linkedVideosDeletion = await videoModel.deleteMany({
      chapterId: { $in: linkedChaptersData },
    })
    // const userCourses = await courseModel.find({
    //   courseCategory: { $in: arr },
    // });


    //videos deleted successfully

    console.log(chalk.bgBlueBright("Deleted the videos successfully"))

    //Deleting quizzes
    const linkedQuizzesDeletion = await quizModel.deleteMany({
      chapterId: { $in: linkedChaptersData?._id },
    })

    //Quiz delete successfully
    console.log(chalk.bgBlueBright("Deleted the quizzes successfully"))
    //Removing ids from users affiliations

    // await UserModel.findByIdAndUpdate({ _id: userId }, {
    //   '$pull': {
    //     assignedCategories: { '$in': [id] }
    //   }
    // })
    // //
    // console.log(chalk.bgBlueBright("Removed the id from user's document"))
    //


    return res.status(200).json({
      success: true,
      message: "Document and all the linked entities were deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error ! ${error.message}`,
    });
  }
};

// @desc - Update Category
// @route - PATCH /category/:id
// @access - private
export const updateCategory = async (req, res) => {
  try {
    const { id } = req?.params;
    const { categoryName } = req?.body;

    if (!id || !categoryName) {
      return res?.status(400).json({
        success: false,
        message: "Incomplete Data Provided",
      });
    }

    const categoriesDoc = await categoryModel.find();

    if (categoriesDoc.length > 0) {
      for (let i = 0; i < categoriesDoc.length; i++) {
        if (
          categoriesDoc[i]?.categoryName
            ?.trim()
            ?.toLowerCase()
            ?.replaceAll(" ", "") ==
          categoryName?.trim()?.toLowerCase()?.replaceAll(" ", "")
        ) {
          return res.status(400).json({
            success: false,
            message: "Category Name must be unique",
          });
        }
      }
    }

    const doc = await categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: { categoryName } },
      { new: true }
    );

    if (!doc) {
      return res.status(400).json({
        success: false,
        message: "No Such Document Exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error ! ${error.message}`,
    });
  }
};

// @desc - Create Category
// @route - post /category
// @access - private
// export const createCategory = async (req, res) => {
//   try {
// const {providerDetails} = req
//     const categoriesDoc = await categoryModel.find({ providerDetails})


//     return res.status(200).json({
//       success: true,
//       message: "Category Fetched Successfully",
// data: categoriesDoc
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error ! ${error.message}`,
//     });
//   }
// };
