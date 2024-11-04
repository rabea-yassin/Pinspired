const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

app.use(cors());
app.use(helmet()); // Add helmet for security
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests

// Import and use routes
const userRoute = require("./routes/User");
app.use("/user", userRoute);
const uploadRoute = require("./routes/Upload");
app.use("/upload", uploadRoute);
const saveRoute = require("./routes/Save");
app.use("/save", saveRoute);
const likeRoute = require("./routes/Like");
app.use("/like", likeRoute);
const followRoute = require("./routes/Follow");
app.use("/follow", followRoute);
const relatedRoute = require("./routes/Related");
app.use("/related", relatedRoute);
const updateRoute = require("./routes/Update");
app.use("/update", updateRoute);
const commentsRoute = require("./routes/Comments");
app.use("/comments", commentsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log(`My app is listening on port ${port}!`);
});
