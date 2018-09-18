const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'mysql',
//     database:'smartlender'
// });
const connection = mysql.createConnection({
    host:'sql12.freesqldatabase.com',
    user:'sql12256758',
    password:'W33aMhHxFy',
    database:'sql12256758'
})

module.exports = connection;