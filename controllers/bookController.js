const Author = require("../models/author");
const Book = require("../models/book");
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");

const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    const author = await Author.findById(bookData.author);
    if (!author) {
      return ErrorResponse(res, 404, "Author not found");
    }
    const book = await Book.create(bookData);
    return SuccessResponse(res, 201, {
      message: "Book created successfully",
      book: book
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};