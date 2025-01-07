const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
 
 dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.PASS_WORD,
    database:process.env.DATA_BASE
})

module.exports = db;