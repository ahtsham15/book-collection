const { SuccessResponse, ErrorResponse } = require("../utils/responseHelper");
const Genre = require("../models/genres");

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

module.exports = {
    createGenre,
}