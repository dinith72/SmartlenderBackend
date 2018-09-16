const express = require('express');
const joi = require('joi');
const dbconfig = require('../conFig/databaseConfig');
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
    name : joi.string().required(),
    regNo : joi.string().required(),
    address : joi.string()
}
//adding new company to the database
router.put('/addCom',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    var name = req.body.name ;
    var regNo = req.body.regNo;
    var address = req.body.address;
    var id;
    this.connection.query("insert into company (company.companyName, company.regNo, company.adress) values (?,?,?);",
        [name,regNo,address])
        .then((result)=>{
            res.send("success");
        })
        .catch((error)=>{
            // console.log(`error : ${error}`);
            res.status(400).send(error);
            return;
        })


});

// getting the company details
router.get('/:id',(req,res) =>{
    var id = req.params.id ;
    // username is passed as varible
    this.connection.query("SELECT company.companyName, company.regNo, company.adress FROM company where company.idcompany = ? ;",
        [id],(error,rows,fields)=>{
        if(error){
            console.log(`error : ${error}`);
        } else{
            // console.log(rows[0]);
            if(rows[0] == null){
                res.status(400).send('no entries found for that id');
                return;
            }
            res.send(rows[0]);
        }
    });

})






module.exports = router;