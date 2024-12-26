import jsonwebtoken from "jsonwebtoken";
import chalk from "chalk";

const jwt = jsonwebtoken;

export const userIdAttachment = async (req, res, next) => {
  try {
    const cookies = req?.cookies;
    const access_token = cookies?.ACCESS_TOKEN;
    if (!access_token) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized! Please Check Your Login Credentials",
      });
    }

    jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY,
      async (error, user) => {
        try {
          if (error) {
            console.log(chalk.green("Entered inside if jwt block"));
            console.log(chalk.bgBlue(error));
            return res.status(403).json({
              success: false,
              message: "Unauthorized! Please Check Your Login Credentials",
            });
          }
          const id = user?.id;
          req.userId = id;
          console.log(
            chalk.bgGreen(
              "User id is added as req.userId in request object " +
                chalk.red.bold("!!!!!!!!")
            )
          );
          return next();
        } catch (error) {
          console.log(chalk.green("Entered inside catch block"));
          return res.status(403).json({
            success: false,
            message: error.message || error,
          });
        }
      }
    );
  } catch (error) {
    console.log(chalk.green("Entered inside catch block"));
    return res.status(403).json({
      success: false,
      message: error.message || error,
    });
  }
};
