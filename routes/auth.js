const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ---------------- Signup ----------------
router.post("/signup", async (req, res) => {
    try {
        let { email, password, username, phone } = req.body;

        if (!email || !password || !username || !phone) {
            return res
                .status(400)
                .json({ success: false, message: "All fields required" });
        }

        // 🔥 NORMALIZE EMAIL
        email = email.trim().toLowerCase();

        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "Email already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPass,
            username,
            phone
        });

        await newUser.save();

        return res.json({ success: true, message: "Signup successful" });

    } catch (err) {
        console.error("Signup Error:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------- Login ----------------
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email and password required" });
        }

        // 🔥 NORMALIZE EMAIL
        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // 🔑 Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,  // Ensure JWT_SECRET is set in env
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Login successful!",
            token
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
