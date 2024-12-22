const ProductionSeries = require("../models/productionSeries");
const { validationResult } = require("express-validator");

exports.createProductionSeries = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const productionSeries = new ProductionSeries({ name, description });
    const result = await productionSeries.save();

    res.status(201).json({
      message: "Production Series created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating production series",
      error: error.message
    });
  }
};

exports.getAllProductionSeries = async (req, res) => {
  try {
    const productionSeries = await ProductionSeries.find();
    res.status(200).json({
      message: "Production Series fetched successfully",
      data: productionSeries
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching production series",
      error: error.message
    });
  }
};

exports.updateProductionSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const productionSeries = await ProductionSeries.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!productionSeries) {
      return res.status(404).json({
        message: "Production Series not found"
      });
    }

    res.status(200).json({
      message: "Production Series updated successfully",
      data: productionSeries
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating production series",
      error: error.message
    });
  }
};

exports.deleteProductionSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const productionSeries = await ProductionSeries.findByIdAndDelete(id);

    if (!productionSeries) {
      return res.status(404).json({
        message: "Production Series not found"
      });
    }

    res.status(200).json({
      message: "Production Series deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting production series",
      error: error.message
    });
  }
};
