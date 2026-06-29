const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    problemName: { type: String, required: true, trim: true },
    pattern:     { type: String, required: true },
    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    status:      { type: String, enum: ["Solved", "Unsolved"], default: "Unsolved" },
    notes:       { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
