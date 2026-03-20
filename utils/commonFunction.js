require('dotenv').config();

const TOKEN_SECRET = process.env.SECRET_TOKEN
const jwt = require("jsonwebtoken");
const expiresIn = 1 * 24 * 60 * 60 * 1000;

exports.generateToken = async (payload) => {
  return jwt.sign(payload,TOKEN_SECRET, {
    expiresIn,
  });
};

exports.generateRandomPassword = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};