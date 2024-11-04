const express = require("express");
const router = express.Router();

const db = require("../config/db");

//checking if user have followed the author
router.get("/:authorid/:userId", (req, res) => {
  db.query(`SELECT * FROM followingactions WHERE following = "${req.params.authorid}" and follower=${req.params.userId}  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      if (results.length === 0) {
        res.send("empty")
      }
      else {

        res.send("not-empty")
      }

    }
  });
});

//geting all the author that user have followed
router.get("/:userId", (req, res) => {
  db.query(`SELECT * FROM followingactions WHERE follower=${req.params.userId}  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});

//adding to database that user have followed a author
router.post("/:authorid/:userId", (req, res) => {
  db.query(
    "INSERT INTO followingactions (follower, following) VALUES (?,?)",
    [req.params.userId, req.params.authorid],
    (err, myresult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(myresult)
      }
    }
  );
});

//user unfollowed a post
router.post("/delete/:authorid/:userId", (req, res) => {
  db.query(
    `DELETE FROM followingactions WHERE following = "${req.params.authorid}" and follower=${req.params.userId}`,
    (err, myresult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(myresult)
      }
    }
  );
});

//geting the number of pepole follwing this user
router.get("/count/followers/:userId", (req, res) => {
  db.query(`SELECT COUNT(follower)
  FROM followingactions
  where following=${req.params.userId}  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(results[0]['COUNT(follower)'])
      res.send(results)
    }
  })
});

//geting the number of pepole  this user is following
router.get("/count/following/:userId", (req, res) => {
  db.query(`SELECT COUNT(following)
  FROM followingactions
  where follower=${req.params.userId}  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(results[0]['COUNT(following)'])
      res.send(results)
    }
  })
});



module.exports = router;
