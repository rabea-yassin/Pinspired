require('dotenv').config();
const mysql = require("mysql");

const db_connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

db_connection.getConnection((err, connection) => {
  if (err) console.error(err);
  console.log('MySQL Connection Established: ', connection.threadId);
});

module.exports = db_connection;
