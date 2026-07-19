const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    leetcodeUsername: { type: String, default: "", trim: true },
    targetCompany: { type: String, default: "FAANG / Top Tech", trim: true },
    dailyGoal: { type: Number, default: 2 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
