const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Checking if user has followed the author
router.get("/:authorid/:userId", (req, res) => {
  const { authorid, userId } = req.params;

  if (!authorid || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "SELECT * FROM followingactions WHERE following = ? AND follower = ?",
      [authorid, userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results.length === 0 ? "empty" : "not-empty");
      }
  );
});

// Getting all the authors that the user has followed
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "Missing userId parameter" });
  }

  db.query(
      "SELECT * FROM followingactions WHERE follower = ?",
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

// Adding to the database that a user has followed an author
router.post("/:authorid/:userId", (req, res) => {
  const { authorid, userId } = req.params;

  if (!authorid || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "INSERT INTO followingactions (follower, following) VALUES (?, ?)",
      [userId, authorid],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.status(201).send(result);
      }
  );
});

// User unfollowed an author
router.post("/delete/:authorid/:userId", (req, res) => {
  const { authorid, userId } = req.params;

  if (!authorid || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "DELETE FROM followingactions WHERE following = ? AND follower = ?",
      [authorid, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(result);
      }
  );
});

// Getting the number of people following this user
router.get("/count/followers/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "Missing userId parameter" });
  }

  db.query(
      "SELECT COUNT(follower) AS followerCount FROM followingactions WHERE following = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results[0]);
      }
  );
});

// Getting the number of people this user is following
router.get("/count/following/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "Missing userId parameter" });
  }

  db.query(
      "SELECT COUNT(following) AS followingCount FROM followingactions WHERE follower = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Database error" });
        }
        res.send(results[0]);
      }
  );
});

module.exports = router;
