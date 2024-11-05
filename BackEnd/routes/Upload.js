const express = require("express");
const router = express.Router();

const db = require("../config/db");

//uploading new post
router.post("/", (req, res) => {
  const { title, description, picpath, postedby, link, categname } = req.body;

  console.log("Received upload request with data:", req.body);

  db.query(
      `SELECT * FROM category WHERE categname = "${categname}"`, (err, result) => {
        if (err) {
          console.error("Error fetching category:", err);
          return res.status(500).send("Error fetching category");
        }

        console.log("Category fetch result:", result);

        if (result.length === 0) {
          console.log("Category not found. Adding new category:", categname);
          db.query(
              "INSERT INTO category (categname) VALUES (?)",
              [categname],
              (err, categoryResult) => {
                if (err) {
                  console.error("Error inserting category:", err);
                  return res.status(500).send("Error inserting category");
                }
                console.log("Category inserted:", categoryResult);
              }
          );
        }

        console.log("Inserting post into database...");

        db.query(
            "INSERT INTO post (title, description, picpath, postedby, link, categname) VALUES (?, ?, ?, ?, ?, ?);",
            [title, description, picpath, postedby, link, categname],
            (err, postResult) => {
              if (err) {
                console.error("Error inserting post:", err);
                return res.status(500).send("Failed to save post to the database");
              }
              console.log("Post saved successfully:", postResult);
              res.status(200).send("Post saved successfully");
            }
        );
      }
  );
});

//geting all the posts
router.get("/", (req, res) => {
  db.query("SELECT * FROM post ORDER BY uploadDate DESC", (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  });
});

//geting all the posts form pepole user follow
router.get("/:userId", (req, res) => {
  db.query(`SELECT * FROM post where postedby in (SELECT following FROM followingactions WHERE follower = ${req.params.userId} ) ORDER BY uploadDate DESC`, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  });
});

//geting info of a specific post
router.get("/postinfo/:postid", (req, res) => {
  const postid = req.params.postid;
  db.query("SELECT * FROM post WHERE picpath = ?;",
    postid, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      res.send(results);
    });
});

//geting all the posts from specific user
router.get("/byUser/:userId", (req, res) => {
  db.query(`SELECT * FROM post WHERE postedby=${req.params.userId} ORDER BY uploadDate DESC `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});

//geting all the saved posts from specific user
router.get("/saved/:userId", (req, res) => {
  db.query(`select * FROM post where picpath in (SELECT postpath FROM save WHERE userId = ${req.params.userId} )  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});

//geting all the liked posts from specific user
router.get("/liked/:userId", (req, res) => {
  db.query(`select * from post where picpath in (SELECT postpath FROM likes WHERE userId = ${req.params.userId} )  `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});

// deleting a post
router.delete("/:postid", (req, res) => {
  // befor deleting a post we should delete all the activetes that are related to this post ( likes, saves)
  db.query(`DELETE FROM likes WHERE postpath = "${req.params.postid}"`, (err, likeresults) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(likeresults);
      db.query(`DELETE FROM save WHERE postpath = "${req.params.postid}"`, (err, saveresults) => {
        if (err) {
          console.log(err);
        }
        else {
          db.query(`DELETE FROM comments WHERE postid = "${req.params.postid}"`, (err, saveresults) => {
            if (err) {
              console.log(err);
            }
            else {
              db.query(`DELETE FROM post WHERE picpath = "${req.params.postid}"`, (err, results) => {
                if (err) {
                  console.log(err);
                }
                else { res.send(results) }
              })
            }
          })
        }
      })
    }
  })

});


module.exports = router;
