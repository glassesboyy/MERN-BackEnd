const { body } = require("express-validator");

const validateMovie = [
  body("title").not().isEmpty().withMessage("Title harus diisi!"),
  body("description")
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .withMessage("Description harus diisi!, Minimal 10 karakter!"),
  body("genre")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Genre harus diisi dan string!"),
  body("year")
    .not()
    .isEmpty()
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year harus diisi dengan 4 angka!"),
];

module.exports = validateMovie;
