const express = require('express');
const joi = require('joi');
const router =  express();
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info



// creating the connection
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
});

//add new customer : schema definition
const schemaAdd = {
    nic : joi.string().min(9).max(12).required(),
    name : joi.string().required(),
    gender : joi.string().required(),
    status : joi.string().required(),
    dob : joi.string().required(),
    address : joi.string().required(),
    businessType: joi.string().required(),
    

};

// update loan info : schema definition
const schemaUpdate = {
    nic : joi.string().min(9).max(12).required(),
    name : joi.string().required(),
    gender : joi.string().required(),
    status : joi.string().required(),
    dob : joi.string().required(),
    address : joi.string().required(),
    businessType: joi.string().required(),
};

//adding new loan to the database
router.put('/addCus',(req,res) => {
    // console.log('add user');
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = {
        nic : req.body.nic,
        name : req.body.name,
        gender: req.body.gender,
        status: req.body.status,
        dob : req.body.dob,
        address : req.body.address,
        businessType : req.body.businessType

    }

    connection.query("",
    [customer.nic , customer.name, customer.gender , customer.status , customer.dob ,
         customer.address , customer.businessType],
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


// get a payment with a specific id
router.get('/:id',(req,res) =>{
    var id = req.params.id ;
    // username is passed as varible
    
        connection.query("",
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

// update the payment with some details
router.post('/updatePmt',(req,res)=>{
    const result = joi.validate(req.body, schemaUpdate);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = {
        nic : req.body.nic,
        name : req.body.name,
        gender: req.body.gender,
        status: req.body.status,
        dob : req.body.dob,
        address : req.body.address,
        businessType : req.body.businessType

    }
    
    var sql = "";

        connection.query(sql,[ customer.name, customer.gender , customer.status , customer.dob ,
            customer.address , customer.businessType , customer.nic ,],
            (err , result)=>{
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
// connection.end();
module.exports = router;