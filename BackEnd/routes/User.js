const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const saltRounds = 10;

// Adding new user
router.post("/addUser", (req, res) => {
    const { name, email, pass, gender, picpath } = req.body;

    if (!name || !email || !pass || !gender) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    // Check if the email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }

        if (result.length === 0) {
            // Hash the password before storing
            bcrypt.hash(pass, saltRounds, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ error: "Error hashing password" });
                }

                // Insert the new user
                db.query(
                    "INSERT INTO users (name, email, pass, gender, pic) VALUES (?, ?, ?, ?, ?)",
                    [name, email, hash, gender, picpath],
                    (err, myresult) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send({ error: "Database error" });
                        }

                        // Retrieve the new user ID
                        db.query("SELECT id FROM users WHERE email = ?", [email], (err, idresult) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({ error: "Database error" });
                            }

                            res.send({ userId: idresult[0].id });
                        });
                    }
                );
            });
        } else {
            // Email already exists
            res.status(400).send({ error: "Email already exists" });
        }
    });
});

// Checking if the user exists (login)
router.post("/checkuser", (req, res) => {
    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    // Find the user by email
    db.query("SELECT id, name, pic, pass FROM users WHERE email = ?", [email], (err, idresult) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }

        if (idresult.length === 0) {
            return res.status(404).send({ error: "User not found" });
        }

        // Compare passwords
        bcrypt.compare(pass, idresult[0].pass, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Error comparing passwords" });
            }

            if (result) {
                res.json({
                    name: idresult[0].name,
                    id: idresult[0].id,
                    picpath: idresult[0].pic,
                });
            } else {
                res.status(400).send({ error: "Wrong password" });
            }
        });
    });
});

// Getting a specific user's info
router.get("/:userid", (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        return res.status(400).send({ error: "Missing userid parameter" });
    }

    db.query("SELECT * FROM users WHERE id = ?", [userid], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
    });
});

// Get the users that follow this user
router.get("/followers/:userid", (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        return res.status(400).send({ error: "Missing userid parameter" });
    }

    db.query(
        "SELECT id FROM users WHERE id IN (SELECT follower FROM followingactions WHERE following = ?)",
        [userid],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }
            res.send(results);
        }
    );
});

// Get the users that this user follows
router.get("/following/:userid", (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        return res.status(400).send({ error: "Missing userid parameter" });
    }

    db.query(
        "SELECT id FROM users WHERE id IN (SELECT following FROM followingactions WHERE follower = ?)",
        [userid],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }
            res.send(results);
        }
    );
});

// Deleting a user and all related activities
router.delete("/:userid", (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        return res.status(400).send({ error: "Missing userid parameter" });
    }

    // Delete all activities related to the user
    db.query("DELETE FROM likes WHERE userId = ?", [userid], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }

        db.query("DELETE FROM save WHERE userId = ?", [userid], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Database error" });
            }

            db.query("DELETE FROM followingactions WHERE follower = ? OR following = ?", [userid, userid], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ error: "Database error" });
                }

                db.query("DELETE FROM comments WHERE userId = ?", [userid], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ error: "Database error" });
                    }

                    db.query("DELETE FROM users WHERE id = ?", [userid], (err, results) => {
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
});

// Getting all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error" });
        }
        res.send(results);
    });
});

module.exports = router;
