const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info



// creating the connection
// connection.connect((err)=>{
//     if(err){
//         console.log(err);
//     }
// });

//add new loancycle : schema definition
const addLC = {
    cycleNumber: joi.number().min(1).required(),
    idLoan : joi.number().min(0).required(),
    amount : joi.number().min(0).required(),
    grantedDate : joi.string().required(),
    dueDate : joi.string(),
    rateId : joi.number().min(1).required(),
    status: joi.number().required(),
    companyId: joi.number().min(1).required(),
    nic : joi.string().required()
};



//adding new loan to the database
router.put('/addlc',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, addLC);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const loanCycle = {
        cycleNumber : req.body.cycleNumber,
        idLoan : req.body.idLoan,
        amount : req.body.amount,
        grantedDate :req.body.grantedDate ,
        dueDate :req.body.dueDate ,
        rateId : req.body.rateId,
        status: req.body.status,
        companyId: req.body.companyId,
        nic : req.body.nic
    }
    sql = "insert into loancycle (loancycle.cycleNumber,loancycle.idloan , loancycle.amount , loancycle.grantedDate , loancycle.dueDate , loancycle.intRateId , loancycle.ststus , loancycle.companyId , loancycle.nic ) VALUES (?, ? , ? , ? , ? , ? ,?, ?,?)"
    connection.query(sql,
    [  loanCycle.cycleNumber, loanCycle.idLoan, loanCycle.amount , loanCycle.grantedDate , loanCycle.dueDate , 
        loanCycle.rateId , loanCycle.status, loanCycle.companyId , loanCycle.nic],
    (err,result)=>{
        if(err){
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send(result.insertId.toString())
        }else{
            res.status(400).send("error in addition of record ");
        }


    });


    });


// get a loancycle with a specific id
router.get('/:id/:cno',(req,res) =>{
    const idLoan = req.params.id ;
    const cycleNumber = req.params.cno;
    // username is passed as varible
    
        connection.query("SELECT * FROM `loancycle` where loancycle.idloan = ? and loancycle.cycleNumber  = ?;",
            [idLoan,cycleNumber],(error,rows,fields)=>{
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
// getting active loan cycle
router.get('/:nic/:cno/:status',(req,res) =>{
    console.log('req recives active lc');
    const nic = req.params.nic ;
    const compnyNumber = req.params.cno;
    const status = req.params.status;
    // username is passed as varible
    const sql = "select * from loancycle where loancycle.nic = ? and" +
        " loancycle.companyId = ? and loancycle.ststus = ?;"
    connection.query(sql,
        [nic,compnyNumber,status],(error,rows,fields)=>{
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


// getting all the loan cycles for a person
router.get('/cus/all/:nic/:cno',(req,res) =>{
    // console.log('req recives lc');
    const nic = req.params.nic ;
    const compnyNumber = req.params.cno;
    // username is passed as varible
    const sql = "SELECT * FROM loancycle where loancycle.nic = ? and " +
        "loancycle.companyId = ?;";
    connection.query(sql,
        [nic,compnyNumber],(error,rows,fields)=>{
            if(error){
                console.log(`error : ${error}`);
            } else{
                // console.log(rows[0]);
                if(rows[0] ){
                    res.send(rows);
                    return;
                }

                res.status(400).send('no entries found ');

            }
        });




});

// update the loancycle with some details
router.post('/updlc',(req,res)=>{
    const result = joi.validate(req.body, addLC);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const loanCycle = {
        cycleNumber : req.body.cycleNumber,
        idLoan : req.body.idLoan,
        amount : req.body.amount,
        grantedDate :req.body.grantedDate ,
        dueDate :req.body.dueDate ,
        rateId : req.body.rateId,
        status: req.body.status,
        companyId: req.body.companyId,
        nic : req.body.nic
    }
    var sql = "UPDATE `loancycle` SET `amount`=?,`grantedDate`= ?,`dueDate`= ?,`intRateId`=?,`ststus`= ?,`companyId`= ? ,`nic`= ? WHERE `idloan`=? and `cycleNumber`=? ";

        connection.query(sql,[ loanCycle.amount , loanCycle.grantedDate , loanCycle.dueDate , 
            loanCycle.rateId , loanCycle.status, loanCycle.companyId , loanCycle.nic , loanCycle.idLoan, loanCycle.cycleNumber , ],
            (err , result)=>{
                if(err){
                    res.status(400).send(err);
                    return;
                }
                if(result.affectedRows >0){
                    res.send("success");
                }else{
                    res.status(400).send("incorrect loancycle  number or loan number");
                }
            console.log(result.rowsAffected);
        }) ;



});
// connection.end();
module.exports = router;