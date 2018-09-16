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
    // console.log(`conn created ${connection} `);
}).catch((error)=>{
    console.log(error);
});
// creating the schema for joi
const schema = {
    un : joi.string().min(3).required(),
    pw : joi.string().min(5).required()
}

//adding new user to the database
router.post('/addUser',(req,res) =>{
    const result = joi.validate(req.body , schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;

    }
    // var userName = req.body.un ;
    // var passWord = req.body.pw;
    // // username is passed as varible
    // this.connection.query("SELECT login.`password` FROM login where login.username = ?;",[userName],(error,rows,fields)=>{
    //     if(error){
    //         console.log(`error : ${error}`);
    //     } else{
    //         console.log(rows);
    //         var dbpw = rows[0].password;
    //         if(dbpw == passWord){
    //             res.send('valid');
    //         }else {
    //             res.send('invalid');
    //         }
    //     }
    // });

})

module.exports = router;