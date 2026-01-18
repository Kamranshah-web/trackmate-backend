require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");
const familyRoutes = require("./routes/family");

const app = express(); // App must be initialized BEFORE using it

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// ---------------- Connect MongoDB ----------------
connectDB();

// ---------------- Test endpoint ----------------
app.get("/", (req, res) => {
    res.send("TrackMate Backend Running Successfully!");
});

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/family", familyRoutes); // ✅ AddFamily & GetFamilyList

// ---------------- Dynamic Port for Render ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
