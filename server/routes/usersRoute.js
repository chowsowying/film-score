const User = require("../models/userModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

//Register (Public)
router.post("/register", async (req, res) => {
  try {
    //Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) throw new Error("User with this email already exists");

    //Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    //Create new user
    await User.create(req.body);

    // Send response
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Login (Public)
router.post("/login", async (req, res) => {
  try {
    //Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User with this email does not exists");

    //Check if user is active
    if (!user.isActive) throw new Error("User is not active");

    //Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Invalid Password");

    //Create Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send response
    res.status(201).json({
      message: "User Login successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get Current User (Protected)
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Update User (Protected)
router.put("/update-user", authMiddleware, async (req, res) => {
  try {
    if (req.body.newPassword && req.body.oldPassword) {
      // Get Old Password
      const oldPassword = req.body.oldPassword;

      // Get User
      const user = await User.findById(req.body._id);

      // Check if old password is correct
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) throw new Error("Invalid Old Password");

      // Hash new password
      const newPassword = await bcrypt.hash(req.body.newPassword, 10);
      req.body.password = newPassword;
    }

    // Update User
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

//Get All Users (Protected)
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
