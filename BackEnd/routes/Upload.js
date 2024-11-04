const express = require("express");
const router = express.Router();

const db = require("../config/db");

//uploading new post 
router.post("/", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const picpath = req.body.picpath;
  const postedby = req.body.postedby;
  const link = req.body.link;
  const categname = req.body.categname;


  db.query(
    `SELECT * FROM category WHERE categname = "${req.body.categname}"`, (err, result) => {
      if (err) {
        console.log(err);
        throw (err)
      } else {
        console.log("result" + JSON.stringify(result))
        if (result.length === 0) {
          db.query(
            //we have to add this new category
            "INSERT INTO category (categname) VALUES (?)",
            [categname],
            (err, myresult) => {
              if (err) {
                console.log(err);
                throw (err)
              }
            }
          );
          // after that we are going to add the post info
          db.query(
            "INSERT INTO post (title, description, picpath, postedby,link,categname) VALUES (?, ?, ?, ?, ?, ?);",
            [title, description, picpath, postedby, link, categname],
            (err, results) => {
              console.log(err);
              res.send(results);
            }
          );

        }
        else {
          //we are going to add the post information dirctly
          db.query(
            "INSERT INTO post (title, description, picpath, postedby,link,categname) VALUES (?, ?, ?, ?, ?, ?);",
            [title, description, picpath, postedby, link, categname],
            (err, results) => {
              console.log(err);
              res.send(results);
            }
          );
        }
      };
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
