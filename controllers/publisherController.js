const Book = require("../models/book");
const Publisher = require("../models/publisher");
const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");

const createPublisher = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
          return ErrorResponse(res, 403, "Unauthorized: Only admin users can create authors", "authors", "User is not admin", "/");
    }
    const publisher = await Publisher.create(req.body);
    return SuccessResponse(res, 201, {
      message: "Publisher created successfully",
      publisher
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "publishers", String(error), "/");
  }
};

const getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().sort({ name: 1 });
    const publishersWithBookCount = await Promise.all(
      publishers.map(async (publisher) => {
        const bookCount = await Book.countDocuments({ 
          publisher: publisher._id, 
          isActive: true 
        });
        return {
          ...publisher.toObject(),
          bookCount
        };
      })
    );
    
    return SuccessResponse(res, 200, publishersWithBookCount);
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "publishers", String(error), "/");
  }
};

const getPublisherById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const publisher = await Publisher.findOne({ _id: id });
    if (!publisher) {
      return ErrorResponse(res, 404, "Publisher not found");
    }
    
    const books = await Book.find({ publisher: id, isActive: true })
      .populate('author', 'firstName lastName')
      .populate('genres', 'name')
      .select('title ISBN publicationDate price coverImage averageRating');
    
    return SuccessResponse(res, 200, {
      publisher,
      books
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "publishers", String(error), "/");
  }
};

const updatePublisher = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
          return ErrorResponse(res, 403, "Unauthorized: Only admin users can create authors", "authors", "User is not admin", "/");
    }
    const { id } = req.params;
    
    const publisher = await Publisher.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!publisher) {
      return ErrorResponse(res, 404, "Publisher not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Publisher updated successfully",
      publisher
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "publishers", String(error), "/");
  }
};

const deletePublisher = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
          return ErrorResponse(res, 403, "Unauthorized: Only admin users can create authors", "authors", "User is not admin", "/");
    }
    const { id } = req.params;
    
    const bookCount = await Book.countDocuments({ publisher: id, isActive: true });
    if (bookCount > 0) {
      return ErrorResponse(res, 400, "Cannot delete publisher with existing books");
    }
    
    const publisher = await Publisher.findByIdAndDelete(id);
    
    if (!publisher) {
      return ErrorResponse(res, 404, "Publisher not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Publisher deleted successfully"
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "publishers", String(error), "/");
  }
};


module.exports = {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    updatePublisher,
    deletePublisher,
}