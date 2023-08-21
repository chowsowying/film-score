const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    plot: {
      type: String,
      required: true,
    },
    ageRestriction: {
      type: Number,
      required: true,
    },
    hero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artists",
      required: true,
    },
    heroine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artists",
      required: true,
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artists",
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    posters: {
      type: [],
      required: false,
    },
    trailer: {
      type: String,
      required: false,
    },
    cast: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Artists",
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movies", movieSchema);
