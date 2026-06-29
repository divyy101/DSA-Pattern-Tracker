const User = require("../models/User");
const nodemailer = require("nodemailer");

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
      user: { name: newUser.name, email: newUser.email },
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
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
