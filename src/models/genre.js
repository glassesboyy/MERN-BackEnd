const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    movies: [{
      type: Schema.Types.ObjectId,
      ref: "Movie"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Genre", genreSchema);
