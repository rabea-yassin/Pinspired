const mysql = require("mysql");
require('dotenv').config(); // Load environment variables

// Create pool connection using environment variables
const db_connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

db_connection.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('MySQL Connection Established:', connection.threadId);
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db_connection;
