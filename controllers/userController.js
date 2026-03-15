const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");
const { generateToken } = require("../utils/commonFunction");
const { sendResetPasswordEmail } = require("../utils/emailHelper");

const loginUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Email doesn't Exist" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res
        .status(401)
        .json({ success: false, error: "Please enter the correct password" });
    }
    const access_token = await generateToken({ userId: user._id });
    SuccessResponse(res, 200, {
      message: "Login Successfully",
      access_token,
      exp: 86400000,
    });
  } catch (error) {
    ErrorResponse(res, 400, String(error), "users", String(error), "/");
  }
};

const signupUser = async (req, res) => {
  try {
    const payload = req.body;
    payload.email = payload.email.toLowerCase();
    const emailExist = await User.findOne({ email: payload.email });
    if (emailExist)
      return ErrorResponse(res, 303, "The user with this email already exist");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    payload.password = hashPassword;
    const response = await User.create(payload);
    if (response) {
      const access_token = await generateToken({ userId: response._id });
      return SuccessResponse(res, 202, {
        message: "Account Created Successfully",
        access_token,
        exp: 86400000,
      });
    } else {
      return;
    }
  } catch (error) {
    ErrorResponse(res, 400, String(error), "users", String(error), "/");
    console.error("Error creating user or Stripe customer:", error.message);
  }
};

const profile = async (req, res) => {
  try {
    let response = await User.findOne({ _id: req.user._id });
    return SuccessResponse(res, 200, response);
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ success: false, error: String(error) });
  }
};

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return SuccessResponse(res, 200, {
        message: "If your email exists in our system, you will receive a reset code."
      });
    }

    const resetCode = generateResetCode();
    
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 600000;
    await user.save();
    try {
      await sendResetPasswordEmail(user.email, resetCode, user.firstName || user.lastName);
    } catch (emailError) {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return ErrorResponse(res, 500, "Failed to send reset email. Please try again.");
    }

    return SuccessResponse(res, 200, {
      message: "If your email exists in our system, you will receive a reset code."
    });

  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    return ErrorResponse(res, 500, String(error), "users", String(error), "/");
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and reset code are required" 
      });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired reset code" 
      });
    }
    return SuccessResponse(res, 200, {
      message: "Reset code verified successfully",
      verified: true
    });

  } catch (error) {
    console.error("Error in verifyResetCode:", error);
    return ErrorResponse(res, 500, String(error), "users", String(error), "/");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: "Email, reset code, and new password are required" 
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: "Password must be at least 6 characters long" 
      });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired reset code" 
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    try {
      console.log(`Password reset successful for user: ${user.email}`);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    return SuccessResponse(res, 200, {
      message: "Password reset successful. You can now login with your new password."
    });

  } catch (error) {
    console.error("Error in resetPassword:", error);
    ErrorResponse(res, 500, String(error), "users", String(error), "/");
  }
};

module.exports = {
    signupUser,
    loginUser,
    profile,
    resetPassword,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
}