const express = require("express");
const userAuth  = require("../middlewares/authUser");
const { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } = require("../controllers/genresController");
const router = express.Router();

router.post("/genres", createGenre);
router.get("/genres", getAllGenres);
router.get("/genres/:id", getGenreById);
router.patch("/genres/:id", updateGenre);
router.delete("/genres/:id", deleteGenre);

module.exports = router;