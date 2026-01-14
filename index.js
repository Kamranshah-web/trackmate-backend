const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location"); // 🔥 ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Test endpoint
app.get("/", (req, res) => {
    res.send("TrackMate Backend Running Successfully!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes); // 🔥 ADD THIS

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
