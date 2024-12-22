const express = require("express");
const router = express.Router();
const validateMovie = require("../middlewares/movie");
const { validationResult } = require("express-validator");
const movieController = require("../controllers/movie");

router.post("/post", validateMovie, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  movieController.createMovie(req, res);
});
router.get("/posts", movieController.getAllMovie);
router.get("/post/:id", movieController.getMovieById);
router.put("/post/:id", validateMovie, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  movieController.updateMovie(req, res);
});
router.delete("/post/:id", movieController.deleteMovie);

// Add new route before module.exports
router.get("/genre/:genreId", movieController.getAllMovie);

// Remove this line since we'll handle it in production series routes
// router.get("/production-series", movieController.getProductionSeries);

module.exports = router;
