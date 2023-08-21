const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());

// User Routes
const userRoute = require("./routes/usersRoute");
app.use("/api/user", userRoute);

// Artist Routes
const artistRoute = require("./routes/artistsRoute");
app.use("/api/artists", artistRoute);

// Images Routes
const imagesRoute = require("./routes/imagesRoute");
app.use("/api/images", imagesRoute);

// Movies Routes
const moviesRoute = require("./routes/moviesRoute");
app.use("/api/movies", moviesRoute);

// Reviews Routes
const reviewsRoute = require("./routes/reviewsRoute");
app.use("/api/reviews", reviewsRoute);

// Filters Routes
const filtersRoute = require("./routes/filtersRoute");
app.use("/api/filters", filtersRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
