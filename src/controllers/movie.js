const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Movie = require("../models/movie");

exports.createMovie = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("Input yang Anda masukkan tidak valid!");
    err.statusCode = 400;
    err.data = error.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image harus diisi!");
    err.statusCode = 422;
    throw err;
  }

  const { title, description, genre, year } = req.body;

  const image = req.file.path
    .replace(/\\/g, "/")
    .replace("C:/laragon/www/MERN/api-zul/", "");

  const movie = new Movie({
    title: title,
    image: image,
    description: description,
    genre: genre,
    year: year,
    author: {
      uid: 1,
      name: "Teguh Surya Zulfikar",
    },
  });

  movie
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Movie Created!",
        data: {
          ...result._doc,
          image: `http://localhost:4000/${image}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!",
        data: err,
      });
    });
};

exports.getAllMovie = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  let totalItems;

  Movie.countDocuments()
    .then((count) => {
      totalItems = count;
      return Movie.find()
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
    })
    .then((result) => {
      res.status(200).json({
        message: "Get All Movie Success!",
        data: result,
        total_items: totalItems,
        current_page: parseInt(page),
        limit: parseInt(limit),
        // total_page: Math.ceil(totalItems / limit),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMovieById = (req, res, next) => {
  const id = req.params.id;
  Movie.findById(id)
    .then((result) => {
      if (!result) {
        const err = new Error("Movie Not Found!");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "Get Movie By Id Success!",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateMovie = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("Input yang Anda masukkan tidak valid!");
    err.statusCode = 400;
    err.data = error.array();
    throw err;
  }

  const movieId = req.params.id;
  const { title, description, genre, year } = req.body;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const err = new Error("Film tidak ditemukan!");
        err.statusCode = 404;
        throw err;
      }

      if (req.file) {
        const image = req.file.path
          .replace(/\\/g, "/")
          .replace("C:/laragon/www/MERN/api-zul/", "");
        movie.image = image;
      }

      movie.title = title;
      movie.description = description;
      movie.genre = genre;
      movie.year = year;

      return movie.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Movie Updated!",
        data: {
          ...result._doc,
          image: req.file
            ? `http://localhost:4000/${result.image}`
            : result.image,
        },
      });
    })
    .catch((err) => {
      res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong!",
        data: err,
      });
    });
};

exports.deleteMovie = (req, res, next) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const err = new Error("Film tidak ditemukan!");
        err.statusCode = 404;
        throw err;
      }

      const imagePath = movie.image;
      return Movie.findByIdAndDelete(movieId).then(() => {
        removeImage(imagePath);
      });
    })
    .then(() => {
      res.status(200).json({
        message: "Movie Deleted!",
      });
    })
    .catch((err) => {
      res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong!",
        data: err,
      });
    });
};

const removeImage = (filePath) => {
  const fullPath = path.join(__dirname, "..", "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error removing image:", err);
    } else {
      console.log("Image removed successfully:", fullPath);
    }
  });
};
