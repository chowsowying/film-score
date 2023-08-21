const Movie = require("../models/movieModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

//Add New Movie
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.createdBy = req.userId; //Get userId from authMiddleware
    await Movie.create(req.body);
    res.status(200).json({
      message: "Movie added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get All Movies
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filters = req.query;
    const query = {};
    if (filters.genre) {
      query.genre = filters.genre;
    }
    if (filters.language) {
      query.language = filters.language;
    }
    const movies = await Movie.find(query)
      .populate("hero")
      .populate("heroine")
      .populate("director")
      .populate("createdBy")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: movies, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get Single Movie by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("hero")
      .populate("heroine")
      .populate("director")
      .populate("createdBy")
      .populate("cast");
    res.status(200).json({ data: movie, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Update Movie
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send({
      message: "Movie updated successfully",
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Delete Movie
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndDelete(req.params.id, {
      new: true,
    });

    res.send({
      message: "Movie deleted successfully",
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get movies by artist id
router.get("/get-movies-by-artist/:id", async (req, res) => {
  try {
    const artistId = req.params.id;
    const movies = await Movie.find({
      $or: [
        { hero: artistId },
        { heroine: artistId },
        { director: artistId },
        { cast: { $in: [artistId] } },
      ],
    });
    res.status(200).json({ data: movies, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
