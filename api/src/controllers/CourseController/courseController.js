// -------------------------------------------------Imports---------------------------------------------------
import chalk from "chalk";
import fs from "fs";
import chapterModel from "../../models/Chapter/chapterModel.js";
import courseModel from "../../models/Course/courseModel.js";
import { videoModel } from "../../models/Video/videoModel.js";
import categoryModel from "../../models/Category/categoryModel.js";
import UserModel from "../../models/Authentication/userAuthModel.js";
import { urlProvider } from "../../configs/GoogleCloudConsoleProvider/cloudGeneratedUrl.js";
import CryptoJS from "crypto-js";
// -----------------------------------------------------------------------------------------------------------

// @desc - Course Creation
// @route - POST /course/addCourse
// @access - private
// @payload - JSON raw body no Form data
export const addCourse = async (req, res) => {
  try {
    const bucketName = "gravita-oasis-lms";
    console.log(
      chalk.bgRed(
        `Caution! In the request, 'providerDetails' is added as a key.`
      )
    );
    // const { providerDetails } = req
    if (req?.role === "STUDENT") {
      return res.status(400).json({
        success: false,
        message: `Unauthorized route`,
      });
    }
    // console.log(chalk.redBright(req?.role));
    // console.log(req?.providerDetails);
    // return res.status(500).json({
    //   success: false,
    //   message: `Internal Server Error!`,
    // });
    const { courseName, courseDescription, providerDetails, courseCategory } =
      JSON.parse(req?.body?.payload);
    const originalThumbnailName = `${Math.ceil(Math.random() * 1000000000)}${
      req?.file?.originalname
    }`;
    // console.log("This is thumbnail name", originalThumbnailName);
    // console.log("This is buffer", req?.file)
    const courseThumbnail = await urlProvider(
      req?.file?.buffer,
      originalThumbnailName
    );
    // console.log("This is course Thumnil", courseThumbnail)
    if (courseThumbnail?.error === 0) {
      return res.status(400).json({
        success: false,
        message: "Please try again!!",
      });
    }
    const courseObj = {
      courseName,
      courseDescription,
      providerDetails,
      courseThumbnail:
        courseThumbnail?.pubilcUrl ??
        `https://storage.googleapis.com/${bucketName}/${originalThumbnailName}`,
      courseCategory,
      providerDetails: req?.providerDetails,
    };
    // console.log("This is course obj", req?.body);
    const doc = new courseModel(courseObj);

    await doc.save();

    //Adding reference in user schema of this course
    const updateUserEnrollments = await UserModel.findByIdAndUpdate(
      { _id: req?.providerDetails },
      { $push: { creations: doc?._id } },
      { new: true }
    );

    //
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(doc),
      process.env.CRYPTO_SECRET_KEY
    ).toString();

    return res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      data: deciphered,
    });
  } catch (error) {
    console.log(chalk.bgRedBright("Error in add course"));
    console.log(error?.message);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};

// @desc - Course Fetching
// @route - GET /course/fetchCourse
// @access - public  + User

