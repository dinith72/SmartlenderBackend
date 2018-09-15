const express = require('express');
const joi = require('joi');
const portInfo = require('../../conFig/portConfig');
const dbconfig = require('../../conFig/databaseConfig');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const mysql = require('promise-mysql');
var connection;


//connecting to the database
mysql.createConnection({
    host: dbconfig.host,
    user:dbconfig.user,
    password:dbconfig.password,
    database:dbconfig.database
}).then((conn)=>{
    this.connection = conn;
    console.log(`conn created ${connection} `);
}).catch((error)=>{
    console.log(error);
});

// inital variable to test the performance of the login app
console.log(portInfo.port);
router.get('/',(req,res) =>{
    res.send('login works');
})

// check whther the entered username and pasword is correct
router.post('/validate',(req,res) =>{
    var userName = req.body.un ;
    var passWord = req.body.pw;
    // username is passed as varible
    this.connection.query("SELECT login.`password` FROM login where login.username = ?;",[userName],(error,rows,fields)=>{
        if(error){
            console.log(`error : ${error}`);
        } else{
            console.log(rows);
            var dbpw = rows[0].password;
            if(dbpw == passWord){
                res.send('valid');
            }else {
                res.send('invalid');
            }
        }
    });

})

// router.listen(portInfo.port);

module.exports = router;