const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// 🔒 Protected API – JWT required
router.post("/update", auth, (req, res) => {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res
            .status(400)
            .json({ success: false, message: "Latitude and Longitude required" });
    }

    return res.json({
        success: true,
        message: "Location received successfully",
        userId: req.user.id,
        lat,
        lng
    });
});

module.exports = router;
