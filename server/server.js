require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./middleware/logger");
const problemRoutes = require("./routes/problemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Myproject";

// Serverless-friendly Mongoose connection handler
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

// Database connection middleware
const dbConnectionMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed. Please try again later." });
  }
};

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(dbConnectionMiddleware);

app.use("/problems", problemRoutes);
app.use("/users", userRoutes);
app.get("/", (req, res) => res.send("DSA Pattern Tracker API is running!"));

// Start local listener only if running locally
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  }).catch((error) => console.error("❌ Local database bootstrap failed:", error.message));
}

module.exports = app;
