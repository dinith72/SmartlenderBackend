const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'smartlender'
});

module.exports = connection;