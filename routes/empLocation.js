const express = require('express');
const baseJoi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
const dateExtension = require('joi-date-extensions');
const joi = baseJoi.extend(dateExtension);
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new team : schema definition
const schemaAdd = {
   "empId": joi.string().required(),
    "comId": joi.number().min(0).required(),
    "timeStamp": joi.string().required(),
    "latitude": joi.strict().required(),
    "longitude" : joi.strict().required()
};


//adding new paymnet to the database
router.put('/addLoc',(req,res) => {
    
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Location = {
        empId : req.body.empId,
        comId: req.body.comId,
        timeStamp: req.body.timeStamp,
        latitude: req.body.latitude ,
        longitude:  req.body.longitude   
        }
        var sql = "insert into employee_location (employee_location.employeeId , employee_location.comId , employee_location.timestamp , employee_location.latitude , employee_location.logitude)\n"+
        "values(? , ?, ? , ? , ?);"
    connection.query(sql,
    [Location.empId , Location.comId , Location.timeStamp , Location.latitude , Location.longitude ],
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


// get a location entries for employee id
// router.get('/:empId',(req,res) =>{
//     var empId = req.params.empId ;
//     connection.query("SELECT * FROM employee_location where employee_location.employeeId = ? " +
//         "and employee_location.timestamp like ?;",
//         [empId],(error,rows,fields)=>{
//             if(error){
//                 console.log(`error : ${error}`);
//             } else{
//                 // console.log(rows[0]);
//                 if(rows ){
//                     res.send(rows);
//                     return;
//                 }
//                 res.status(400).send('no entries found ');
//
//             }
//     });
//
// });
// get a location entries for employee id within give date format
router.get('/:empId/:dts/:dte',(req,res) =>{
    const schemaDate= {
        "empId": joi.string().required(),
        "dts" : joi.date().format('YYYY-MM-DD'),
        "dte" : joi.date().format('YYYY-MM-DD')
    }
    var empId = req.params.empId ;
    var dtStart = req.params.dts;
    var dtEnd = req.params.dte;
    const resultDate = joi.validate(req.params, schemaDate);
    if (resultDate.error) {
        res.status(400).send(resultDate.error.details[0].message);
        return;
    }
    connection.query("select * from employee_location where employee_location.employeeId = ? and employee_location.`timestamp` > ?\n"+
    "and employee_location.`timestamp` < ?;",
        [empId,dtStart,dtEnd],
        (error,rows,fields)=>{
            if(error){
                console.log(`error : ${error}`);
            } else{
                // console.log(rows[0]);
                if(rows ){
                    res.send(rows);
                    return;
                }
                res.status(400).send('no entries found ');

            }
    });

});


// get location of an employee with nic and company id
router.get('/:nic/:date',(req,res) =>{
    var date = req.params.date ;
    var nic = req.params.nic;
    
    const sql = "SELECT * FROM employee_location where employee_location.timestamp like ? and " +
        "employee_location.employeeId = ? ;"
    connection.query(sql,
        [date+'%',nic],(error,rows,fields)=>{
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

// get the location entries for employees in a given time period
// router.post('/report/datePeroid',(req,res) =>{
//     var empId = req.body.empId ;
//     var dtStart = req.body.dts;
//     var dtEnd = req.body.dte;
//     connection.query("select * from employee_location where employee_location.employeeId = ? and employee_location.`timestamp` > ?\n"+
//      "and employee_location.`timestamp` < ?;",
//         [empId,dtStart,dtEnd],
//         (error,rows,fields)=>{
//             if(error){
//                 console.log(`error : ${error}`);
//             } else{
//                 // console.log(rows[0]);
//                 if(rows ){
//                     res.send(rows);
//                     return;
//                 }
//                 res.status(400).send('no entries found ');

//             }
//     });

// });

// update the employee with some details

// connection.end();
module.exports = router;