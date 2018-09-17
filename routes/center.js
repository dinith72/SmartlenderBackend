const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection');

// creating the connection
// connection.connect((err)=>{
//     if(err){
//         console.log(err);
//     }
// });

// add ceneter : schema defininton
const schema = {
    name : joi.string().required(),
    address: joi.string().required(),
    setUpDate: joi.string(),
    managerId : joi.string().required(),
    branchId : joi.number().min(1).required(),
    active: joi.number().max(1).min(0).required(),
    dissDate: joi.string()

};

// update center info : schema definition
const schemaUpdate = {
    cenId: joi.number().min(1).required(),
    name : joi.string(),
    address: joi.string(),
    setUpDate: joi.string(),
    managerId : joi.string(),
    branchId : joi.number().min(1),
    status: joi.number().max(1).min(0),
    dissDate: joi.string()
};

//adding new company to the database
router.put('/addCen',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const center = {
        name : req.body.name,
        address: req.body.address,
        setUpDate: req.body.setUpDate,
        managerId : req.body.managerId,
        branchId : req.body.branchId,
        status: req.body.status,
        dissDate: req.body.dissDate
    
    };
    var sql = "insert into center ( center.centerName , center.centerAdress , \n" +
        "center.centerSetUpDate , center.centerInCharge ,center.branch_idbranch , center.`status`, center.centerDissolvedDate) \n" +
        "values (? , ? , ?, ? , ? , ? ,?);";
    connection.query(sql,
        [center.name, center.address, center.setUpDate,  center.managerId,center.branchId , center.status , center.dissDate],
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
    connection.query("SELECT * FROM center where center.idcenter = ?;",
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
router.post('/updateCen',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const center = {
        cenId: req.body.cenId,
        name: req.body.name,
        address: req.body.address,
        setUpDate: req.body.setUpDate,
        managerId : req.body.managerId,
        branchId : req.body.branchId,
        status: req.body.status,
        dissDate: req.body.dissDate

    
    }; 

    var sql = "update center set center.centerName = ? , center.centerAdress = ? , center.centerSetUpDate = ? , \n" +
        "center.centerInCharge = ? , center.branch_idbranch = ? , center.`status` = ?, center.centerDissolvedDate = ?\n" +
        "where center.idcenter = ? ;";

    connection.query(sql,
        [center.name, center.address, center.setUpDate,  center.managerId,center.branchId , center.status , center.dissDate, center.cenId ],
        (err,result)=>{
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