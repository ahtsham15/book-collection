const Author = require("../models/author");
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");

const createAuthor = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can create authors", "authors", "User is not admin", "/");
    }
    const existingAuthor = await Author.findOne({ email: req.body.email });
    if (existingAuthor) {
      return ErrorResponse(res, 409, "Email already exists. Please use a different email address", "authors", "Duplicate email", "/");
    }
    req.body.email = req.body.email.toLowerCase();
    const author = await Author.create(req.body);
    return SuccessResponse(res, 201, {
      message: "Author created successfully",
      author
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "authors", String(error), "/");
  }
};

const getAllAuthors = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can access authors", "authors", "User is not admin", "/");
    }
    const authors = await Author.find().sort({ lastName: 1 });
    const authorsWithBookCount = await Promise.all(
      authors.map(async (author) => {
        // const bookCount = await Book.countDocuments({ author: author._id});
        return {
          ...author.toObject(),
        //   bookCount
        };
      })
    );
    
    return SuccessResponse(res, 200, {
    //   authors: authorsWithBookCount,
        authors:authors,
      totalAuthors: authorsWithBookCount.length
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "authors", String(error), "/");
  }
};

const getAuthorById = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can access author details", "authors", "User is not admin", "/");
    }
    
    const { id } = req.params;
    const author = await Author.findOne({ _id: id});
    if (!author) {
      return ErrorResponse(res, 404, "Author not found", "authors", "Author not found", "/");
    }
    
    // Get books by this author (uncommented and ready to use)
    // const books = await Book.find({ author: id, isActive: true })
    //   .populate('genres', 'name')
    //   .select('title ISBN publicationDate price coverImage averageRating');
    
    return SuccessResponse(res, 200, {
      author,
    //   books,
    //   totalBooks: books.length
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "authors", String(error), "/");
  }
};

const updateAuthor = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can update authors", "authors", "User is not admin", "/");
    }
    const { id } = req.params;
    const existingAuthor = await Author.findById(id);
    if (!existingAuthor) {
      return ErrorResponse(res, 404, "Author not found", "authors", "Author not found", "/");
    }
    if (req.body.email == existingAuthor.email) {
      const emailExists = await Author.findOne({ 
        email: req.body.email.toLowerCase(),
      });
      if (emailExists) {
        return ErrorResponse(res, 409, "Email already exists. Please use a different email", "authors", "Duplicate email", "/");
      }
    }
    
    const author = await Author.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(req.body.email && { email: req.body.email.toLowerCase() })
      },
      { new: true, runValidators: true }
    );
    
    return SuccessResponse(res, 200, {
      message: "Author updated successfully",
      author
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "authors", String(error), "/");
  }
};

const deleteAuthor = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can update authors", "authors", "User is not admin", "/");
    }
    const { id } = req.params;
    // Check if author has books
    // const bookCount = await Book.countDocuments({ author: id, isActive: true });
    // if (bookCount > 0) {
    //   return ErrorResponse(res, 400, "Cannot delete author with existing books. Please reassign or delete books first.");
    // }
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return ErrorResponse(res, 404, "Author not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Author deleted successfully"
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "authors", String(error), "/");
  }
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
}