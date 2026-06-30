const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./middleware/logger");
const problemRoutes = require("./routes/problemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const PRIMARY_MONGO_URI = process.env.MONGO_URI;
const FALLBACK_MONGO_URI = "mongodb://127.0.0.1:27017/Myproject"; // Local MongoDB URI for dev fallback

// Serverless-friendly Mongoose connection handler
const connectDB = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) return;

  // If currently connecting, wait for connection to establish to avoid buffering timeouts
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ MongoDB connection in progress, waiting...");
    await new Promise((resolve) => {
      const cleanup = () => {
        mongoose.connection.removeListener("connected", onConnected);
        mongoose.connection.removeListener("error", onError);
      };
      const onConnected = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        resolve(); // Resolve to fall through and let new attempt or handler deal with it
      };
      mongoose.connection.once("connected", onConnected);
      mongoose.connection.once("error", onError);
    });
    if (mongoose.connection.readyState === 1) return;
  }

  // Only use local fallback URI when not in production
  const mongoUris = [PRIMARY_MONGO_URI];
  if (process.env.NODE_ENV !== "production") {
    mongoUris.push(FALLBACK_MONGO_URI);
  }
  const filteredUris = mongoUris.filter(Boolean);

  try {
    for (const mongoUri of filteredUris) {
      try {
        const maskedUri = mongoUri.replace(/:([^@]+)@/, ":****@");
        console.log(`🔌 Attempting to connect to MongoDB: ${maskedUri}`);
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connected to MongoDB");
        return;
      } catch (connectionError) {
        console.error("❌ MongoDB connection attempt failed:", connectionError.message);
      }
    }

    throw new Error("Unable to connect to MongoDB using any configured URI");
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
  let server;
  const startServer = (targetPort, retriesLeft = 5) => {
    server = app.listen(targetPort, () => {
      console.log(`🚀 Server running on http://localhost:${targetPort}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        if (retriesLeft > 0) {
          console.warn(`⚠️ Port ${targetPort} is in use, retrying in 1s... (${retriesLeft} retries left)`);
          try {
            server.close();
          } catch (e) {}
          setTimeout(() => {
            startServer(targetPort, retriesLeft - 1);
          }, 1000);
        } else {
          console.error(`\n❌ Error: Port ${targetPort} is already in use after multiple retries.`);
          if (process.platform === "win32") {
            console.error(`👉 To free the port on Windows, run the following command in PowerShell:`);
            console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${targetPort}).OwningProcess -Force\n`);
          } else {
            console.error(`👉 To free the port on Mac/Linux, run:`);
            console.error(`   kill -9 $(lsof -t -i:${targetPort})\n`);
          }
          process.exit(1);
        }
      } else {
        console.error("❌ Server startup error:", error.message);
      }
    });
  };

  startServer(PORT);

  // Attempt background database connection
  connectDB().catch((error) => {
    console.error("❌ Local database bootstrap failed:", error.message);
  });
}

module.exports = app;
