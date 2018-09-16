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

//add new branch : schema definition
const schemaAdd = {
    name : joi.string().required(),
    setUpDate : joi.string().required(),
    address : joi.string(),
    manId : joi.string().required(),
    comId : joi.number().min(1).required()
};

// update branch info : schema definition
const schemaUpdate = {
    branchId: joi.number().min(1).required(),
    name : joi.string(),
    setUpDate : joi.string(),
    address : joi.string(),
    manId : joi.string(),
    comId : joi.number().min(1)
};

//adding new branch to the database
router.put('/addBrn',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    var name = req.body.name ;
    var setUpDate = req.body.setUpDate;
    var address = req.body.address;
    var manId = req.body.manId;
    var comId = req.body.comId;

            connection.query("insert into branch (branch.branchName , branch.branchAdress , branch.setUpDate , branch.managerId, branch.company_idcompany) \n" +
            "values (?, ?, ? , ? , ?);",
            [name,address,setUpDate,manId,comId],
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


// get a branch with a specific id
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

// update the branch with some details
router.post('/updateBrn',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    branch = {
        id: req.body.branchId,
        name: req.body.name,
        address:req.body.address,
        setUpDate:req.body.setUpDate,
        manId:req.body.manId,
        comId:req.body.comId

    };

    var sql = "update branch set branch.branchName = ?, branch.branchAdress = ?, branch.setUpDate = ?,\n" +
        "branch.managerId = ? , branch.company_idcompany = ? where branch.idbranch = ?;";

        connection.query(sql,[ branch.name , branch.address, branch.setUpDate, branch.manId,branch.comId,branch.id],
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
