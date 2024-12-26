import CryptoJS from "crypto-js";
import { loginSessionsModel } from "../../models/UserLoginSessions/userLoginSessionsModel.js";

export const getLoggedInUsersInfo = async (req, res) => {
  try {
    const loggedInUserData = await loginSessionsModel.find();

    let deciphered = CryptoJS.AES.encrypt(
      JSON.stringify(loggedInUserData),
      process.env.CRYPTO_SECRET_KEY
    ).toString();

    return res.status(200).json({
      success: true,
      data: deciphered,
      message: "Added the course successfuly",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || error,
    });
  }
};
