const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mahasiswaSchema = new Schema(
  {
    nim: {
      type: String,
      required: true,
      unique: true,
    },
    nama: {
      type: String,
      required: true,
    },
    jurusan: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mahasiswa", mahasiswaSchema);
