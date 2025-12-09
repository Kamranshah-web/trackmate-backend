const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Test endpoint
app.get("/", (req, res) => {
    res.send("TrackMate Backend Running Successfully!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
