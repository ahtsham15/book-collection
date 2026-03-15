require('dotenv').config();

const TOKEN_SECRET = process.env.SECRET_TOKEN
const jwt = require("jsonwebtoken");
const expiresIn = 1 * 24 * 60 * 60 * 1000;

exports.generateToken = async (payload) => {
  return jwt.sign(payload,TOKEN_SECRET, {
    expiresIn,
  });
};