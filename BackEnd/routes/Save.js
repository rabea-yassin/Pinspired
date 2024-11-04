const express = require("express");
const router = express.Router();

const db = require("../config/db");

//checking if user have saved post
router.get("/:postpath/:userId", (req, res) => {
  db.query(`SELECT * FROM save WHERE postpath = "${req.params.postpath}" and userId=${req.params.userId}  `, (err, results) => {
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

//geting all the post that user have saved
router.get("/:userId", (req, res) => {
  db.query(`SELECT * FROM save WHERE userId=${req.params.userId}  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});

//adding to database that user have saved a post
router.post("/:postpath/:userId", (req, res) => {
  db.query(
    "INSERT INTO save (userId, postpath) VALUES (?,?)",
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

//user unsaved a post
router.post("/delete/:postpath/:userId", (req, res) => {
  db.query(
    `DELETE FROM save WHERE postpath = "${req.params.postpath}" and userId=${req.params.userId}`,
    (err, myresult) => {
      if (err) {
        console.log(err);
      } else {
        res.send(myresult)
      }
    }
  );
});


module.exports = router;
