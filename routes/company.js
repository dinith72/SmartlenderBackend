const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection');

// creating the connection
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
});

// add company : schema defininton
const schema = {
    name : joi.string().required(),
    regNo : joi.string().required(),
    address : joi.string()
};

// update company info : schema definition
const schemaUpdate = {
    comId: joi.number().min(1).required(),
    name : joi.string().required(),
    regNo : joi.string(),
    address : joi.string(),
};

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
    connection.query("insert into company (company.companyName, company.regNo, company.adress) values (?,?,?);",
        [name,regNo,address],
        (err,result)=>{
            if(err){
                res.status(400).send(error);
                return;
            }
            if(result.affectedRows){
                res.status(200).send(result.insertId.toString());
                return;
            }
            res.send("cannot add data");
        })

});

// getting the company details
router.get('/:id',(req,res) =>{
    var id = req.params.id ;
    // username is passed as varible
    connection.query("SELECT company.companyName, company.regNo, company.adress FROM company where company.idcompany = ? ;",
        [id],
        (error,rows,fields)=>{
        if(error){
            // console.log(`error : ${error}`);
            res.status(400).send(error);
            return;
        }
            // console.log(rows[0]);
        if(rows[0]){
            res.send(rows[0]);
            return;
        }

        res.status(400).send('no entries found for that id');

    });

});

// update the company with some details
router.post('/updateCom',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
     company = {
        id: req.body.comId,
        name: req.body.name,
        regNo: req.body.regNo,
        address:req.body.address,
        setUpDate:req.body.setUpDate,

    };

    var sql = "update company set company.companyName = ?, company.regNo = ?, \n" +
        "company.adress = ? where company.idcompany = ?;";

    connection.query(sql,[ company.name ,company.regNo , company.address, company.id],
        (err , result)=>{
            if(err){
                res.status(400).send(err);
                return;
            }
            if(result.affectedRows >0){
                res.send("success");
            }else{
                res.status(400).send("incorrect branch id");
            }
            console.log(result.rowsAffected);
        }) ;



});




module.exports = router;