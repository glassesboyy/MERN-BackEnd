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
];

module.exports = validateMovie;
