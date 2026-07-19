const User = require("../models/User");
const nodemailer = require("nodemailer");
const { fetchLeetCodeUserData } = require("../utils/leetcodeService");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = await User.create({ name, email, password });
    
    // Dispatch SMTP registration confirmation email in background
    try {
      const rawPass = process.env.EMAIL_PASS || "nwhg bbwz skim dreo";
      // Strip double quotes if present, and remove all spaces
      const cleanPass = rawPass.replace(/["']/g, "").replace(/\s+/g, "");

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || "divyanshsingh74178@gmail.com",
          pass: cleanPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `"DSA Pattern Tracker" <${process.env.EMAIL_USER || "divyanshsingh74178@gmail.com"}>`,
        to: newUser.email,
        subject: "Registered Successfully",
        text: "you have been registered",
      };

      transporter.sendMail(mailOptions)
        .then(() => console.log(`✅ Registration email sent successfully to ${newUser.email}`))
        .catch((error) => console.error("❌ Error sending registration email:", error.message));
    } catch (emailError) {
      console.error("❌ Error initializing SMTP transporter:", emailError.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        leetcodeUsername: newUser.leetcodeUsername || "",
        targetCompany: newUser.targetCompany || "FAANG / Top Tech",
        dailyGoal: newUser.dailyGoal || 2,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername || "",
        targetCompany: user.targetCompany || "FAANG / Top Tech",
        dailyGoal: user.dailyGoal || 2,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, name, leetcodeUsername, targetCompany, dailyGoal } = req.body;
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, leetcodeUsername, targetCompany, dailyGoal },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        leetcodeUsername: updatedUser.leetcodeUsername || "",
        targetCompany: updatedUser.targetCompany || "FAANG / Top Tech",
        dailyGoal: updatedUser.dailyGoal || 2,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeetCodeStats = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "LeetCode username is required" });
    }

    const stats = await fetchLeetCodeUserData(username);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch LeetCode data" });
  }
};

module.exports = { registerUser, loginUser, updateProfile, getLeetCodeStats };

