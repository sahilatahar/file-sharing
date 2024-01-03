const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const fileRoutes = require("./routes/file");
const showRoutes = require("./routes/show");
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

connectDB();

// Template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/file', fileRoutes);
app.use('/file', showRoutes);

app.get('/', (req, res) => {
    return res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});