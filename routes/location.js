const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// 🔒 Update user location + lastSeen
router.post("/update", auth, async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: "Latitude and Longitude required"
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.location = { lat, lng };
        user.lastSeen = new Date();
        user.isOnline = true;

        await user.save();

        res.json({
            success: true,
            message: "Location updated",
            lat,
            lng,
            lastSeen: user.lastSeen
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
