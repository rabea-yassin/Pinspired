const express = require("express");
const router = express.Router();

const db = require("../config/db");

//checking if user have liked post
router.get("/:postpath/:userId", (req, res) => {
  db.query(`SELECT * FROM likes WHERE postpath = "${req.params.postpath}" and userId=${req.params.userId}  `, (err, results) => {
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


//adding to database that user have liked a post
router.post("/:postpath/:userId", (req, res) => {
  db.query(
    "INSERT INTO likes (userId, postpath) VALUES (?,?)",
    [req.params.userId, req.params.postpath],
    (err, myresult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(myresult)
      }
    }
  );
});

//user unliked a post
router.post("/delete/:postpath/:userId", (req, res) => {
  db.query(
    `DELETE FROM likes WHERE postpath = "${req.params.postpath}" and userId=${req.params.userId}`,
    (err, myresult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(myresult)
      }
    }
  );
});


//geting the number of pepole liked this post
router.get("/count/likes/:postpath", (req, res) => {
  db.query(`SELECT COUNT(userId)
  FROM likes
  where postpath="${req.params.postpath}" `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(results[0]['COUNT(userId)'])
      res.send(results)
    }
  })
});

//geting info of all the users that liked this post 
router.get("/:postid", (req, res) => {
  db.query(`SELECT id FROM users WHERE id in (SELECT userId FROM likes WHERE postpath =  "${req.params.postid}" ) `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});


module.exports = router;
