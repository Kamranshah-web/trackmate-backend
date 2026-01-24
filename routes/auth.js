const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ---------------- Signup ----------------
router.post("/signup", async (req, res) => {
    try {
        console.log("SIGNUP_REQ:", req.body); // 🔹 Debug: request aa rahi hai ya nahi

        let { email, password, username, phone } = req.body;

        if (!email || !password || !username || !phone) {
            console.log("SIGNUP_FAIL: Missing fields");
            return res
                .status(400)
                .json({ success: false, message: "All fields required" });
        }

        // 🔥 NORMALIZE EMAIL
        email = email.trim().toLowerCase();

        const existing = await User.findOne({ email });
        if (existing) {
            console.log("SIGNUP_FAIL: Email exists", email);
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

        console.log("SIGNUP_SUCCESS:", { email, username }); // 🔹 Debug: signup success
        return res.json({ success: true, message: "Signup successful" });

    } catch (err) {
        console.error("SIGNUP_ERROR:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------- Login ----------------
router.post("/login", async (req, res) => {
    try {
        console.log("LOGIN_REQ:", req.body); // 🔹 Debug: login request

        let { email, password } = req.body;

        if (!email || !password) {
            console.log("LOGIN_FAIL: Missing email or password");
            return res
                .status(400)
                .json({ success: false, message: "Email and password required" });
        }

        // 🔥 NORMALIZE EMAIL
        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            console.log("LOGIN_FAIL: User not found", email);
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("LOGIN_FAIL: Wrong password", email);
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // 🔑 Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("LOGIN_SUCCESS:", { email }); // 🔹 Debug: login success
        return res.json({
            success: true,
            message: "Login successful!",
            token
        });

    } catch (error) {
        console.error("LOGIN_ERROR:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
