const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Checking if the user has liked a post
router.get("/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "SELECT * FROM likes WHERE postpath = ? AND userId = ?",
      [postpath, userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results.length === 0 ? "empty" : "not-empty");
      }
  );
});

// Adding to the database that a user has liked a post
router.post("/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "INSERT INTO likes (userId, postpath) VALUES (?, ?)",
      [userId, postpath],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.status(201).send(result);
      }
  );
});

// User unliked a post
router.post("/delete/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "DELETE FROM likes WHERE postpath = ? AND userId = ?",
      [postpath, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(result);
      }
  );
});

// Getting the number of people who liked this post
router.get("/count/likes/:postpath", (req, res) => {
  const { postpath } = req.params;

  if (!postpath) {
    return res.status(400).send({ error: "Missing postpath parameter" });
  }

  db.query(
      "SELECT COUNT(userId) AS likeCount FROM likes WHERE postpath = ?",
      [postpath],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results[0]);
      }
  );
});

// Getting info of all users who liked this post
router.get("/:postid", (req, res) => {
  const { postid } = req.params;

  if (!postid) {
    return res.status(400).send({ error: "Missing postid parameter" });
  }

  db.query(
      "SELECT id FROM users WHERE id IN (SELECT userId FROM likes WHERE postpath = ?)",
      [postid],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
      }
  );
});

module.exports = router;
