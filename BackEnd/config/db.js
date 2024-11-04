const mysql = require("mysql");

// // Create connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'r1a2b3e4a5',
//   database: 'pinterest'
// });
// // Connect
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySql Connected...');
// });


// // Create connection
// const db2 = mysql.createConnection({
//   host: 'blw0snvjnx9eqnwpk721-mysql.services.clever-cloud.com',
//   user: 'uepafc6b5lczfc03',
//   password: 'PN49xR8xfMbhIB0sTZx6',
//   database: 'blw0snvjnx9eqnwpk721'
// });
// // Connect
// db2.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySql Connected...');
// });





// pool connction

const db_connection = mysql.createPool({
  host: 'blw0snvjnx9eqnwpk721-mysql.services.clever-cloud.com',
    user: 'uepafc6b5lczfc03',
    password: 'PN49xR8xfMbhIB0sTZx6',
    database: 'blw0snvjnx9eqnwpk721',
    connectionLimit: 5,
});

db_connection.getConnection((err, connection) => {
  if (err) console.error(err);
  console.log('MySQL Connection Established: ', connection.threadId);
})

module.exports = db_connection;


// module.exports = db2;


