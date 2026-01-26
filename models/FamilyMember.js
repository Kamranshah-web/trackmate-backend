const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
    ownerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    memberUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    username: {           // ✅ changed from 'name' to 'username'
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    lat: {
        type: Number,
        default: null
    },

    lng: {
        type: Number,
        default: null
    },

    lastUpdated: {
        type: Date,
        default: null
    }
});

module.exports =
    mongoose.models.FamilyMember ||
    mongoose.model("FamilyMember", familyMemberSchema);
