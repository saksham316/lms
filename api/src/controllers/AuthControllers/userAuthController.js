import UserModel from "../../models/Authentication/userAuthModel.js";
import fs from "fs";
import CryptoJS from "crypto-js";
import moment from "moment";
import bcrypt, { hash } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { sendMail } from "../../utils/signUpMail.js";
import otpModel from "../../models/OTP/otpModel.js";
// import moment from "moment/moment.js";
import dotenv from "dotenv";
import {
  accessTokenValidity,
  saveAccessTokenToCookie,
} from "../../utils/index.js";
import chalk from "chalk";
import courseModel from "../../models/Course/courseModel.js";
import chapterModel from "../../models/Chapter/chapterModel.js";
import { saveIndividualLoginDetails } from "../../utils/loginSessionDetails/loginCookies.js";
import { loginSessionsModel } from "../../models/UserLoginSessions/userLoginSessionsModel.js";
import { urlProvider } from "../../configs/GoogleCloudConsoleProvider/cloudGeneratedUrl.js";
import forgetPasswordOtpModel from "../../models/OTP/forgetPasswordOtp.js";
dotenv.config();

const jwt = jsonwebtoken;

// This function is responsible for adding a new user to the database.

export const addUser = async (req, res) => {
  try {
    // Get the current date

    // Deleting the expired OTPs (commented out for now)
    //STARTS HERE   ==================>
    // await otpModel.deleteMany({ expiresAt: { $lte: currentDate } });

    //ENDS HERE   ==================>

    // Extracting the avatar, payload, email, and OTP from the request

    let payload = JSON.parse(req?.body?.payload);

    const { email, otp } = payload;

    // Checking if the entered OTP matches the saved OTP in the database
    // console.log(email,otp)
    const savedOtp = await otpModel.find({ email, otp });
    // console.log("This is the length o otp doc",savedOtp)
    //CHECKING THE EXPIRED OTP STATUS
    if (otp != savedOtp?.[0]?.otp || payload?.email !== savedOtp?.[0]?.email) {
      // If the OTP doesn't match, return an error response
      return res.status(400).json({
        success: false,
        message: `Wrong OTP entered`,
      });
    }
    let currentDate = moment();
    // Converting the stored time string to a Moment object
    // console.log("This is the data we got from the backend", savedOtp[0]?.expiryTime)
    const storedTime = moment(savedOtp[0]?.expiryTime, "YYYY-MM-DD HH:mm:ss");
    //  currentDate = moment(currentDate, 'YYYY-MM-DD HH:mm:ss');
    // console.log("This is currentDate", storedTime)
    const timeFlag = storedTime.isAfter(currentDate);
    // console.log("This is time flag", timeFlag)
    if (!timeFlag) {
      await otpModel.deleteMany({ email, otp });
      return res.status(400).json({
        success: false,
        message: `OTP EXPIRED`,
      });
    }
    //THIS IS JUST A ADD ON STEP TO VERIFY THE USER

    //Here deleting the user's otp from the schema.
    await otpModel.deleteMany({ email, otp });
    //Ends here

    //getting avatar url
    const avatarName = `${Math.ceil(Math.random() * 1000000000)}${
      req?.file?.originalname
    }`;
    let avatar = await urlProvider(req?.file?.buffer, avatarName);
    // let avatar =
    // console.log("This is avatar", avatar)
    if (avatar?.error === 0) {
      return res.status(400).json({
        success: false,
        message: "Please try again after sometime!!",
      });
    }
    payload.avatar = avatar?.publicUrl || "N/A";

    //ends here

    delete payload.otp;

    // Hashing the user's password
    const hashedPassword = await bcrypt.hash(payload?.password, 10);
    payload.password = hashedPassword;

    // Setting default values for the user
    payload.disabled = false;
    payload.role = "guest";

    // Creating a new user document and saving it in the database
    const document = new UserModel(payload);
    await document.save();
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(document),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    // Returning a success response
    return res.status(201).json({
      success: true,
      data: deciphered,
      message: "User Created Successfully",
    });
  } catch (error) {
    // Handling any errors that occur during the process
    console.log(chalk.bgRed("Entered in catch block of add user"), error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// This function handles user login.
//Incoming payload type is a plain json body
export const loginUser = async (req, res) => {
  try {
    const { sessionId } = req;
    const jwt = jsonwebtoken;

    // Extracting email, password, and loginSession from the request
    const { email, password } = req?.body;
    const { loginSession } = req;

    // Checking if the user exists and is not disabled
    let userExistence = await UserModel.findOne({ email })
      .populate("assignedStudyMaterial")
      .populate("assignedCategories");
    if (userExistence?.disabled) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized Access!! Please contact the admin",
      });
    }

    if (userExistence?.length === 0) {
      const deleteSessionCookies = await loginSessionsModel.findOneAndDelete({
        email,
        sessionId,
      });
      return res.status(400).json({
        success: false,
        message: `Invalid email id and password`,
      });
    }

    // Comparing the entered password with the hashed password in the database
    const passwordConfirmation = await bcrypt.compare(
      password,
      userExistence?.password
    );

    if (!passwordConfirmation) {
      const deleteSessionCookies = await loginSessionsModel.findOneAndDelete({
        email,
        sessionId,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid email id and password",
      });
    }

    // Generating an access token
    const accessToken = jwt.sign(
      {
        id: userExistence._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_VALIDITY }
    );

    // Saving the access token to an httpOnly Cookie
    saveAccessTokenToCookie(res, accessToken);

    // Saving individual login details
    saveIndividualLoginDetails(res, loginSession);

    // Fetching user's assigned categories and related courses
    const arr = userExistence?.assignedCategories;
    const userCourses = await courseModel
      .find({
        courseCategory: { $in: arr },
      })
      .populate("courseCategory")
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

    // Returning a success response with user details and affiliations
    let decipheredUsers = CryptoJS.AES.encrypt(
      JSON.stringify(userExistence),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    let decipheredUserAffiliations = CryptoJS.AES.encrypt(
      JSON.stringify(userExistence),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: decipheredUsers,
      userAffiliations: decipheredUserAffiliations,
    });
  } catch (error) {
    // Handling any errors that occur during the login process
    console.log(
      chalk.bgCyan("Inside catch block of login===>", error?.message || error)
    );
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};

// This function handles user logout.
//Simplyt a post request, which removes all the cookies from the request
export const logout = async (req, res) => {
  try {
    // Extracting cookies and loginSession from the request
    const cookies = req?.cookies;
    const loginSession = cookies?.LOGIN_STATUS;

    // Extracting email and sessionId from the loginSession
    const [email, sessionId] = loginSession || [];

    // Deleting the login session from the database
    const deleteSessionCookies = await loginSessionsModel.findOneAndDelete({
      email,
      sessionId,
    });

    // Clearing cookies related to access token and login status
    res.clearCookie("ACCESS_TOKEN");
    res.clearCookie("LOGIN_STATUS");

    // Returning a success response
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    // Handling any errors that occur during the logout process
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};

// This function is responsible for sending an OTP to the provided email address.
// It checks if the user already exists, deletes any existing OTPs associated with the email,
// generates a new OTP, sends it via email, and saves the new OTP in the database.

export const sendOtp = async (req, res) => {
  try {
    // Extracting the email from the request body
    const { email } = req?.body;

    // Checking if the user with the given email already exists
    // Protecting this route such that a person with not existing email address enters in the system.

    const userExistence = await UserModel.find({ email });
    //Code to check
    if (userExistence.length > 0) {
      // If the user exists, return an error response
      return res.status(400).json({
        success: false,
        message: `User already existed`,
      });
    }
    //Ends Here

    // Deleting any existing OTPs associated with the email to confirm that the user is now deleted
    await otpModel.findOneAndDelete({ email });

    // Generating a new OTP
    const otp = Math.floor(Math.random() * (1000000 - 100000)) + 100000;

    // Sending the OTP via email
    sendMail(email, otp)
      .then(async () => {
        // Setting an expiration time for the OTP (3,00,000 milliseconds = 5 minutes)
        const currentTime = moment();
        const expiryTime = currentTime.add(2, "minutes");
        // Format the current time as a string
        const formattedTime = expiryTime.format("YYYY-MM-DD HH:mm:ss");

        // console.log(formattedTime);

        // Creating a new OTP document and saving it in the database
        const otpDoc = new otpModel({ email, otp, expiryTime: formattedTime });
        await otpDoc.save();

        // Sending a success response
        return res.status(200).json({
          success: true,
          message: `Sent Mail successfully`,
        });
      })
      .catch((error) => {
        // If there is an error sending the email, return an error response
        return res.status(400).json({
          success: false,
          message: `Unable to send mail! ${error.message}`,
        });
      });
  } catch (error) {
    // If there is an error in the overall process, return an error response
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};
// This function is responsible for generating a new refresh token.
//To maintain the users session
export const refreshToken = async (req, res) => {
  try {
    // Extracting email from the request body
    const { email } = req.body;

    // Checking if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email ID is required to generate Refresh Token",
      });
    }

    // Checking if the user with the given email exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email Does Not Exist",
      });
    }

    // Clearing the existing access token cookie
    res.clearCookie("ACCESS_TOKEN");

    // Generating a new refresh token with extended expiration time (15 days)
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Saving the new refresh token to an httpOnly Cookie
    saveAccessTokenToCookie(res, refreshToken);

    // Returning a success response
    return res.status(200).json({
      success: true,
      message: "Refresh Token Generated",
    });
  } catch (error) {
    // Handling any errors that occur during the process
    console.log("Error message:", error.message);
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// This function is responsible for changing the password in the database.
export const resetPassword = async (req, res) => {
  try {
    // Extracting email, password, and confirmPassword from the request body
    const { email, password, confirmPassword, otp } = req.body;
    // currentDate - holds the current date
    const otpDoc = await forgetPasswordOtpModel.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: `Please try again after some time with new OTP`,
      });
    }
    const currentDate = moment();
    const storedTime = moment(otpDoc?.expiryTime, "YYYY-MM-DD HH:mm:ss");

    const timeFlag = storedTime.isAfter(currentDate);
    // console.log("This is time flag",timeFlag)
    if (!timeFlag) {
      await forgetPasswordOtpModel.deleteMany({ email, otp });
      return res.status(400).json({
        success: false,
        message: `Session expired try again with new OTP`,
      });
    }
    // Checking if email, password, and confirmPassword are provided
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "FAILURE",
        status: "Email Id, Password, and Confirm Password are required",
      });
    }

    // Checking if the user with the given email exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist",
      });
    }

    // Checking if the length of password and confirmPassword is at least 10 characters
    if (password.length < 10 || confirmPassword.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password must have a length greater than or equal to 10",
      });
    }

    // Checking if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Updating the user's password in the database
    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Returning a success response
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    // Handling any errors that occur during the process
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error.message}`,
    });
  }
};

// Fetch users
// This function retrieves a list of users, optionally filtered by a search query.
export const usersList = async (req, res) => {
  try {
    let users;
    // Check if a search query is provided in the request
    if (
      req?.query?.searchQuery?.length > 0 &&
      req?.query?.searchQuery !== "undefined"
    ) {
      const toSearch = req?.query?.searchQuery;

      // Create a case-insensitive regular expression pattern for the search
      const pattern = new RegExp(toSearch, "gi");

      // Find users matching the search criteria (fullName or userName)
      users = await UserModel.find({
        $or: [
          {
            fullName: pattern,
          },
          { userName: pattern },
        ],
      })
        .populate("assignedStudyMaterial")
        .populate({
          path: "assignedCategories",
          model: courseModel,
          populate: [
            {
              path: "providerDetails",
              model: UserModel,
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
    } else {
      // If no search query, retrieve all users
      users = await UserModel.find()
        .populate("assignedStudyMaterial")
        .populate({
          path: "assignedCategories",
          model: courseModel,
          populate: [
            {
              path: "providerDetails",
              model: UserModel,
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
    }
    // console.log(users)
    // Return a success response with the retrieved user data
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(users),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      message: "Found data successfully",
      data: deciphered,
    });
  } catch (error) {
    // Handle any errors that occur during the data retrieval process
    return res.status(400).json({
      success: false,
      message: error.message || error,
    });
  }
};

// This function is responsible for updating user details, including the password if changed.
export const updateUser = async (req, res) => {
  try {
    // Logging for debugging purposes
    // console.log(chalk.bgGreen("Entered inside the update user controller"));

    // Extracting user ID from request parameters
    const { id } = req?.params;

    // Parsing the updated data from the request body
    let parsedUpdatedData = JSON.parse(req?.body?.payload);

    // If a new avatar file is provided, update the avatar path
    // console.log("Thjis is req path", req?.file?.path)

    // console.log(chalk.bgGreenBright("Entered  A STEP ABOVE"))
    if (req?.file) {
      // console.log(chalk.bgGreenBright("Entered in update field"))
      // console.log(req?.file)
      const fileName = `${Math.ceil(Math.random() * 1000000000)}${
        req?.file?.originalname
      }`;
      const courseThumbnail = await urlProvider(req?.file?.buffer, fileName);
      if (courseThumbnail?.error === 0) {
        return res.status(400).json({
          success: false,
          message: "Please try again!!",
        });
      }
      parsedUpdatedData.avatar = courseThumbnail?.publicUrl;
    }

    // If the password is changed, hash the new password
    if (parsedUpdatedData?.isPasswordChanged == true) {
      const hashedPassword = await bcrypt.hash(
        parsedUpdatedData.newPassword,
        10
      );
      parsedUpdatedData.password = hashedPassword;
    }

    // Updating user details in the database and retrieving the updated user
    const newUserDetails = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: parsedUpdatedData,
      },
      { new: true }
    );

    // Returning a success response with the updated user data
    let decipheredData = CryptoJS.AES.encrypt(
      JSON.stringify(newUserDetails),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(201).json({
      success: true,
      message: "Updated the user successfully",
      data: decipheredData,
    });
  } catch (error) {
    // Handling any errors that occur during the update process
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};

// Bulk update function
export const bulkUserUpdates = async (req, res) => {
  try {
    const { students, courseId } = req?.body?.payload;
    // console.log("These are students", students);
    const data = await UserModel.updateMany(
      { _id: { $in: students } },
      { $addToSet: { assignedCategories: courseId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Updated users successfully`,
    });
  } catch (error) {
    // Handling any errors that occur during the process
    console.log("Error in side bulk update", error?.message);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error! ${error?.message}`,
    });
  }
};

// This function retrieves details of an individual user based on the provided user ID.
export const getIndividualUser = async (req, res) => {
  try {
    // Extracting user ID from request parameters
    const { id } = req?.params;

    // Retrieving user details from the database, excluding certain sensitive fields
    const responseData = await UserModel.find(
      { _id: id },
      {
        disabled: 0,
        enrollments: 0,
        permissions: 0,
      }
    );

    // Returning a success response with the user details (excluding sensitive fields)
    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(responseData),
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return res.status(200).json({
      success: true,
      message: "Found the user successfully",
      data: deciphered,
    });
  } catch (error) {
    // Handling any errors that occur during the data retrieval process
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};

// ------------------------------------------------------End of controllers------------------------------------------------------------
