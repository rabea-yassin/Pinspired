const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Checking if user has saved a post
router.get("/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "SELECT * FROM save WHERE postpath = ? AND userId = ?",
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

// Getting all the posts that the user has saved
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "Missing userId parameter" });
  }

  db.query(
      "SELECT * FROM save WHERE userId = ?",
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

// Adding to the database that a user has saved a post
router.post("/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "INSERT INTO save (userId, postpath) VALUES (?, ?)",
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

// User unsaved a post
router.post("/delete/:postpath/:userId", (req, res) => {
  const { postpath, userId } = req.params;

  if (!postpath || !userId) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      "DELETE FROM save WHERE postpath = ? AND userId = ?",
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

module.exports = router;
