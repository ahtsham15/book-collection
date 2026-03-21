const Author = require("../models/author");
const { User } = require("../models/user");
const { generateRandomPassword } = require("../utils/commonFunction");
const { sendPasswordConfirmationEmail } = require("../utils/emailHelper");
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");
const bcrypt = require('bcrypt');

const createAuthor = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return ErrorResponse(res, 403, "Unauthorized: Only admin users can create authors", "authors", "User is not admin", "/");
    }

    const existingAuthor = await Author.findOne({ email: req.body.email });
    if (existingAuthor) {
      return ErrorResponse(res, 409, "Email already exists. Please use a different email address", "authors", "Duplicate email", "/");
    }
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return ErrorResponse(res, 409, "Email already exists in user database", "authors", "Duplicate email in users", "/");
    }
    const plainPassword = generateRandomPassword(12);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    req.body.email = req.body.email.toLowerCase();
    const author = await Author.create(req.body);
    const userData = {
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName || req.body.name?.split(' ')[0] || 'Author',
      lastName: req.body.lastName || req.body.name?.split(' ')[1] || '',
      userType: 'author',
    };

    const user = await User.create(userData);
    try {
      await sendPasswordConfirmationEmail(
        req.body.email, 
        plainPassword, 
        `${userData.firstName} ${userData.lastName}`.trim()
      );
    } catch (emailError) {
      console.error("Failed to send credentials email:", emailError);
    }
    return SuccessResponse(res, 201, {
      message: "Author created successfully. Credentials have been sent to their email.",
      author: {
        id: author._id,
        email: author.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
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