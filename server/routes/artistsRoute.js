const Artists = require("../models/artistsModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

//Add New Artist
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.createdBy = req.userId; //Get userId from authMiddleware
    await Artists.create(req.body);
    res.status(201).json({
      message: "Artist added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get All Artists
router.get("/", authMiddleware, async (req, res) => {
  try {
    const artists = await Artists.find().sort({ createdAt: -1 });
    res.status(200).json({ data: artists, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get Single Artist by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const artist = await Artists.findById(req.params.id);
    res.status(200).json({ data: artist, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Update Artist
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedArtist = await Artists.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Artist updated successfully",
      success: true,
      data: updatedArtist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Delete Artist
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Artists.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Artist deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});
module.exports = router;
