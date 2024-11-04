const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const db = require("../config/db");

// Update Profile Picture
router.put("/ProfilePic", (req, res) => {
    const { picpath, userid } = req.body;

    if (!picpath || !userid) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    db.query(
        "UPDATE users SET pic = ? WHERE id = ?",
        [picpath, userid],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }
            console.log("ProfilePic changed successfully");
            res.send(results);
        }
    );
});

// Update Password
router.put("/password", (req, res) => {
    const { NewPass, userid, CurrPass } = req.body;

    if (!NewPass || !userid || !CurrPass) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    // Fetch the current user by ID
    db.query("SELECT * FROM users WHERE id = ?", [userid], (err, idresult) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }

        if (idresult.length === 0) {
            return res.status(404).send({ error: "User not found" });
        }

        // Compare current password with the stored hash
        bcrypt.compare(CurrPass, idresult[0].pass, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Error comparing passwords" });
            }

            if (!result) {
                return res.status(400).send({ error: "Current password is incorrect" });
            }

            // Hash the new password
            bcrypt.hash(NewPass, saltRounds, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ error: "Error hashing the new password" });
                }

                // Update the password in the database
                db.query("UPDATE users SET pass = ? WHERE id = ?", [hash, userid], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ error: "Database error" });
                    }
                    console.log("Password changed successfully");
                    res.send({ msg: "Password updated successfully ✅" });
                });
            });
        });
    });
});

// Update Username
router.put("/username", (req, res) => {
    const { NewName, userid } = req.body;

    if (!NewName || !userid) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    db.query(
        "UPDATE users SET Name = ? WHERE id = ?",
        [NewName, userid],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }
            console.log("Username changed successfully");
            res.send(results);
        }
    );
});

module.exports = router;
