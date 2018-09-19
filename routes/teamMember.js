const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new team  member  : schema definition
const schemaAdd = {
   "cusId": joi.string().required(),
   "comId": joi.number().min(1).required(),
   "teamId": joi.number().min(1).required()
};
const schemaUpdate = {
    "teamMemId" : joi.number().min(1).required(),
    "cusId": joi.string().required(),
    "teamId": joi.number().min(1).required()
 };


//adding new teammember to the database
router.put('/addTmem',(req,res) => {
    
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const TeamMember = {
        cusId : req.body.cusId,
        comId : req.body.comId,
        teamId : req.body.teamId,
        }
        var sql = "insert into teammember ( teammember.customerId , teammember.comapnyId , teammember.teamId)\n"+
            "values (? ,  ? , ? );"
    connection.query(sql,
    [TeamMember.cusId , TeamMember.comId , TeamMember.teamId ],
    (err,result)=>{
        if(err){   
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send(result.insertId.toString())
        }else{
            res.status(400).send("error in addition of record in team member ");
        }


    });


});


// get a team meber with a specific id
router.get('/:teamMemId',(req,res) =>{
    var teamMemId = req.params.teamMemId ;
    connection.query("SELECT * FROM teammember where teammember.idteamMember = ?;",
        [teamMemId],(error,rows,fields)=>{
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

// update the employee with some details
router.post('/updateTmem',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const TeamMember = {
        teamMemId : req.body.teamMemId,
        cusId : req.body.cusId,
        teamId : req.body.teamId
        }
    
    
    var sql = "update teammember set  teammember.customerId = ? ,  teammember.teamId = ?\n"+
    "where teammember.idteamMember = ? ;";

        connection.query(sql,
            [ TeamMember.cusId , TeamMember.teamId , TeamMember.teamMemId] ,
            (err , result)=>{
                if(err){
                    res.status(400).send(err);
                    return;
                }
                if(result.affectedRows >0){
                    res.send("success");
                }else{
                    res.status(400).send("incorrect employee nic or company id");
                }
            console.log(result.rowsAffected);
        }) ;



});
// connection.end();
module.exports = router;