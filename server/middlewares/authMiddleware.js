const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //Check if token exists
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new Error("Access Denied");

    //Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};
