const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://trackmate:trackmate123@cluster7.kpjjhcx.mongodb.net/trackmateDB?retryWrites=true&w=majority");
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
