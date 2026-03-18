const express = require("express");
const router = express.Router();
const authRoute = require("../routes/user")
const authorRoute = require("../routes/author")
const genreRoute = require("../routes/genre")

router.use("/auth",authRoute);
router.use("",authorRoute);
router.use("",genreRoute);
module.exports = router;