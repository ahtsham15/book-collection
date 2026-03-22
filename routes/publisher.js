const express = require("express");
const userAuth  = require("../middlewares/authUser");
const { createPublisher, getAllPublishers, getPublisherById, updatePublisher,deletePublisher } = require("../controllers/publisherController");

const router = express.Router();

router.post("/publishers",userAuth.verifyToken,createPublisher);
router.get("/publishers", getAllPublishers);
router.get("/publishers/:id", getPublisherById);
router.patch("/publishers/:id", userAuth.verifyToken, updatePublisher);
router.delete("/publishers/:id", userAuth.verifyToken, deletePublisher);

module.exports = router;