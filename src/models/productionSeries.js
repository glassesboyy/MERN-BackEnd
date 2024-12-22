const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productionSeriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductionSeries", productionSeriesSchema);
