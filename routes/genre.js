const express = require("express");
const userAuth  = require("../middlewares/authUser");
const { createGenre } = require("../controllers/genresController");
const router = express.Router();

// router.post("/genres", userAuth.verifyToken, createGenre);
router.post("/genres", createGenre);
// router.get("/genres", getAllGenres);
// router.get("/genres/:id", getGenreById);
// router.put("/genres/:id", userAuth.verifyToken, updateGenre);
// router.delete("/genres/:id", userAuth.verifyToken, deleteGenre);

module.exports = router;