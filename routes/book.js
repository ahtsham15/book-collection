const express = require("express");
const userAuth  = require("../middlewares/authUser");
const { createBook, getAllBooks, getBookById, updateBook, deleteBook} = require("../controllers/bookController");
const router = express.Router();

router.post("/books",userAuth.verifyToken,createBook);
router.get("/books",userAuth.verifyToken,getAllBooks);
router.get("/books/:id",userAuth.verifyToken,getBookById);
router.patch("/books/:id",userAuth.verifyToken,updateBook);
router.delete("/books/:id",userAuth.verifyToken,deleteBook);

module.exports = router;