const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors()); 
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info


//add new employee : schema definition
const schemaAdd = {
   "nic" : joi.string().min(9).max(12).required(),
   "comId": joi.number().min(1).required(),
   "epfNo": joi.string(),
   "title": joi.string().required(),
   "fName": joi.string().required(),
    "lName": joi.string().required(),
    "position": joi.string(),
    "salary": joi.number().min(0).required(),
    "bdate": joi.string(),
    "joinedDate" : joi.string().required()

};


//adding new paymnet to the database
router.put('/addEmp',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Employee = {
        nic : req.body.nic ,
        comId: req.body.comId ,
        epfNo: req.body.epfNo,
        title: req.body.title,
        fName :req.body.fName , 
        lName: req.body.lName,
        position:req.body.position ,
        salary: req.body.salary,
        bdate: req.body.bdate,
        joinedDate: req.body.joinedDate,        
        }
        var sql = "insert into employee (employee.NIC , employee.company_idcompany , employee.`EPF number` , employee.title , employee.firstName , \n" +
        "employee.lastName , employee.position , employee.remuneration , employee.birthdate , employee.joinedDate) \n" + 
        "values ( ? , ? , ? , ? , ? , ? , ? , ?, ? , ?);"
    connection.query(sql,
    [ Employee.nic , Employee.comId , Employee.epfNo , Employee.title , Employee.fName , Employee.lName , 
        Employee.position , Employee.salary , Employee.bdate , Employee.joinedDate],
    (err,result)=>{
        if(err){   
            res.status(400).send(err);
            return;
        }
        if(result.affectedRows >0){
            res.status(200).send("success")
        }else{
            res.status(400).send("error in addition of record in employee ");
        }


    });


});


// get a employee with a specific id
router.get('/:comId/:nic',(req,res) =>{
    var comId = req.params.comId ;
    var nic = req.params.nic;
    
    
        connection.query("SELECT * FROM employee where employee.NIC = ? and employee.company_idcompany = ?;",
            [nic,comId],(error,rows,fields)=>{
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
router.post('/updateEmp',(req,res)=>{
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const Employee = {
        nic : req.body.nic ,
        comId: req.body.comId ,
        epfNo: req.body.epfNo,
        title: req.body.title,
        fName :req.body.fName , 
        lName: req.body.lName,
        position:req.body.position ,
        salary: req.body.salary,
        bdate: req.body.bdate,
        joinedDate: req.body.joinedDate,        
        }
    
    
    var sql = "update employee set employee.`EPF number` = ? , employee.title = ? , employee.firstName = ? , employee.lastName = ?, \n"+
    "employee.position = ? , employee.remuneration = ? , employee.birthdate = ? , employee.joinedDate = ? \n" +
    "where employee.NIC = ? and employee.company_idcompany = ? ;";

        connection.query(sql,
            [Employee.epfNo , Employee.title, Employee.fName , Employee.lName , Employee.position , Employee.salary ,
              Employee.bdate , Employee.joinedDate, Employee.nic , Employee.comId ],
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