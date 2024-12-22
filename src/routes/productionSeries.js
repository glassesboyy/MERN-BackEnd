const express = require("express");
const router = express.Router();
const productionSeriesController = require("../controllers/productionSeries");
const { body } = require("express-validator");

const validateProductionSeries = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("description").not().isEmpty().withMessage("Description is required")
];

router.post("/", validateProductionSeries, productionSeriesController.createProductionSeries);
router.get("/", productionSeriesController.getAllProductionSeries);
router.put("/:id", validateProductionSeries, productionSeriesController.updateProductionSeries);
router.delete("/:id", productionSeriesController.deleteProductionSeries);

module.exports = router;
