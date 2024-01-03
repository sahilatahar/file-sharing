const mongoose = require('mongoose');

const connectDB = async () => {

    mongoose.connect(process.env.MONGO_URI);

    const connection = mongoose.connection;

    connection.once("open", () => {
        console.log("Database connected successfully");
    });

    connection.on("error", (err) => {
        console.log("Database connection failed");
        process.exit();
    });
}

module.exports = connectDB;