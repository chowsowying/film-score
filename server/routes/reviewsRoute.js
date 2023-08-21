const Review = require("../models/reviewModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Movie = require("../models/movieModel");
const moongose = require("mongoose");

// Add a review
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.user = req.userId;
    const newReview = new Review(req.body);
    await newReview.save();

    //Calculate average rating and update in movie
    const movieId = new moongose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      { $match: { movie: movieId } },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingValue = averageRating[0]?.averageRating || 0;
    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingValue,
    });

    res
      .status(200)
      .json({ message: "Review added successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get all reviews by movie id or user id
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find(req.query || {})
      .populate("movie")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: reviews, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update a review
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(req.params.id);
    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

    //Calculate average rating and update in movie
    const movieId = new moongose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      { $match: { movie: movieId } },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingValue = averageRating[0]?.averageRating || 0;
    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingValue,
    });

    res
      .status(200)
      .json({ message: "Review updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Delete a review
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    //Calculate average rating and update in movie
    const movieId = new moongose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      { $match: { movie: movieId } },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingValue = averageRating[0]?.averageRating || 0;
    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingValue,
    });

    res
      .status(200)
      .json({ message: "Review deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
