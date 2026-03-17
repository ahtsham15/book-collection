const express = require("express");
const userAuth  = require("../middlewares/authUser");
const { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } = require("../controllers/authorController");
const router = express.Router();

router.post("/authors", userAuth.verifyToken, createAuthor);
router.get("/authors", userAuth.verifyToken, getAllAuthors);
router.get("/authors/:id", userAuth.verifyToken, getAuthorById);
router.patch("/authors/:id", userAuth.verifyToken, updateAuthor);
router.delete("/authors/:id", userAuth.verifyToken, deleteAuthor);

module.exports = router;