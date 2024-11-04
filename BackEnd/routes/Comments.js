const express = require("express");
const router = express.Router();

const db = require("../config/db");


// adding new comment
router.post("/add", (req, res) => {
    console.log(JSON.stringify(req.body))
    const comment = req.body.comment;
    const postid = req.body.postid;
    const userid = req.body.userid;
    db.query(
        "INSERT INTO comments (comment, postid, userid ) VALUES (?,?,?)",
        [comment, postid, userid],
        (err, myresult) => {
          if (err) {
            console.log(err);
          } 
          res.send(myresult)
        }
      );

});
//get all the comments to aspecfic post
router.get("/:postid", (req, res) => {
    db.query(`SELECT * FROM comments where postid = "${req.params.postid}" 
       ORDER BY date DESC `, (err, results) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(results)
      }
    })
  });

module.exports = router;
