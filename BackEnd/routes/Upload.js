const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Uploading a new post
router.post("/", (req, res) => {
  const { title, description, picpath, postedby, link, categname } = req.body;

  if (!title || !description || !picpath || !postedby || !categname) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  db.query(
      "SELECT * FROM category WHERE categname = ?",
      [categname],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }

        if (result.length === 0) {
          // Add the new category if it doesn't exist
          db.query(
              "INSERT INTO category (categname) VALUES (?)",
              [categname],
              (err, myresult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send({ error: "Database error" });
                }
                insertPost();
              }
          );
        } else {
          insertPost();
        }

        function insertPost() {
          db.query(
              "INSERT INTO post (title, description, picpath, postedby, link, categname) VALUES (?, ?, ?, ?, ?, ?)",
              [title, description, picpath, postedby, link, categname],
              (err, results) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send({ error: "Database error" });
                }
                res.send(results);
              }
          );
        }
      }
  );
});

// Getting all posts
router.get("/", (req, res) => {
  db.query("SELECT * FROM post ORDER BY uploadDate DESC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Database error" });
    }
    res.send(results);
  });
});

// Getting all posts from people the user follows
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ error: "Missing userId" });
  }

  db.query(
      "SELECT * FROM post WHERE postedby IN (SELECT following FROM followingactions WHERE follower = ?) ORDER BY uploadDate DESC",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
      }
  );
});

// Getting info of a specific post
router.get("/postinfo/:postid", (req, res) => {
  const { postid } = req.params;
  if (!postid) {
    return res.status(400).send({ error: "Missing postid" });
  }

  db.query("SELECT * FROM post WHERE picpath = ?", [postid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Database error" });
    }
    res.send(results);
  });
});

// Getting all posts from a specific user
router.get("/byUser/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ error: "Missing userId" });
  }

  db.query(
      "SELECT * FROM post WHERE postedby = ? ORDER BY uploadDate DESC",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
      }
  );
});

// Getting all saved posts for a specific user
router.get("/saved/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ error: "Missing userId" });
  }

  db.query(
      "SELECT * FROM post WHERE picpath IN (SELECT postpath FROM save WHERE userId = ?)",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
      }
  );
});

// Getting all liked posts for a specific user
router.get("/liked/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ error: "Missing userId" });
  }

  db.query(
      "SELECT * FROM post WHERE picpath IN (SELECT postpath FROM likes WHERE userId = ?)",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
      }
  );
});

// Deleting a post and its related activities (likes, saves, comments)
router.delete("/:postid", (req, res) => {
  const { postid } = req.params;
  if (!postid) {
    return res.status(400).send({ error: "Missing postid" });
  }

  // Delete all activities related to the post (likes, saves, comments)
  db.query("DELETE FROM likes WHERE postpath = ?", [postid], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Database error" });
    }

    db.query("DELETE FROM save WHERE postpath = ?", [postid], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Database error" });
      }

      db.query("DELETE FROM comments WHERE postid = ?", [postid], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }

        // Finally, delete the post itself
        db.query("DELETE FROM post WHERE picpath = ?", [postid], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
          }
          res.send(results);
        });
      });
    });
  });
});

module.exports = router;
