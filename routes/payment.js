const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info



//add new payment : schema definition
const schemaAdd = {
   
    time : joi.string().required(),
    amount : joi.number().min(0),
    description : joi.string().required(),
    lcId : joi.number().min(1).required(),
    empId : joi.string().required(),
};

// update loan info : schema definition
const schemaUpdate = {
    idPay : joi.number().required(),
    time : joi.string().required(),
    amount : joi.number().min(0),
    description : joi.string().required(),
    lcId : joi.number().min(1).required(),
    empId : joi.string().required(),
};

//adding new paymnet to the database
router.put('/addPmt',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const payment = {
        
        time: req.body.time,
        amount : req.body.amount,
        description: req.body.description ,
        lcid: req.body.lcId,
        empId : req.body.empId,
        };

    connection.query("insert into payment (payment.dateNtime , payment.amount , payment.description , payment.loanCycleId , payment.employeeId)  values (? , ? , ? , ?, ?);",
    [ payment.time, payment.amount , payment.description , payment.lcid , payment.empId],
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

// get total of payments collected by emp in a day
router.get('/:nic/:date', (req, res) => {
    var date = req.params.date;
    var nic = req.params.nic;

    const sql = "SELECT sum(payment.amount) as pmnt FROM payment where payment.employeeId = ?" +
        " and payment.dateNtime like ?;";
    connection.query(sql,
        [nic, date], (error, rows, fields) => {
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

// get the sum of money collected by single employee in a center
router.get('/:cenId/:nic/:dte', (req, res) => {
    var cenId = req.params.cenId;
    var nic = req.params.nic;
    var date = req.params.dte;

    const sql = "select sum(payment.amount) as total , center.centerName\n" +
        "from ((((payment inner join loancycle on payment.loanCycleId = loancycle.idLoanCycle)\n" +
        "\t\t\t\tinner join loan on loancycle.idloan = loan.idloan )\n" +
        "                inner join teammember on loan.teamMemberId = teammember.idteamMember)\n" +
        "                inner join team on teammember.teamId = team.idteam)\n" +
        "                inner join center on team.center_idcenter = center.idcenter\n" +
        "where center.idcenter = ? and payment.employeeId = ? and payment.dateNtime like ?";
    connection.query(sql,
        [cenId ,nic, date+'%'], (error, rows, fields) => {
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



// get a payment with a specific id
router.get('/:id',(req,res) =>{
    const id = req.params.id ;
    // username is passed as varible
    
        connection.query("SELECT * FROM payment where payment.idpayment = ?;",
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
// get the sumof total payments for loan cyccle id
router.get('/sum/:id',(req,res) =>{
    const lcId = req.params.id ;
    // username is passed as varible
    sql = "select sum(payment.amount) from payment where payment.loanCycleId = ? ;";
    connection.query(sql,
        [lcId],(error,rows,fields)=>{
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

// getting the payment data for lcid
router.get('/lcid/:id',(req,res) =>{
    const lcId = req.params.id ;
    // username is passed as varible
    const sql = "select * from payment where payment.loanCycleId = ? order by payment.dateNtime ;";
    connection.query(sql,
        [lcId],(error,rows,fields)=>{
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

// update the payment with some details
router.post('/updatePmt',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const payment = {
        idPay: req.body.idPay,
        time: req.body.time,
        amount : req.body.amount,
        description: req.body.description ,
        lcid: req.body.lcId,
        empId : req.body.empId, 

    };
    const sql = "update payment set payment.dateNtime = ? , payment.amount = ? , payment.description = ? , \n " +
    "payment.loanCycleId = ? , payment.employeeId = ? where payment.idpayment = ?;";

        connection.query(sql,[ payment.time, payment.amount , payment.description , payment.lcid , payment.empId, payment.idPay],
            (err , result)=>{
                if(err){
                    res.status(400).send(err);
                    return;
                }
                if(result.affectedRows >0){
                    res.send("success");
                }else{
                    res.status(400).send("incorrect payment id");
                }
            console.log(result.rowsAffected);
        }) ;

            

});
// connection.end();
module.exports = router;