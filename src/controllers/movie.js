const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Movie = require("../models/movie");
const Genre = require("../models/genre");

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

  const { title, description, genres, year, productionSeries } = req.body;

  const image = req.file.path.replace(/\\/g, "/");

  let parsedGenres;
  try {
    if (typeof req.body.genres === 'string') {
      try {
        parsedGenres = JSON.parse(req.body.genres);
      } catch {
        if (req.body.genres.match(/^[0-9a-fA-F]{24}$/)) {
          parsedGenres = [req.body.genres];
        } else {
          throw new Error("Format genres tidak valid!");
        }
      }
    } else if (Array.isArray(req.body.genres)) {
      parsedGenres = req.body.genres;
    } else {
      throw new Error("Format genres tidak valid!");
    }
  } catch (err) {
    const error = new Error(err.message || "Format genres tidak valid!");
    error.statusCode = 400;
    throw error;
  }

  // Parse productionSeries ID
  let parsedProductionSeries;
  try {
    if (typeof productionSeries === 'string') {
      try {
        const parsed = JSON.parse(productionSeries);
        parsedProductionSeries = parsed;
      } catch {
        // Jika bukan JSON valid, gunakan value langsung
        parsedProductionSeries = productionSeries;
      }
    }
  } catch (err) {
    const error = new Error("Format Production Series tidak valid!");
    error.statusCode = 400;
    throw error;
  }

  const movie = new Movie({
    title: title,
    image: image,
    description: description,
    genres: parsedGenres,
    year: year,
    productionSeries: parsedProductionSeries,
    author: {
      uid: 1,
      name: "Teguh Surya Zulfikar",
    },
  });

  let createdMovie;

  movie
    .save()
    .then((result) => {
      createdMovie = result;
      // Update all referenced genres to include this movie
      const genreUpdates = parsedGenres.map(genreId => 
        Genre.findByIdAndUpdate(
          genreId,
          { $push: { movies: result._id } },
          { new: true }
        )
      );
      return Promise.all(genreUpdates);
    })
    .then(() => {
      return createdMovie.populate('genres');
    })
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

exports.getAllMovie = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const genre = req.query.genre;
    const search = req.query.search;
    const year = req.query.year;
    const productionSeries = req.query.productionSeries;

    // Build query
    let query = {};
    
    // Filter by genre if specified
    if (genre) {
      query.genres = genre;
    }

    // Filter by year if specified
    if (year) {
      query.year = year;
    }

    // Filter by productionSeries if specified
    if (productionSeries) {
      query.productionSeries = productionSeries;
    }

    // Search by title if specified
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Get total count for pagination
    const totalItems = await Movie.countDocuments(query);

    // Get filtered movies with populated genres and productionSeries
    const movies = await Movie.find(query)
      .populate('genres')
      .populate('productionSeries')  // Add this line to populate productionSeries
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedMovies = movies.map(movie => ({
      ...movie._doc,
      image: `http://localhost:4000/${movie.image}`
    }));

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      message: "Get All Movie Success!",
      data: formattedMovies,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.getMovieById = (req, res, next) => {
  const id = req.params.id;
  Movie.findById(id)
    .populate('genres')
    .then((result) => {
      if (!result) {
        const err = new Error("Movie Not Found!");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "Get Movie By Id Success!",
        data: {
          ...result._doc,
          image: `http://localhost:4000/${result.image}`
        },
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
  const { title, description, genres, year } = req.body;

  let oldGenres = [];
  let updatedMovie;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const err = new Error("Film tidak ditemukan!");
        err.statusCode = 404;
        throw err;
      }

      oldGenres = movie.genres;
      
      if (req.file) {
        const image = req.file.path
          .replace(/\\/g, "/")
          .replace("C:/laragon/www/MERN/api-zul/", "");
        movie.image = image;
      }

      movie.title = title;
      movie.description = description;
      movie.genres = genres;
      movie.year = year;

      return movie.save();
    })
    .then((result) => {
      updatedMovie = result;
      // Remove movie from old genres
      const removeFromOldGenres = oldGenres.map(genreId =>
        Genre.findByIdAndUpdate(
          genreId,
          { $pull: { movies: movieId } }
        )
      );
      return Promise.all(removeFromOldGenres);
    })
    .then(() => {
      // Add movie to new genres
      const addToNewGenres = genres.map(genreId =>
        Genre.findByIdAndUpdate(
          genreId,
          { $addToSet: { movies: movieId } }
        )
      );
      return Promise.all(addToNewGenres);
    })
    .then(() => {
      res.status(200).json({
        message: "Movie Updated!",
        data: {
          ...updatedMovie._doc,
          image: req.file
            ? `http://localhost:4000/${updatedMovie.image}`
            : updatedMovie.image,
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
      const genres = movie.genres;

      // Remove movie reference from all associated genres
      const genreUpdates = genres.map(genreId =>
        Genre.findByIdAndUpdate(
          genreId,
          { $pull: { movies: movieId } }
        )
      );

      return Promise.all([
        Movie.findByIdAndDelete(movieId),
        ...genreUpdates
      ]).then(() => {
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
