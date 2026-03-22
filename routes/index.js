const express = require("express");
const router = express.Router();
const authRoute = require("../routes/user")
const authorRoute = require("../routes/author")
const genreRoute = require("../routes/genre")
const bookRoute = require("../routes/book")
const publisherRoute = require("../routes/publisher")

router.use("/auth",authRoute);
router.use("",authorRoute);
router.use("",genreRoute);
router.use("",bookRoute);
router.use("",publisherRoute);

module.exports = router;