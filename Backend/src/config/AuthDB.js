const mysql = require('mysql2');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'hippo',
    password : 'hippo7621^^',
    database : 'CROWN_HUNT'
});

module.exports = pool.promise();