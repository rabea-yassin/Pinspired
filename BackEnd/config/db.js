const mysql = require("mysql");
require('dotenv').config(); // Ensure you install dotenv by running 'npm install dotenv'

const db_connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

db_connection.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('MySQL Connection Established: ', connection.threadId);
  connection.release(); // Release the connection back to the pool
});

module.exports = db_connection;
