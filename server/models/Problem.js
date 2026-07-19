const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    problemName:    { type: String, required: true, trim: true },
    pattern:        { type: String, required: true },
    difficulty:     { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    status:         { type: String, enum: ["Solved", "Unsolved", "Attempted", "Revision"], default: "Unsolved" },
    notes:          { type: String, default: "" },
    platform:       { type: String, default: "LeetCode" },
    revisionCount:  { type: Number, default: 0 },
    lastSolvedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
