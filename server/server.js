require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./middleware/logger");
const problemRoutes = require("./routes/problemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/problems", problemRoutes);
app.use("/users", userRoutes);
app.get("/", (req, res) => res.send("DSA Pattern Tracker API is running!"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Myproject";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB connection failed:", error.message));

module.exports = app;
