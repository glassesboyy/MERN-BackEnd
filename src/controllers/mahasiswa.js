const { validationResult } = require("express-validator");
const Mahasiswa = require("../models/mahasiswa");

exports.createMahasiswa = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const existingMahasiswa = await Mahasiswa.findOne({
      $or: [{ nim: req.body.nim }, { email: req.body.email }],
    });

    if (existingMahasiswa) {
      const error = new Error("NIM atau email sudah terdaftar");
      error.statusCode = 409;
      throw error;
    }

    const mahasiswa = new Mahasiswa({
      nim: req.body.nim,
      nama: req.body.nama,
      jurusan: req.body.jurusan,
      semester: req.body.semester,
      email: req.body.email,
    });

    const result = await mahasiswa.save();
    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      data: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllMahasiswa = async (req, res, next) => {
  try {
    const mahasiswa = await Mahasiswa.find().sort({ nim: 1 });
    res.status(200).json({
      message: "Berhasil mengambil data mahasiswa",
      data: mahasiswa,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMahasiswaById = async (req, res, next) => {
  try {
    const mahasiswa = await Mahasiswa.findById(req.params.id);
    if (!mahasiswa) {
      const error = new Error("Mahasiswa tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Mahasiswa ditemukan",
      data: mahasiswa,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchByNIM = async (req, res, next) => {
  try {
    const { nim } = req.query;
    if (!nim) {
      const error = new Error("NIM harus disertakan");
      error.statusCode = 400;
      throw error;
    }

    const mahasiswa = await Mahasiswa.findOne({ nim });
    if (!mahasiswa) {
      const error = new Error("Mahasiswa tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Mahasiswa ditemukan",
      data: mahasiswa,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateMahasiswa = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const mahasiswa = await Mahasiswa.findById(req.params.id);
    if (!mahasiswa) {
      const error = new Error("Mahasiswa tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    // Ini dicek apakah ada mahasiswa lain dengan NIM atau email yang sama
    const existingMahasiswa = await Mahasiswa.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ nim: req.body.nim }, { email: req.body.email }] },
      ],
    });

    if (existingMahasiswa) {
      const error = new Error("NIM atau email sudah terdaftar");
      error.statusCode = 409;
      throw error;
    }

    mahasiswa.nim = req.body.nim;
    mahasiswa.nama = req.body.nama;
    mahasiswa.jurusan = req.body.jurusan;
    mahasiswa.semester = req.body.semester;
    mahasiswa.email = req.body.email;

    const result = await mahasiswa.save();
    res.status(200).json({
      message: "Mahasiswa berhasil diupdate",
      data: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteMahasiswa = async (req, res, next) => {
  try {
    const mahasiswa = await Mahasiswa.findById(req.params.id);
    if (!mahasiswa) {
      const error = new Error("Mahasiswa tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    await Mahasiswa.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Mahasiswa berhasil dihapus",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
