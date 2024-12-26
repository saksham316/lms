import { assign } from "nodemailer/lib/shared/index.js";
import UserModel from "../../models/Authentication/userAuthModel.js";
import chapterModel from "../../models/Chapter/chapterModel.js";
import courseModel from "../../models/Course/courseModel.js";
import { resultModel } from "../../models/Quiz/resultModel.js";
import chapterCompletionModel from "../../models/Authorization and userData/chapterCompletionModel.js";
import Joi from "joi";
import { loginSessionsModel } from "../../models/UserLoginSessions/userLoginSessionsModel.js";
import CryptoJS from "crypto-js";
export const userMetaDataController = async (req, res) => {
  try {
    const activeUsers = await loginSessionsModel.find();
    const toSearch = req?.query?.toSearch || "";
    // console.log("THis i s called", toSearch);
    let data = await UserModel.find({
      role: "STUDENT",
      fullName: {
        $regex: toSearch ? new RegExp(toSearch) : "", // Use an empty string if toSearch is falsy
        $options: "i", // Optional: case-insensitive search
      },
    })
      .populate("assignedStudyMaterial")
      .populate({
        path: "assignedCategories",
        model: courseModel,
        populate: [
          {
            path: "courseChapters",
            model: chapterModel,
            select: "-role -permissions -password -enrollments",
          },
        ],
      })
      .populate({
        path: "creations",
        model: courseModel,
        populate: [
          {
            path: "providerDetails",
            model: UserModel,
            select: "-role -permissions -password -enrollments",
          },
        ],
      });
    let newData = JSON.parse(JSON.stringify(data));
    const results = await resultModel.find();
    const completionRates = await chapterCompletionModel.find();
    let count = 0;

    for (let i = 0; i < newData?.length; i++) {
      let assignedCategories = newData[i]?.assignedCategories;
      for (let j = 0; j < assignedCategories?.length; j++) {
        let courseChapters = assignedCategories[j]?.courseChapters;
        // console.log(courseChapters);
        const newObj2 = {
          completion: 0,
        };

        for (let x = 0; x < courseChapters?.length; x++) {
          let video = 0;
          let chapterId = courseChapters[x]?._id?.toString();
          // console.log(chapterId)
          for (let y = 0; y < completionRates?.length; y++) {
            if (
              completionRates[y]?.userId?.toString() ==
              newData[i]?._id?.toString()
            ) {
              // console.log("Yes",)
              if (completionRates[y]?.chapterId?.toString() == chapterId) {
                newObj2.completion =
                  completionRates[y]?.chapterCompletionStatus;
              }
            }
          }
          // console.log(newObj2);
          courseChapters[x].videoStatus = newObj2;
        }
        for (let k = 0; k < courseChapters?.length; k++) {
          let chapterQuizzes = courseChapters[k]?.chapterQuizzes;
          for (let l = 0; l < chapterQuizzes?.length; l++) {
            let totalMarks = 0;
            const newObj = {
              _id: chapterQuizzes[l],
            };
            for (let x = 0; x < results.length; x++) {
              if (
                results[x]?.userId?.toString() == newData[i]?._id?.toString()
              ) {
                if (
                  results[x]?.chapterId?.toString() ==
                  courseChapters[k]?._id?.toString()
                ) {
                  count++;
                  newObj["score"] = results[x]?.chapterQuizScore[0]?.score;
                  totalMarks += results[x]?.chapterQuizScore[0]?.score;
                  // chapterScore += results[x]?.chapterQuizScore[0]?.score;
                  // console.log("User id is", results[x]?.userId?.toString());
                  // console.log(
                  //   "Course id is id is",
                  //   courseChapters[k]?._id?.toString()
                  // );
                  // console.log(
                  //   "Quiz id is id is",
                  //   chapterQuizzes[l].toString()
                  // );
                }
              }
            }
            // let videos = 0;
            // let completion = 0;
            // console.log("this is new object",courseChapters[k]?._id,newObj)

            chapterQuizzes[l] = newObj;
            // courseChapters[k]["score"] = "ABCD"
            // courseChapters[k]["score"] === undefined || null
            //   ? (courseChapters.score = totalMarks)
            //   : (courseChapters.score = Math.max(
            //       totalMarks,
            //       courseChapters.score
            //     ));
            courseChapters[k]["score"] === undefined || null
              ? (courseChapters[k]["score"] = totalMarks)
              : (courseChapters[k]["score"] = Math.max(
                  totalMarks,
                  courseChapters[k].score
                ));
            // console.log("Total marks for this chapter", totalMarks);
          }
          //This is working as expected
          // console.log("CourseChapters", courseChapters[k]?._id);
          // totalMarks = 0
        }
      }
    }
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(newData),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    // console.log(count);
    return res.status(200).json({
      success: true,
      message: "Got the data successfully",
      data: deciphered,
      activeUsers: activeUsers?.length,
      results,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || message,
    });
  }
};

