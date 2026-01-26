const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");


// ================= ADD FAMILY MEMBER =================
router.post("/add", auth, async (req, res) => {
  try {
    let { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email required"
      });
    }

    email = email.trim().toLowerCase();
    username = username.trim();

    // user must exist
    const memberUser = await User.findOne({
      email: email,
      username: username
    });

    if (!memberUser) {
      return res.status(404).json({
        success: false,
        message: "User not registered"
      });
    }

    // cannot add yourself
    if (memberUser._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself"
      });
    }

    // prevent duplicate
    const already = await FamilyMember.findOne({
      ownerUserId: req.user.id,
      memberUserId: memberUser._id
    });

    if (already) {
      return res.status(409).json({
        success: false,
        message: "Already added"
      });
    }

    const member = new FamilyMember({
      ownerUserId: req.user.id,
      memberUserId: memberUser._id,
      username: memberUser.username,
      email: memberUser.email
    });

    await member.save();

    res.json({
      success: true,
      message: "Family member added"
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ================= GET FAMILY LOCATIONS =================
router.get("/locations", auth, async (req, res) => {
  try {

    const relations = await FamilyMember.find({
      ownerUserId: req.user.id
    }).populate(
      "memberUserId",
      "username email location lastSeen isOnline"
    );

    const members = relations
      .filter(r =>
        r.memberUserId &&
        r.memberUserId.location &&
        r.memberUserId.location.lat &&
        r.memberUserId.location.lng
      )
      .map(r => ({
        username: r.memberUserId.username,
        email: r.memberUserId.email,
        lat: r.memberUserId.location.lat,
        lng: r.memberUserId.location.lng,
        lastSeen: r.memberUserId.lastSeen,
        isOnline: r.memberUserId.isOnline
      }));

    res.json({
      success: true,
      members
    });

  } catch (err) {
    console.error("Get Family Locations Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ================= GET FAMILY LIST =================
router.get("/list", auth, async (req, res) => {
  try {

    const members = await FamilyMember.find({
      ownerUserId: req.user.id
    }).select("username email");

    res.json({
      success: true,
      members
    });

  } catch (err) {
    console.error("Get Family List Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
