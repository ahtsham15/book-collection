const Author = require("../models/author");
const Book = require("../models/book");
const mongoose = require('mongoose');
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");

const createBook = async (req, res) => {
  try {
    if (!req.user || !["admin", "author"].includes(req.user.userType)) {
      return ErrorResponse(res, 403, "Unauthorized to create the book");
    }
    const bookData = req.body;
    const author = await Author.findById(bookData.author);
    if (!author) {
      return ErrorResponse(res, 404, "Author not found");
    }
    const book = await Book.create(bookData);
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'firstName lastName')
      .populate('genres', 'name')
      .populate('publisher', 'name');
    return SuccessResponse(res, 201, {
      message: "Book created successfully",
      book: populatedBook
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};

const getAllBooks = async (req, res) => {
  try {
    if (!req.user || !["admin", "author"].includes(req.user.userType)) {
      return ErrorResponse(res, 403, "Unauthorized to view books");
    }
    const books = await Book.find()
      .populate('author', 'firstName lastName')
      .populate('genres', 'name')
      .populate('publisher', 'name')
      .sort()
    return SuccessResponse(res, 200, {
      message: "Books retrieved successfully",
      books,
      total: books.length
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};

const getBookById = async (req, res) => {
  try {
    if (!req.user || !["admin", "author"].includes(req.user.userType)) {
      return ErrorResponse(res, 403, "Unauthorized to view book details");
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorResponse(res, 400, "Invalid book ID format");
    }
    let filter = { _id: id };
    if (req.user.userType === 'author') {
    }
    const book = await Book.findOne({ _id: id})
      .populate('author', 'firstName lastName bio nationality photo')
      .populate('genres', 'name description')
      .populate('publisher', 'name address contactEmail website');
    
    if (!book) {
      return ErrorResponse(res, 404, "Book not found");
    }
    return SuccessResponse(res, 200, {
      message: "Book retrieved successfully",
      book,
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!req.user || !["admin", "author"].includes(req.user.userType)) {
      return ErrorResponse(res, 403, "Unauthorized to view book details");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorResponse(res, 400, "Invalid book ID format");
    }
    if (updateData.author) {
      const author = await Author.findById(updateData.author);
      if (!author) return ErrorResponse(res, 404, "Author not found");
    }
    const book = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true}
    )
      .populate('author', 'firstName lastName')
    
    if (!book) {
      return ErrorResponse(res, 404, "Book not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Book updated successfully",
      book
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !["admin", "author"].includes(req.user.userType)) {
      return ErrorResponse(res, 403, "Unauthorized to view book details");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorResponse(res, 400, "Invalid book ID format");
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return ErrorResponse(res, 404, "Book not found");
    }
    return SuccessResponse(res, 200, {
      message: "Book deleted successfully"
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "books", String(error), "/");
  }
};


module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
}