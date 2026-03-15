const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../utils/responseHelper");
const { User } = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req?.headers?.authorization?.split(" ")[1];
    if (accessToken) {
        console.log("The secret token is: ",process.env.SECRET_TOKEN)
      const isVerified = jwt.verify(accessToken, process.env.SECRET_TOKEN);
      if (isVerified) {
        req.user = await User.findOne({ _id: isVerified.userId });
        next();
      } else {
        return ErrorResponse(res, 401, "Invalid Token");
      }
    } else {
      return ErrorResponse(res, 401, "A token is required for Authentication");
    }
  } catch (error) {
    return ErrorResponse(
      res,
      401,
      String(error),
      "verify token middeware",
      String(error),
      req.url
    );
  }
};

module.exports = {
  verifyToken,
};