const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Temporary storage (later MongoDB)
let familyMembers = [];

// ➕ Add family member
router.post("/add", auth, (req, res) => {
    const { name, email, lat, lng } = req.body;

    if (!name || !email || lat === undefined || lng === undefined) {
        return res.status(400).json({
            success: false,
            message: "Name, email, latitude, and longitude are required"
        });
    }

    const member = {
        id: Date.now(),
        name,
        email,
        lat,
        lng,
        userId: req.user.id,
        addedAt: new Date()
    };

    familyMembers.push(member);

    res.json({
        success: true,
        message: "Family member added",
        member
    });
});

// 📋 Get family list
router.get("/list", auth, (req, res) => {
    const members = familyMembers.filter(
        m => m.userId === req.user.id
    );

    res.json({
        success: true,
        members
    });
});

module.exports = router;
