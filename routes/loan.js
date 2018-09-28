const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info



//add new loan : schema definition
const loanAdd = {
    refNo : joi.string().required(),
    teamMemId: joi.number().min(1).required()
};

// update loan info : schema definition
const loanUpdate = {
    idLoan: joi.number().required(),
    refNo : joi.string(),
    teamMemId: joi.number().min(1)

};

//adding new loan to the database
router.put('/addLoan',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, loanAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const loan = {
        refNo : req.body.refNO,
        teamMemId: req.body.teamMemId

    };
    const sql = "insert into loan(loan.refNo , loan.teamMemberId) values  ( ? , ?);";
    connection.query(sql,
    [loan.refNo , loan.teamMemId ],
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

//get the sum of the total loans grnated between to days
router.get('/:dtStart/:dtEnd', (req, res) => {
    let dtStart = req.params.dtStart;
    let dtEnd = req.params.dtEnd;

    const sql = "SELECT sum(loancycle.amount) as total from  loancycle where date(grantedDate)" +
        " between ? and ? ;";
    connection.query(sql,
        [dtStart, dtEnd], (error, rows, fields) => {
            if (error) {
                console.log(`error : ${error}`);
            } else {
                // console.log(rows[0]);
                if (rows[0]) {
                    res.send(rows[0]);
                    return;
                }

                res.status(400).send('no entries found ');

            }
        });
});

// get a loan with a specific id
router.get('/:id',(req,res) =>{
    let id = req.params.id ;
    // username is passed as varible
    
        connection.query("SELECT * FROM loan where loan.idloan = ?;",
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
    const result = joi.validate(req.body, loanUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const loan = {
        loanId: req.body.idLoan,
        refNo : req.body.refNo,
        teamMemId: req.body.teamMemId

    };
    let sql = "update loan set loan.refNo = ? , loan.teamMemberId = ? where loan.idloan = ? ;";

        connection.query(sql,[loan.refNo , loan.teamMemId, loan.loanId ],
            (err , result)=>{
                if(err){
                    res.status(400).send(err);
                    return;
                }
                if(result.affectedRows >0){
                    res.send("success");
                }else{
                    res.status(400).send("incorrect loan id");
                }
            console.log(result.rowsAffected);
        }) ;



});
// connection.end();
module.exports = router;