const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genres: [{
      type: Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    }],
    year: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      ref: "User",
      required: true,
    },
    productionSeries: {
      type: Schema.Types.ObjectId,
      ref: "ProductionSeries",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
