const express = require('express');
const joi = require('joi');
const portInfo = require('../conFig/portConfig');

const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
// const mysql = require('promise-mysql');
const  connection = require('../conFig/dbConnection');

// creating the schema for joi
const schema = {
    un : joi.string().min(3).required(),
    pw : joi.string().min(5).required()
};

//adding new user to the database
router.put('/addUser',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let userName = req.body.un ;
    let passWord = req.body.pw;
    connection.query("insert into login(login.username, login.`password`) values (?,?);",
        [userName,passWord],
        (err,result)=>{
        if(err){
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows){
            res.status(200).send("success");
            return;
        }
        res.status(400).send("data cannot be inserted");
        })

});

// inital variable to test the performance of the login app
console.log(portInfo.port);
router.get('/',(req,res) =>{
    res.send('login works');
});

// check whther the entered username and pasword is correct
router.post('/validate',(req,res,) =>{
    console.log("req came");

    let userName = req.body.un;
    let passWord = req.body.pw;
    console.log(userName , passWord);
    // username is passed as varible
    connection.query("SELECT login.`password` FROM login where login.username = ?;",[userName],
        (error,rows,fields)=>{
        if(error) {
            res.status(400).send({"error" : `${error}`});
            return;
        }
        if(rows[0]){
            let dbpw = rows[0].password;
            if(dbpw == passWord){
                res.send(JSON.stringify({"result":"valid"}));
            }else {
                res.send(JSON.stringify({"result":"invalid"}));
            }
            return;
        }
        res.status(200).send(JSON.stringify({"result":"invalid"}));

    });

});


// update the username and the password
router.post('/updateUser',(req,res)=>{
    const result = joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let userName = req.body.un ;
    let passWord = req.body.pw;

    let sql = "update  login set login.`password` = ? where login.username = ?;";

    connection.query(sql,[ passWord, userName ],
        (err , result)=>{
            if(err){
                res.status(400).send(err);
                return;
            }
            if(result.affectedRows >0){
                res.send("success");
            }else{
                res.status(400).send("incorrect username");
            }
            console.log(result.rowsAffected);
        }) ;



});

// router.listen(portInfo.port);

module.exports = router;