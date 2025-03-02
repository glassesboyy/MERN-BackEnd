const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const mahasiswaController = require("../controllers/mahasiswa");

const validationRules = [
  body("nim")
    .trim()
    .not()
    .isEmpty()
    .withMessage("NIM harus diisi!")
    .isLength({ min: 8, max: 12 })
    .withMessage("NIM harus antara 8-12 karakter"),
  body("nama").trim().not().isEmpty().withMessage("Nama harus diisi!"),
  body("jurusan").trim().not().isEmpty().withMessage("Jurusan harus diisi!"),
  body("semester")
    .isInt({ min: 1, max: 14 })
    .withMessage("Semester harus antara 1-14"),
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid!")
    .normalizeEmail(),
];

router.post("/", validationRules, mahasiswaController.createMahasiswa);
router.get("/", mahasiswaController.getAllMahasiswa);
router.get("/search", mahasiswaController.searchByNIM);
router.get("/:id", mahasiswaController.getMahasiswaById);
router.put("/:id", validationRules, mahasiswaController.updateMahasiswa);
router.delete("/:id", mahasiswaController.deleteMahasiswa);

module.exports = router;
