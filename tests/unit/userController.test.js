const { 
  signupUser, 
  loginUser, 
  profile,
  requestPasswordReset,
  verifyResetCode,
  resetPassword 
} = require("../../controllers/userController");
const { User } = require("../../models/user");
const bcrypt = require('bcrypt');
const { generateToken } = require("../../utils/commonFunction");
const { sendResetPasswordEmail } = require("../../utils/emailHelper");
const { mockUserData, mockResponse } = require("../mocks/mockData");

// Mock dependencies
jest.mock("../../models/user");
jest.mock('bcrypt');
jest.mock("../../utils/commonFunction");
jest.mock("../../utils/emailHelper");
jest.mock("../../utils/responseHelper", () => ({
  SuccessResponse: jest.fn((res, status, data) => res.json(data)),
  ErrorResponse: jest.fn((res, status, error) => res.status(status).json({ error }))
}));

describe("User Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      body: {},
      user: { _id: "507f1f77bcf86cd799439011" }
    };
    res = mockResponse();
  });

  describe("signupUser", () => {
    it("should create a new user successfully", async () => {
    // Arrange
    const userData = { ...mockUserData.validUser };
    req.body = userData;
    
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.create.mockResolvedValue({ 
      _id: "newUserId", 
      ...userData,
      password: "hashedPassword"
    });
    generateToken.mockResolvedValue("mock-token");

    // Act
    await signupUser(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email.toLowerCase() });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    expect(User.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Account Created Successfully",
      access_token: "mock-token"
        }));
    });

    it("should return error if email already exists", async () => {
      // Arrange
      req.body = mockUserData.validUser;
      User.findOne.mockResolvedValue({ email: mockUserData.validUser.email });

      // Act
      await signupUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(303);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "The user with this email already exist"
      }));
    });

    it("should handle database errors", async () => {
      // Arrange
      req.body = mockUserData.validUser;
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act
      await signupUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("loginUser", () => {
    it("should login user successfully with valid credentials", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        password: "password123"
      };
      
      const mockUser = {
        _id: "userId123",
        email: "john@example.com",
        password: "hashedPassword"
      };
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockResolvedValue("mock-access-token");

      // Act
      await loginUser(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", mockUser.password);
      expect(generateToken).toHaveBeenCalledWith({ userId: mockUser._id });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Login Successfully",
        access_token: "mock-access-token"
      }));
    });

    it("should return error if email doesn't exist", async () => {
      // Arrange
      req.body = { email: "nonexistent@example.com", password: "password" };
      User.findOne.mockResolvedValue(null);

      // Act
      await loginUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Email doesn't Exist"
      });
    });

    it("should return error if password is incorrect", async () => {
      // Arrange
      req.body = { email: "john@example.com", password: "wrongpassword" };
      User.findOne.mockResolvedValue({ email: "john@example.com", password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await loginUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Please enter the correct password"
      });
    });
  });

  describe("profile", () => {
    it("should return user profile successfully", async () => {
      // Arrange
      const userProfile = {
        _id: "507f1f77bcf86cd799439011",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com"
      };
      
      User.findOne.mockResolvedValue(userProfile);

      // Act
      await profile(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.user._id });
      expect(res.json).toHaveBeenCalledWith(userProfile);
    });

    it("should handle errors when fetching profile", async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act
      await profile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("requestPasswordReset", () => {
    it("should generate and send reset code for valid email", async () => {
      // Arrange
      req.body = { email: "john@example.com" };
      const mockUser = {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);
      sendResetPasswordEmail.mockResolvedValue(true);

      // Act
      await requestPasswordReset(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(mockUser.resetPasswordCode).toBeDefined();
      expect(mockUser.resetPasswordExpires).toBeDefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(sendResetPasswordEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "If your email exists in our system, you will receive a reset code."
      }));
    });

    it("should return success even if email doesn't exist (security measure)", async () => {
      // Arrange
      req.body = { email: "nonexistent@example.com" };
      User.findOne.mockResolvedValue(null);

      // Act
      await requestPasswordReset(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "If your email exists in our system, you will receive a reset code."
      }));
    });

    it("should handle email sending failure", async () => {
      // Arrange
      req.body = { email: "john@example.com" };
      const mockUser = {
        email: "john@example.com",
        firstName: "John",
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);
      sendResetPasswordEmail.mockRejectedValue(new Error("Email service error"));

      // Act
      await requestPasswordReset(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "Failed to send reset email. Please try again."
      }));
    });
  });

  describe("verifyResetCode", () => {
    it("should verify valid reset code successfully", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        resetCode: "123456"
      };
      
      const mockUser = {
        email: "john@example.com",
        resetPasswordCode: "123456",
        resetPasswordExpires: Date.now() + 600000
      };
      
      User.findOne.mockResolvedValue(mockUser);

      // Act
      await verifyResetCode(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
        resetPasswordCode: "123456",
        resetPasswordExpires: { $gt: expect.any(Number) }
      });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Reset code verified successfully",
        verified: true
      }));
    });

    it("should reject invalid or expired reset code", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        resetCode: "wrongcode"
      };
      
      User.findOne.mockResolvedValue(null);

      // Act
      await verifyResetCode(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid or expired reset code"
      });
    });

    it("should validate required fields", async () => {
      // Arrange
      req.body = { email: "john@example.com" };

      // Act
      await verifyResetCode(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully with valid code", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        resetCode: "123456",
        newPassword: "newPassword123"
      };
      
      const mockUser = {
        email: "john@example.com",
        resetPasswordCode: "123456",
        resetPasswordExpires: Date.now() + 600000,
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("newHashedPassword");

      // Act
      await resetPassword(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
        resetPasswordCode: "123456",
        resetPasswordExpires: { $gt: expect.any(Number) }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", "salt");
      expect(mockUser.password).toBe("newHashedPassword");
      expect(mockUser.resetPasswordCode).toBeUndefined();
      expect(mockUser.resetPasswordExpires).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Password reset successful. You can now login with your new password."
      }));
    });

    it("should reject reset with short password", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        resetCode: "123456",
        newPassword: "short"
      };

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Password must be at least 6 characters long"
      });
    });

    it("should reject invalid reset code", async () => {
      // Arrange
      req.body = {
        email: "john@example.com",
        resetCode: "wrongcode",
        newPassword: "newPassword123"
      };
      
      User.findOne.mockResolvedValue(null);

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid or expired reset code"
      });
    });
  });
});