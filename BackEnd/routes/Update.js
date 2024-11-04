const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const saltRounds = 10

const db = require("../config/db");


router.put("/ProfilePic", (req, res) => {
    console.log(JSON.stringify(req.body))
    const picpath = req.body.picpath;
    const userid = req.body.userid;

    db.query(`UPDATE users SET pic = "${picpath}" WHERE (id = ${userid});  `, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('ProfilePic changed succesfuly ')
            res.send(results)

        }
    });
});



router.put("/password", (req, res) => {
    console.log(JSON.stringify(req.body))
    const NewPass = req.body.NewPass;
    const userid = req.body.userid;
    const CurrPass = req.body.CurrPass
    db.query(
        `SELECT *  FROM users WHERE id = "${userid}" `, (err, idresult) => {
            console.log(idresult);
            if (err) {
                console.log(err);
            } else {
                bcrypt.compare(CurrPass, idresult[0].pass, (err, result) => {
                    if (result) {
                        bcrypt.hash(NewPass, saltRounds, (err, hash) => {
                            if (err) {
                                console.log
                            }
                            db.query(`UPDATE users SET pass = "${hash}" WHERE (id = ${userid});  `, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(' password changed succesfuly ')
                                    res.send({ msg: "password have been updated successfully ✅ " })

                                }
                            });

                        });
                    }
                    else { res.send({ err: "🚫your current password was wrong🚫" }) }
                })




            }
        })





});


router.put("/username", (req, res) => {
    console.log(JSON.stringify(req.body))
    const NewName = req.body.NewName;
    const userid = req.body.userid;

    db.query(`UPDATE users SET Name = "${NewName}" WHERE (id = ${userid});  `, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(' username changed succesfuly ')
            res.send(results)

        }
    });
});

module.exports = router;