// console.log("++++++++++++++++++++++++")
// for (let i = 0; i < data?.length; i++) {
//   for (let j = 0; j < data[i]?.assignedCategories?.length; j++) {
//     for (
//       let k = 0;
//       k < data[i]?.assignedCategories[j]?.courseChapters?.length;
//       k++
//     ) {
//       for (
//         let l = 0;
//         l <
//         data[i]?.assignedCategories[j]?.courseChapters[k]?.chapterQuizzes
//           ?.length;
//         l++
//       ) {
//         const newObj = {
//           _id: data[i]?.assignedCategories[j]?.courseChapters[k]
//             ?.chapterQuizzes[l],
//         };
//         results?.forEach((result) => {
//           if (result?.userId?.toString() == data[i]?._id?.toString()) {
//             if (
//               result?.chapterQuizScore[0]?.chapterId?.toString() ==
//               data[i]?.assignedCategories[j]?.courseChapters[
//                 k
//               ]?._id?.toString()
//             ) {
//               newObj.score = result?.chapterQuizScore[0]?.score;
//               //          newObj;
//               //         console.log(newObj);
//               //Unattempted sectionw will come here
//             }
//           }
//         });
//         //  let ans = {...data[i]._doc,[data[i].assignedCategories[j].courseChapters[k].chapterQuizzes[l]] :  newObj}
//         // data[i].assignedCategories[j].courseChapters[k].chapterQuizzes[l] = newObj;
//         // data[i].assignedCategories[j].courseChapters[k].chapterQuizzes.push(
//         //   newObj
//         // );
//         //  console.log(ans)
//         newArr.push(data[i]);
//       }
//     }
//   }
// }

// let datum = data?.map((users) => {
//    users?.assignedCategories?.map((assignedCourses) => {
//     //Get hold of assigned categories key of object
//      assignedCourses?.courseChapters?.map((assignedChapters) => {
//       //Get hold of course chapter inside assigned categories
//       assignedChapters?.chapterQuizzes?.map((assignedQuizzes) => {
//         //Get hold of chapter quizzes which is assignedCategories : {assignedChapters:{chapterQuizzes}}
//         const newObj = {
//           _id: assignedQuizzes,
//         };

//         results?.forEach((result) => {
//           if (result?.userId?.toString() == users?._id?.toString()) {
//             if (
//               result?.chapterQuizScore[0]?.chapterId?.toString() ==
//               assignedChapters?._id?.toString()
//             ) {
//               newObj.score = result?.chapterQuizScore[0]?.score;
//               //          newObj;
//                       console.log(newObj);
//               //Unattempted sectionw will come here
//             }
//           }
//         });
//         // assignedChapters.chapterQuizzes = newObj
//         // return assignedChapters?.chapterQuizzes ;
//         //   assignedChapters.chapterQuizzes.pop();
//         //   assignedChapters.chapterQuizzes.push(newObj);
//         return newObj;
//       });
//       return assignedChapters
//     });
//     return assignedCourses;
//   });
//    return users
// });
//     data?.filter((ele) => delete ele);
//     console.log(datum);
