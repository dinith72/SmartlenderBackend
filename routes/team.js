const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new team : schema definition
const schemaAdd = {
   "teamName": joi.string().required(),
   "setUpDate": joi.string().required(),
   "dissolvedDate": joi.string(),
    "centerId": joi.number().min(0).required(),
    "status": joi.number().min(1).required(),
};
const schemaUpdate = {
    "teamId" : joi.number().min(1).required(),
    "teamName": joi.string().required(),
    "setUpDate": joi.string().required(),
    "dissolvedDate": joi.string(),
     "centerId": joi.number().min(0).required(),
     "status": joi.number().min(1).required(),
 };


//adding new paymnet to the database
router.put('/addTeam',(req,res) => {
    
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Team = {
        teamId : req.body.teamId ,
        name: req.body.teamName ,
        setUpDate: req.body.setUpDate,
        dissolvedDate: req.body.dissolvedDate,
        centerId:req.body.centerId , 
        status: req.body.status,    
        }
        var sql = "insert into team ( team.teamName , team.setUpDate ,team.dissolvedDate , team.center_idcenter , team.ststus) \n"+
       " values (? ,  ? , ? , ? , ? );"
    connection.query(sql,
    [Team.name, Team.setUpDate , Team.dissolvedDate , Team.centerId , Team.status ],
    (err,result)=>{
        if(err){   
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send(result.insertId.toString())
        }else{
            res.status(400).send("error in addition of record in team ");
        }


    });


});


// get a employee with a specific id
router.get('/:teamId',(req,res) =>{
    var teamId = req.params.teamId ;
    connection.query("SELECT * FROM team where team.idteam = ?;",
        [teamId],(error,rows,fields)=>{
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
router.post('/updateTeam',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Team = {
        teamId : req.body.teamId ,
        name: req.body.teamName ,
        setUpDate: req.body.setUpDate,
        dissolvedDate: req.body.dissolvedDate,
        centerId:req.body.centerId , 
        status: req.body.status,    
        }
    
    
    var sql = "update team set team.teamName = ? , team.setUpDate = ? , team.dissolvedDate = ? , \n" + 
    " team.center_idcenter = ? , team.ststus = ? where team.idteam = ? ;";

        connection.query(sql,
            [Team.name , Team.setUpDate , Team.dissolvedDate , Team.centerId , Team.status , Team.teamId ],
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