const express = require("express");
const router = express.Router();

const db = require("../config/db");

//geting all the posts that are from the same author or the same categ
router.get("/:postcateg/:authorid/:picpath", (req, res) => {
  db.query(`SELECT * FROM post where
   (categname = "${req.params.postcateg}" or postedby=${req.params.authorid})
    and not (picpath="${req.params.picpath}")
     ORDER BY uploadDate DESC `, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(results)
    }
  })
});




module.exports = router;
