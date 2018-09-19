const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new team  member  : schema definition
const schemaAdd = {
   
   "status": joi.number().min(1).required(),
   "time": joi.string().required(),
   "teamMemId" : joi.number().min(1).required(),
   "empId":joi.string().required(),
   "comId" :  joi.number().min(1).required(),
   "description" : joi.string().required(),
   "effDate" : joi.string().required(),
};
const schemaUpdate = {
    "attId" : joi.number().min(1).required(),
    "status": joi.number().min(1).required(),
   "time": joi.string().required(),
   "teamMemId" : joi.number().min(1).required(),
   "empId":joi.string().required(),
   "comId" :  joi.number().min(1).required(),
   "description" : joi.string().required(),
   "effDate" : joi.string().required(),
 };


//adding new teammember to the database
router.put('/addAtt',(req,res) => {
    
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Attendence = {
        status : req.body.status,
        time: req.body.time,
        teamMemId: req.body.teamMemId,
        empId:  req.body.empId,
        comId:  req.body.comId,
        description:  req.body.description,
        effDate:  req.body.effDate
        }
        var sql = "insert into attendence ( attendence.status , attendence.dateNtime , attendence.teamMemberId ,\n"+ 
            "attendence.employeeId , attendence.companyId, attendence.description , attendence.effectiveDate )\n"+
        "values (?, ? , ? , ? , ? , ? , ?);"
    connection.query(sql,
    [Attendence.status , Attendence.time , Attendence.teamMemId , 
        Attendence.empId , Attendence.comId , Attendence.description, Attendence.effDate ],
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