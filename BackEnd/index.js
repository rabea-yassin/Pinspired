const express = require('express');
const app = express();
const cors = require('cors');



app.use(cors());
// app.use((req, res, next) => {
//   console.log("path" + req.path + "<--")
//   next();
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoute = require("./routes/User");
app.use("/user", userRoute);
const uploadRoute = require("./routes/Upload");
app.use("/upload", uploadRoute);
const SaveRoute = require("./routes/Save");
app.use("/save", SaveRoute);
const LikeRoute = require("./routes/Like");
app.use("/like", LikeRoute);
const FollowRoute = require("./routes/Follow");
app.use("/follow", FollowRoute);
const RelatedRoute = require("./routes/Related");
app.use("/Related", RelatedRoute);
const UpdateRoute = require("./routes/Update");
app.use("/Update", UpdateRoute);
const CommentsRoute = require("./routes/Comments");
app.use("/comments", CommentsRoute);


const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`My app is listening on port ${port}!`);
});

