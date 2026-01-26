const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// 📡 UPDATE LOGGED-IN USER LOCATION
router.post("/update", auth, async (req, res) => {
    try {
        const { lat, lng } = req.body;

        // ✅ Prevent invalid / 0,0 locations
        if (
            lat === undefined || lng === undefined ||
            lat === 0 || lng === 0 ||
            isNaN(lat) || isNaN(lng)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
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
            message: "Location updated successfully"
        });

    } catch (error) {
        console.error("Update User Location Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