export const fetchAllCourse = async (req, res) => {
  try {
    if (req?.role == "STUDENT") {
      return res.status(500).json({
        success: false,
        message: "Unauthorized attempt!!!!",
      });
    }
    const { providerDetails } = req;
    const page = req?.query?.page - 1 || 0;
    const limit = req?.query?.limit || Infinity;
    const totalPages =
      req?.role === "SUPER_ADMIN" || req?.role === "ADMIN"
        ? await courseModel.find()
        : await courseModel.find({ providerDetails });
    const doc = await courseModel
      .find(
        req?.role === "SUPER_ADMIN" || req?.role === "ADMIN"
          ? {}
          : { providerDetails }
      )
      .populate({
        path: "courseChapters",
        model: chapterModel,
        populate: [
          {
            path: "chapterVideos",
            model: "videos",
          },
          {
            path: "chapterQuizzes",
            model: "quiz",
          },
        ],
      })

      .limit(limit)
      .skip(page * limit);
    const pipeline = [
      {
        $match: req?.role === "SUPER_ADMIN" || req?.role === "ADMIN" ? {} : { providerDetails },
      },
      {
        $project: {
          courseName: 1,
          _id: 0,
        },
      },
    ];
    const courseNames = await courseModel.aggregate(pipeline);

    if (!doc) {
      return res.status(200).json({
        success: false,
        message: `No Data Found`,
      });
    }

    let totalCourseVideos = 0;
    let newDoc = [];

    if (doc && doc?.length > 0) {
      for (let i = 0; i < doc.length; i++) {
        if (doc[i].courseChapters?.length > 0) {
          for (let j = 0; j < doc[i].courseChapters?.length; j++) {
            if (doc[i].courseChapters[j].chapterVideos.length > 0) {
              totalCourseVideos +=
                doc[i].courseChapters[j].chapterVideos.length;
            }
          }
        }
        newDoc.push({ ...doc?.[i]._doc, totalCourseVideos });
        totalCourseVideos = 0;
      }
    }

    // console.log("this is new doc", totalPages.length);
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(newDoc),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredCourseNames = CryptoJS.AES.encrypt(
      JSON.stringify(courseNames),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredPages = CryptoJS.AES.encrypt(
      JSON.stringify(page + 1),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredTotalPages = CryptoJS.AES.encrypt(
      JSON.stringify(Math.ceil(totalPages?.length / limit)),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    // console.log("THis is deciphered pages", decipheredPages)
    // let decipheredCourseNames = CryptoJS.AES.encrypt(JSON.stringify(courseNames), process.env.CRYPTO_SECRET_KEY).toString();
    return res.status(200).json({
      success: true,
      message: "Data Found Successfully",
      data: deciphered,
      courseNames: decipheredCourseNames,
      page: decipheredPages,
      totalPages: decipheredTotalPages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};

// @desc - Course Fetching
// @route - GET /course/fetchIndividualCourses
// @access - Teacher
export const fetchUserCourses = async (req, res) => {
  try {
    // console.log(chalk.bgBlueBright("Starting"))
    const assignedCategories = req?.assignedCategories; //Attached by middlewares
    //universal variables to send as api responses as per the if else conditions.

    let categories = [];

    const arrayOfIds = [];

    let data = [];

    let query = req?.query?.searchCourses
      ? req?.query?.searchCourses.toLowerCase().trim().replaceAll(" ", "")
      : false;

    // console.log(chalk.bgRed("Entered"));
    // console.log(req?.query?.id === undefined);

    if (query) {
      data = await courseModel
        .find({
          $or: [
            {
              courseName: new RegExp(query, "i"),
              _id: { $in: assignedCategories },
            },
            {
              courseDescription: new RegExp(query, "i"),
              _id: { $in: assignedCategories },
            },
          ],
        })
        .populate("courseCategory")
        .populate("providerDetails", { fullName: 1 })
        .populate({
          path: "courseChapters",
          model: chapterModel,
          populate: [
            {
              path: "chapterVideos",
              model: "videos",
            },
            {
              path: "chapterQuizzes",
              model: "quiz",
            },
          ],
        });
      // console.log("Data inside if", data)
      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < data[i]?.courseCategory?.length; j++) {
          if (!arrayOfIds.includes(data[i]?.courseCategory[j]?._id)) {
            arrayOfIds.push(data[i]?.courseCategory[j]?._id);
            categories.push(data[i]?.courseCategory[j]);
          }
        }
      }
    } else if (req?.query?.id === undefined) {
      // console.log(chalk.bgRed("Entered if block"));
      data = await courseModel
        .find({
          _id: { $in: assignedCategories },
        })
        .populate("courseCategory")
        .populate("providerDetails", { fullName: 1 })
        .populate({
          path: "courseChapters",
          model: chapterModel,
          populate: [
            {
              path: "chapterVideos",
              model: "videos",
            },
            {
              path: "chapterQuizzes",
              model: "quiz",
            },
          ],
        });
      // console.log("Data inside if", data)
      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < data[i]?.courseCategory?.length; j++) {
          if (!arrayOfIds.includes(data[i]?.courseCategory[j]?._id)) {
            arrayOfIds.push(data[i]?.courseCategory[j]?._id);
            categories.push(data[i]?.courseCategory[j]);
          }
        }
      }
    } else {
      // console.log(chalk.bgRed("Entered else block"));

      data = await courseModel
        .find({
          _id: { $in: assignedCategories },
          courseCategory: req?.query?.id,
        })
        .populate("courseCategory")
        .populate("providerDetails")
        .populate({
          path: "courseChapters",
          model: chapterModel,
          populate: [
            {
              path: "chapterVideos",
              model: "videos",
            },
            {
              path: "chapterQuizzes",
              model: "quiz",
            },
          ],
        });
      // console.log("Data inside elif", data)
    }

    if (req?.query?.id) {
      const data2 = await courseModel
        .find({
          _id: { $in: assignedCategories },
        })
        .populate("courseCategory")
        .populate("providerDetails")
        .populate({
          path: "courseChapters",
          model: chapterModel,
          populate: [
            {
              path: "chapterVideos",
              model: "videos",
            },
            {
              path: "chapterQuizzes",
              model: "quiz",
            },
          ],
        });

      for (let i = 0; i < data2?.length; i++) {
        for (let j = 0; j < data2[i]?.courseCategory?.length; j++) {
          if (!arrayOfIds.includes(data2[i]?.courseCategory[j]?._id)) {
            arrayOfIds.push(data2[i]?.courseCategory[j]?._id);
            categories.push(data2[i]?.courseCategory[j]);
          }
        }
      }
    }
    // console.log(chalk.bgBlueBright("END!!!!"))
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredCategories = CryptoJS.AES.encrypt(
      JSON.stringify(categories),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      message: "Data Found Successfully",
      data: deciphered,
      categories: decipheredCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error ! ${error.message}`,
    });
  }
};

// @desc - Course Fetching
// @route - GET /course/fetchIndividualCourses
// @access - Teacher

export const fetchIndividualCourses = async (req, res) => {
  try {
    //jwt is needed here
    const id = req?.id;

    const limit = 10;
    const page = req?.query?.page - 1;
    const pipeline = [
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "courseChapters", // Replace with the actual collection name
          localField: "courseChapters",
          foreignField: "_id",
          as: "courseChapters",
        },
      },
      {
        $project: {
          _id: 1,
          courseChapters: 1,
        },
      },
      {
        $facet: {
          result: [
            {
              $skip: page * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ];

    const [result] = await courseModel.aggregate(pipeline);

    const doc = result.result;
    const totalPages = result.totalCount[0]
      ? Math.ceil(result.totalCount[0].total / limit)
      : 0;

    if (!doc) {
      return res.status(200).json({
        success: false,
        message: `No Data Found`,
      });
    }
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(doc),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredTotalPages = CryptoJS.AES.encrypt(
      JSON.stringify(totalPages),
      process.env.CRYPTO_SECRET_KEY
    ).toString();

    return res.status(200).json({
      success: true,
      message: "Data Found Successfully",
      data: deciphered,
      totalPages: decipheredTotalPages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

// @desc - Course Updation
// @route - PATCH /course/updateCourse/:id
// @access - private

export const updateCourse = async (req, res) => {
  try {
    const { role, providerDetails } = req;
    if (role === "STUDENT") {
      return res.status(400).json({
        success: false,
        message: `Unauthorized route`,
      });
    }
    const { courseChapters } = JSON.parse(req?.body?.payload);
    const courseData = courseChapters;

    const { id } = req?.params; //course existing id
    // console.log("This is id", id);
    //This is to get the existing data so that we can take use of it.
    const existingData = await courseModel.findOne(
      req?.role === "SUPER_ADMIN" || req?.role === "ADMIN"
        ? { _id: id }
        : {
            _id: id,
            providerDetails,
          }
    );
    //error in this line

    let courseChapterIds =
      existingData === null ? [] : [...existingData?.courseChapters];
    // console.log("THis is payload", courseChapterIds);
    //This should come from front end
    for (let i = 0; i < courseData?.length || 0; i++) {
      courseChapterIds.push(courseData[i]?._id);
    }
    // console.log(
    //   "This is req body and reached inside",
    //   existingData,
    //   id,
    //   providerDetails
    // );
    // return res.status(500).json({
    //   success: false,
    //   message: `Internal Server Error! ${error.message}`,
    // });
    const parsedPayload = JSON.parse(req?.body?.payload);
    parsedPayload?.courseChapters &&
      (parsedPayload.courseChapters = courseChapterIds);
    // const newPaylod = {
    //   ...existingData?._doc,
    //   courseChapters: courseChapterIds,
    // };
    // console.log(parsedPayload);
    if (req?.file) {
      const thumbnailName = `${Math.ceil(Math.random() * 1000000000)}${
        req?.file?.originalname
      }`;
      const courseThumbnail = await urlProvider(
        req?.file?.buffer,
        thumbnailName
      );
      if (courseThumbnail?.error === 0) {
        return res.status(400).json({
          success: false,
          message: "Please try again!!",
        });
      }
      parsedPayload.courseThumbnail = courseThumbnail?.publicUrl;
    }
    const updateCourse = await courseModel.updateOne(
      { _id: id },
      { $set: parsedPayload },
      { new: true }
    );
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(updateCourse),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      data: deciphered,
      message: "Course has been updated successfully ",
    });
  } catch (error) {
    console.log(error.message);
    console.log("This is error", error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};
// @desc - Course Deletion
// @route - Delete /course/deleteCourse/:id
// @access - private
export const deleteCourse = async (req, res) => {
  try {
    // console.log("This is req body", req?.body);
    // const courseData = req?.body?.courseChapters;
    const { id } = req?.params; //course existing id
    console.log("This is id", id);
    await chapterModel.deleteMany({ courseId: id });
    await videoModel.deleteMany({ courseId: id });
    // Delete a video by its _id
    const courseDelete = await courseModel.findByIdAndDelete(id);
    console.log("This is deleted deatils", courseDelete);
    return res.status(200).json({
      success: true,
      message: `All the linked Courses and videos has been deleted`,
      data: courseDelete,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};
// @desc - Course Deletion
// @route - Delete /course/deleteCourse/:id
// @access - private
export const searchCourses = async (req, res) => {
  try {
    const toSearch = req?.query?.searchCourses; // course existing id
    console.log("This is to search content", toSearch);
    const page = req?.query?.page - 1 || 0;
    const limit = req?.query?.limit || 1;

    const searchResults = await courseModel
      .find({
        courseName: new RegExp(toSearch, "i"),
      })
      .limit(limit)
      .skip(limit * page);
    const data = await courseModel.find({
      courseName: new RegExp(toSearch, "i"),
    });
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(searchResults),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredTotalPages = CryptoJS.AES.encrypt(
      JSON.stringify(Math.ceil(data?.length / limit)),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      message:
        searchResults?.length > 0 ? "Data found successfully" : "No Data found",
      data: deciphered,
      totalPages: decipheredTotalPages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};

//To sweep out  all the unlinked courses.
export const sweepUnlinkedCourses = async (req, res) => {
  try {
    const sweeping = await courseModel.deleteMany({
      $expr: { $eq: [{ $size: "$courseChapters" }, 0] },
    });
    return res.status(200).json({
      success: true,
      message: "Successfully deleted unlinked courses",
      data: sweeping,
    });
  } catch (error) {
    console.log(chalk.bgCyanBright(`Inside sweeping function${error}`));
    return res.status(500).json({
      success: false,
      message: error?.message || error,
    });
  }
};
// export const fetchUserCourses = async (req, res) => {
//   try {
//     // console.log(req?.assignedCategories);
//     const assignedCategoryIds = req?.assignedCategories;
//     let doc = await categoryModel.find();
//     const doc2 = await courseModel
//       .find({
//         courseCategory: { $in: assignedCategoryIds },
//       })
//       .populate({
//         path: "courseChapters",
//         model: chapterModel,
//         populate: [
//           {
//             path: "chapterVideos",
//             model: "videos",
//           },
//           {
//             path: "chapterQuizzes",
//             model: "quiz",
//           },
//         ],
//       });
//     // console.log("This is array avove", doc);
//     let arr = [];
//     // let
//     for (let i = 0; i < doc.length; i++) {
//       let categoryName = doc[i]?.categoryName;
//       let _id = doc[i]?._id;
//       let categoryCourses = [];
//       for (let j = 0; j < doc2.length; j++) {
//         if (doc2[j]?.courseCategory?.includes(doc[i]?._id)) {
//           categoryCourses.push(doc2[j]);
//         }
//       }
//       // console.log("This is category names", categoryCourses);
//       const finalPayload = {
//         categoryName,
//         _id,
//         categoryCourses,
//       };
//       arr.push(finalPayload);
//     }
//     let output = [];
//     for (let checker = 0; checker < arr.length; checker++) {
//       if (arr[checker]?.categoryCourses.length !== 0) {
//         output.push(arr[checker]);
//       }
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Data Found Successfully",
//       categoryData: output,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error ! ${error.message}`,
//     });
//   }
// };
