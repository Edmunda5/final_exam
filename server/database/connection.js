const mysql = require('mysql');
const CONFIG = require('../../config.js');

const connection = mysql.createConnection({
    host: CONFIG.DB_HOST,
    user: CONFIG.DB_USER,
    password: CONFIG.DB_USR_PSW,
    database: CONFIG.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established, database: ' + CONFIG.DB_NAME);
});

module.exports = connection;