const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Adding a new comment
router.post("/add", (req, res) => {
    const { comment, postid, userid } = req.body;

    if (!comment || !postid || !userid) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    db.query(
        "INSERT INTO comments (comment, postid, userid) VALUES (?, ?, ?)",
        [comment, postid, userid],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }
            res.status(201).send({ message: "Comment added", result });
        }
    );
});

// Get all comments for a specific post
router.get("/:postid", (req, res) => {
    const postid = req.params.postid;

    db.query(
        "SELECT * FROM comments WHERE postid = ? ORDER BY date DESC",
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
