const { validationResult } = require("express-validator");
const Genre = require("../models/genre");

exports.createGenre = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const genre = new Genre({
      name: req.body.name,
      description: req.body.description
    });

    const result = await genre.save();
    res.status(201).json({
      message: "Genre created successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({
      message: "Fetched genres successfully",
      data: genres
    });
  } catch (err) {
    next(err);
  }
};

exports.getGenreById = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id)
      .populate({
        path: 'movies',
        select: 'title image description year' // Select fields you want to return
      });
    
    if (!genre) {
      const error = new Error("Genre not found");
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      message: "Genre fetched",
      data: genre
    });
  } catch (err) {
    next(err);
  }
};

exports.updateGenre = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      const error = new Error("Genre not found");
      error.statusCode = 404;
      throw error;
    }

    genre.name = req.body.name;
    genre.description = req.body.description;
    const result = await genre.save();

    res.status(200).json({
      message: "Genre updated",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      const error = new Error("Genre not found");
      error.statusCode = 404;
      throw error;
    }

    await Genre.findByIdAndDelete(req.params.id); // Changed from findByIdAndRemove to findByIdAndDelete
    res.status(200).json({
      message: "Genre deleted"
    });
  } catch (err) {
    next(err);
  }
};
