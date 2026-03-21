const express = require("express");
const router = express.Router();
const authRoute = require("../routes/user")
const authorRoute = require("../routes/author")
const bookRoute = require("../routes/book")

router.use("/auth",authRoute);
router.use("",authorRoute);
router.use("",bookRoute);

module.exports = router;