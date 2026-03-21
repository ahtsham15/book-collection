const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");
const Genre = require("../models/genres");
const Book = require("../models/book");

const createGenre = async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    return SuccessResponse(res, 201, {
      message: "Genre created successfully",
      genre
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "genres", String(error), "/");
  }
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    const genresWithBookCount = await Promise.all(
      genres.map(async (genre) => {
        const bookCount = await Book.countDocuments({ 
          genres: genre._id, 
        });
        return {
          ...genre.toObject(),
          bookCount
        };
      })
    );
    
    return SuccessResponse(res, 200, genresWithBookCount);
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "genres", String(error), "/");
  }
};

const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const genre = await Genre.findOne({ _id: id});
    if (!genre) {
      return ErrorResponse(res, 404, "Genre not found");
    }
    const books = await Book.find({ genres: id})
      .populate('author', 'firstName lastName')
      .select('title ISBN publicationDate price averageRating');
    
    return SuccessResponse(res, 200, {
      genre,
      books
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "genres", String(error), "/");
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    
    const genre = await Genre.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    
    if (!genre) {
      return ErrorResponse(res, 404, "Genre not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Genre updated successfully",
      genre
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "genres", String(error), "/");
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const bookCount = await Book.countDocuments({ genres: id });
    if (bookCount > 0) {
      return ErrorResponse(res, 400, "Cannot delete genre that is assigned to books");
    }
    
    const genre = await Genre.findByIdAndDelete(id,);
    
    if (!genre) {
      return ErrorResponse(res, 404, "Genre not found");
    }
    
    return SuccessResponse(res, 200, {
      message: "Genre deleted successfully"
    });
  } catch (error) {
    return ErrorResponse(res, 400, String(error), "genres", String(error), "/");
  }
};


module.exports = {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
}