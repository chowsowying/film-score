const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
