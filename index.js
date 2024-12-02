const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
// const rateLimit = require("express-rate-limit");

const movieRoutes = require("./src/routes/movie");
const authRoutes = require("./src/routes/auth");

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });

// Middleware keamanan
app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: "Content-Type,Authorization",
  })
);

// Mengaktifkan limiter (jika sudah dibutuhkan)
// app.use(limiter);

// Konfigurasi penyimpanan file dengan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/movieimages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter file untuk jenis gambar yang diterima
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 8 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Menjadikan folder 'uploads' dapat diakses publik
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route untuk movie dan auth
app.use("/v1/movie", upload.single("image"), movieRoutes);
app.use("/v1/auth", authRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data || null;
  res.status(status).json({ message, data });
});

// Koneksi ke MongoDB
mongoose
  .connect(
    "mongodb+srv://glassesboyy:odEVljdOZzsCY73z@cluster0.mm7cg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000 and connected to MongoDB");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
