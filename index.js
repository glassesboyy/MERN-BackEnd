const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const movieRoutes = require("./src/routes/movie");
const authRoutes = require("./src/routes/auth");

const app = express();

// Keamanan XSS
app.use(helmet());

// Keamanan DoS, Brute Force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/movieimages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter untuk jenis file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  cb(null, allowedTypes.includes(file.mimetype));
};

// Middleware multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter: fileFilter,
});

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Middleware untuk CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Menjadikan folder uploads dapat diakses secara publik
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route
app.use("/v1/movie", upload.single("image"), movieRoutes);
app.use("/v1/auth", authRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data || null;
  res.status(status).json({ message: message, data: data });
});

// Koneksi ke MongoDB
mongoose
  .connect(
    "mongodb+srv://glassesboyy:K1OcVGmrrKO6qtjx@cluster0.mm7cg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000 and connected to MongoDB");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
