const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const genreController = require("../controllers/genre");

router.post("/", [
  body("name").trim().not().isEmpty().withMessage("Nama genre harus diisi!"),
  body("description").trim().not().isEmpty().withMessage("Deskripsi genre harus diisi!")
], genreController.createGenre);

router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);
router.put("/:id", [
  body("name").trim().not().isEmpty().withMessage("Nama genre harus diisi!"),
  body("description").trim().not().isEmpty().withMessage("Deskripsi genre harus diisi!")
], genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
