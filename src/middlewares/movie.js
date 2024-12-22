const { body } = require("express-validator");

const validateMovie = [
  body("title").not().isEmpty().withMessage("Title harus diisi!"),
  body("description")
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .withMessage("Description harus diisi!, Minimal 10 karakter!"),
  body("genres")
    .custom((value) => {
      try {
        // Jika input adalah string JSON
        if (typeof value === 'string') {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        }
        
        // Jika input adalah single ID
        if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
          return true;
        }

        // Jika input adalah array (dari form-data dengan genres[])
        if (Array.isArray(value)) {
          return true;
        }

        return false;
      } catch (err) {
        return false;
      }
    })
    .withMessage("Format genres tidak valid!")
    .notEmpty()
    .withMessage("Minimal harus memilih satu genre!"),
  body("year")
    .not()
    .isEmpty()
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year harus diisi dengan 4 angka!"),
  body("productionSeries")
    .not()
    .isEmpty()
    .withMessage("Production Series harus dipilih!")
    .custom((value) => {
      try {
        // Jika input adalah string JSON
        if (typeof value === 'string') {
          // Cek apakah valid MongoDB ObjectId
          if (value.match(/^[0-9a-fA-F]{24}$/)) {
            return true;
          }
          // Jika dalam format JSON string, parse dulu
          const parsed = JSON.parse(value);
          if (typeof parsed === 'string' && parsed.match(/^[0-9a-fA-F]{24}$/)) {
            return true;
          }
        }
        return false;
      } catch (err) {
        return false;
      }
    })
    .withMessage("Production Series ID tidak valid!"),
];

module.exports = validateMovie;
