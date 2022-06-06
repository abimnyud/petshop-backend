require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;