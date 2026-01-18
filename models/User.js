const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    // 🔥 NEW FIELDS
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    isOnline: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
