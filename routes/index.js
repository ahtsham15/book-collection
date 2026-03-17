const express = require("express");
const router = express.Router();
const authRoute = require("../routes/user")
const authorRoute = require("../routes/author")

router.use("/auth",authRoute);
router.use("",authorRoute);
module.exports = router;