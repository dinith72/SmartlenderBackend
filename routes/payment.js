const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info
var branch;


// creating the connection
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
});

//add new payment : schema definition
const schemaAdd = {
    name : joi.string().required(),
    time : joi.string().required(),
    amount : joi.number().min(0),
    cusId : joi.string().required(),
    loanId : joi.number().min(1).required()
};

// update loan info : schema definition
const schemaUpdate = {
    pmtId: joi.number().min(1).required(),
    name : joi.string(),
    time : joi.string(),
    amount : joi.number(),
    cusId : joi.number(),
    loanId : joi.number().min(1)
};

//adding new loan to the database
router.put('/addPmt',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const payment = {
        name: req.body.name ,
        time: req.body.time,
        amount : req.body.amount,
        cusId : req.body.cusId,
        loanId: req.body.loanId,

    }

    connection.query("",
    [payment.name , payment.time, payment.amount , payment.cusId , payment.loanId],
    (err,result)=>{
        if(err){
            res.status(400).send(error);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send(result.insertId.toString())
        }else{
            res.status(400).send("error in addition of record ");
        }


    });


    });


// get a payment with a specific id
router.get('/:id',(req,res) =>{
    var id = req.params.id ;
    // username is passed as varible
    
        connection.query("",
            [id],(error,rows,fields)=>{
                if(error){
                    console.log(`error : ${error}`);
                } else{
                    // console.log(rows[0]);
                    if(rows[0] ){
                        res.send(rows[0]);
                        return;
                    }

                    res.status(400).send('no entries found ');

                }
        });




});

// update the payment with some details
router.post('/updatePmt',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const payment = {
        pmtId: req.body.pmtId,
        name: req.body.name ,
        time: req.body.time,
        amount : req.body.amount,
        cusId : req.body.cusId,
        loanId: req.body.loanId

    }
    var sql = "";

        connection.query(sql,[ payment.name , payment.time , payment.amount, payment.cusId , payment.loanId , payment.pmtId],
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
// connection.end();
module.exports = router;