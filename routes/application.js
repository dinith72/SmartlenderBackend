const express = require('express');
const basejoi = require('joi');

const router =  express();
const cors = require('cors');
router.use(cors());
const dateExtension = require('joi-date-extensions');
const joi = basejoi.extend(dateExtension);
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new team  member  : schema definition
const schemaAdd = {
   
   "refNo": joi.string().required(),
   "amount" : joi.number().min(1).required(),
   "loanPeriod" :  joi.number().min(1).required(),
   "description":   joi.string(),
   "status":    joi.number().required(),
   "appDate" : joi.date().format('YYYY-MM-DD'),
   "cusId" : joi.string().required(),
    "empId" : joi.string().required(),
   "appAmount" : joi.number().min(1).required()
};
const schemaUpdate = {
   
 };


//adding new teammember to the database
router.put('/addApp',(req,res) => {
    
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Application = {
        refno: req.body.refNo,
        amount: req.body.amount,
        loanPeriod: req.body.loanPeriod,
        description: req.body.description,
        status: req.body.status ,
        appDate: req.body.appDate,
        cusId: req.body.cusId,
        empId: req.body.empId,
        appAmount: req.body.appAmount
        }
        var sql = "insert into application ( application.referenceNum , application.amount , application.loanPeriod , application.description , application.status ,\n"+ 
            "application.approvedDateTime , application.customerId , application.approvedBy , application.approvedAmt)\n"+
        "values ('app01', 10000 , 2 , 'test application' , 0 , '2018-05-07' , '456280056v' , '953280086v' , 9000);"
    connection.query(sql,
    [Application.refno , Application.amount , Application.loanPeriod , Application.description , Application.status,
     Application.appDate , Application.cusId , Application.empId , Application.appAmount],
    (err,result)=>{
        if(err){   
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send(result.insertId.toString())
        }else{
            res.status(400).send("error in addition of record in attendence ");
        }


    });


});


// get a attedence to a perticular attedence id 
router.get('/:attId',(req,res) =>{
    var attId = req.params.attId ;
    connection.query("SELECT * FROM attendence where attendence.idattendence = ?;",
        [attId],(error,rows,fields)=>{
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

// update the attendence  of a team memeber
router.post('/updateAtt',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Attendence = {
        attId : req.body.attId,
        status : req.body.status,
        time: req.body.time,
        teamMemId: req.body.teamMemId,
        empId:  req.body.empId,
        comId:  req.body.comId,
        description:  req.body.description,
        effDate:  req.body.effDate
        }
    
    
    var sql = " update attendence set  attendence.status= ? , attendence.dateNtime = ? , \n"+
    "attendence.teamMemberId = ? , attendence.employeeId = ?,\n"+
    "attendence.companyId = ? , attendence.description = ? , \n"+ 
    "attendence.effectiveDate = ? where attendence.idattendence = ?;";

        connection.query(sql,
            [ Attendence.status , Attendence.time , Attendence.teamMemId , Attendence.empId , Attendence.comId ,
                Attendence.description , Attendence.effDate , Attendence.attId] ,
            (err , result)=>{
                if(err){
                    res.status(400).send(err);
                    return;
                }
                if(result.affectedRows >0){
                    res.send("success");
                }else{
                    res.status(400).send("incorrect attendence id");
                }
            console.log(result.rowsAffected);
        }) ;



});
// connection.end();
module.exports = router;    