const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateProfile, getLeetCodeStats } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/profile", updateProfile);
router.get("/leetcode/:username", getLeetCodeStats);

module.exports = router;

