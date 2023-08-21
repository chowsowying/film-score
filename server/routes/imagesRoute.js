const router = require("express").Router();
const multer = require("multer");
const cloudinaryConfig = require("../config/cloudinaryConfig");
const authMiddleware = require("../middlewares/authMiddleware");

// Multer configuration
const storage = multer.diskStorage({
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage }).single("image"),
  async (req, res) => {
    try {
      const response = await cloudinaryConfig.uploader.upload(req.file.path, {
        folder: "film-score-images",
      });

      const imageUrl = response.secure_url;

      res.status(200).json({
        message: "Image uploaded successfully",
        data: imageUrl,
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  }
);

module.exports = router;
