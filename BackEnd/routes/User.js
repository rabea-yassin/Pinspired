const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const db = require("../config/db");

const saltRounds = 10

// adding new user
router.post("/addUser", (req, res) => {
  console.log(JSON.stringify(req.body))
  const name = req.body.name;
  const email = req.body.email;
  const pass = req.body.pass;
  const gender = req.body.gender;
  const pic = req.body.picpath;




  db.query(
    //first we are gonna check if this email alredy exsit in the DB
    `SELECT * FROM users WHERE email = "${req.body.email}"`, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result" + JSON.stringify(result))
        if (result.length === 0) {
          bcrypt.hash(pass, saltRounds, (err, hash) => {
            if (err) {
              console.log
            }
            db.query(
              //we are gona add this user
              "INSERT INTO users (name, email, pass, gender ,pic) VALUES (?,?,?,?,?)",
              [name, email, hash, gender, pic],
              (err, myresult) => {
                if (err) {
                  console.log(err);
                } else {
                  db.query(
                    `SELECT id FROM users WHERE email = "${req.body.email}"`, (err, idresult) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("idresult " + JSON.stringify(idresult[0].id))
                        //befor adding a new user we need to set  tow  cookies 1)logedin=true 2)userid=userid
                        res.send(`${idresult[0].id}`)

                      }
                    });
                }
              }
            );
          } );
        }
        else {
          // no we are npt gona add him 
        
          res.send("-17")// we dont want to send 0 but we are sending -17 cuse its no >0
        }

      }
    });
});

// cheking if the user exist in the database
router.post("/checkuser", (req, res) => {
  console.log(JSON.stringify(req.body))
  const email = req.body.email;
  const pass = req.body.pass;
  db.query(
    `SELECT id,name,pic,pass  FROM users WHERE email = "${email}" `, (err, idresult) => {
      console.log(idresult);
      if (err) {
        console.log(err);
      } else {
        if (idresult.length === 0) {
          res.send({ msg: "user doesn't exist 😥. but you can sign up now 😀" })
        }
        else {
          console.log("this user is  in the data base")
          console.log("idresult " + JSON.stringify(idresult[0].id))
          //after checking that this user exist we are adding two cookies 1)logedin=true 2)userid=userid
          bcrypt.compare(pass, idresult[0].pass, (err, result) => {
            if (result) {
              res.json({ "name": `${(idresult[0].name)}`, "id": `${(idresult[0].id)}`, "picpath": `${(idresult[0].pic)}` })
            }
            else { res.send({ msg: "wrong pass/email combination 😥" }) }
          })
        }


      }
    });

})

// geting a specific user info
router.get("/:userid", (req, res) => {
  db.query(
    `SELECT * FROM users WHERE id = ${req.params.userid}`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

//get the users that follow this user
router.get("/followers/:userid", (req, res) => {
  db.query(
    `SELECT id FROM users WHERE id in (SELECT follower FROM followingactions WHERE following =  ${req.params.userid} )`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});


//getting the users that this user follow
router.get("/following/:userid", (req, res) => {
  db.query(
    `SELECT id FROM users WHERE id in (SELECT following FROM followingactions WHERE follower =  ${req.params.userid} )`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

// deleting a user
router.delete("/:userid", (req, res) => {
  // befor deleting a post we should delete all the activetes that are related to this post ( likes, saves)
  db.query(`DELETE FROM likes WHERE userId = ${req.params.userid}`, (err, likeresults) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(likeresults);
      db.query(`DELETE FROM save WHERE userid = ${req.params.userid}`, (err, saveresults) => {
        if (err) {
          console.log(err);
        }
        else {
          db.query(`DELETE FROM followingactions WHERE follower = ${req.params.userid} or following = ${req.params.userid} `, (err, saveresults) => {
            if (err) {
              console.log(err);
            }
            else {
              db.query(`DELETE FROM comments WHERE userId = ${req.params.userid} `, (err, saveresults) => {
                if (err) {
                  console.log(err);
                }
                else {
                  db.query(`DELETE FROM users WHERE id = ${req.params.userid}`, (err, results) => {
                    if (err) {
                      console.log(err);
                    }
                    else { res.send(results) }
                  })
                }
              })
            }
          })
        }
      })
    }
  })

});

// getting all the users
router.get("/", (req, res) => {
  db.query(
    `SELECT * FROM users`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});



module.exports = router;
