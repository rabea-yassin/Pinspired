const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Getting all the posts that are from the same author or the same category
router.get("/:postcateg/:authorid/:picpath", (req, res) => {
  const { postcateg, authorid, picpath } = req.params;

  // Validate required parameters
  if (!postcateg || !authorid || !picpath) {
    return res.status(400).send({ error: "Missing required parameters" });
  }

  db.query(
      `SELECT * FROM post 
     WHERE (categname = ? OR postedby = ?)
     AND picpath != ?
     ORDER BY uploadDate DESC`,
      [postcateg, authorid, picpath],
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
