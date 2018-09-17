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

//add new loan : schema definition
const schemaAdd = {
    name : joi.string().required(),
    issuedDate : joi.string().required(),
    amount : joi.number().min(0),
    intrest : joi.number().required(),
    cycleId : joi.number().min(1).required()
};

// update loan info : schema definition
const schemaUpdate = {
    loanId: joi.number().min(1).required(),
    name : joi.string(),
    issuedDate : joi.string(),
    amount : joi.number(),
    intrest : joi.number(),
    cycleId : joi.number().min(1)
};

//adding new loan to the database
router.put('/addLoan',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const loan = {
        name: req.body.name ,
        issuedDate: req.body.issuedDate,
        amount : req.body.amount,
        intrest : req.body.insert,
        cycId: req.body.cycleId

    }

    connection.query("insert into branch (branch.branchName , branch.branchAdress , branch.setUpDate , branch.managerId, branch.company_idcompany) \n" +
    "values (?, ?, ? , ? , ?);",
    [loan.name , loan.issuedDate , loan.amount , loan.intrest ,loan.cycId],
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


// get a loan with a specific id
router.get('/:id',(req,res) =>{
    var id = req.params.id ;
    // username is passed as varible
    
        connection.query("SELECT * FROM branch where branch.idbranch = ?;",
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

// update the loan with some details
router.post('/updateLoan',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const loan = {
        loanId: req.body.loanId,
        name: req.body.name ,
        issuedDate: req.body.issuedDate,
        amount : req.body.amount,
        intrest : req.body.insert,
        cycId: req.body.cycleId

    }
    var sql = "update branch set branch.branchName = ?, branch.branchAdress = ?, branch.setUpDate = ?,\n" +
        "branch.managerId = ? , branch.company_idcompany = ? where branch.idbranch = ?;";

        connection.query(sql,[ loan.name , loan.issuedDate, loan.amount, loan.intrest , loan.cycId , loan.loanId],
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