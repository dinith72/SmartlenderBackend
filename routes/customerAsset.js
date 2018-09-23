const express = require('express');
const joi = require('joi');
const router =  express();
const cors = require('cors');
router.use(cors());
router.use(express.json()); // convert the jason data to the body
const connection = require('../conFig/dbConnection'); // getting db info



// // creating the connection
// connection.connect((err)=>{
//     if(err){
//         console.log(err);
//     }
// });

//add new customer : schema definition
const schemaAdd = {
    nic : joi.string().required(),
    comId: joi.number().min(1).required(),
    title : joi.string().required(),
    firstName : joi.string().required(),
    lastName: joi.string().required(),
    address : joi.string().required(),
    dob : joi.string().required(),
    status : joi.string().min(1).max(1).required(),
    profPicUrl : joi.string()
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
        comId: req.body.comId,
        title : req.body.title,
        firstName : req.body.firstName,
        lastName: req.body.className,
        address : req.body.address,
        dob : req.body.dob,
        status: req.body.status,
        profPicUrl : req.body.profPicUrl

    };
    const sql = "insert into customer ( customer.NIC , customer.company_idcompany , customer.title , customer.firstName ,\n" +
        " customer.lastName , customer.adress , customer.birthdate , customer.`status` , customer.profilePicUrl) \n" +
        "values (? , ? , ?, ? , ? , ? , ? , ? , ?);";
    connection.query(sql,
        [customer.nic ,customer.comId, customer.title , customer.firstName , customer.lastName, customer.address ,  customer.dob ,customer.status ,
            customer.profPicUrl],
        (err,result)=>{
            if(err){
                res.status(400).send(error);
                return;
            }
            if(result.affectedRows >0){
                res.status(200).send("success")
            }else{
                res.status(400).send("error in addition of record ");
            }


        });


});


// get details of the customer asset of customer
router.get('/:nic/:comId',(req,res) =>{
    const comId = req.params.comId ;
    const  nic = req.params.nic;
    // username is passed as varible
    const sql = "select * from customerasset where customerasset.customer_company_idcompany = ?" +
        " and customerasset.customer_NIC = ?;";
    connection.query(sql,
        [comId,nic],(error,rows,fields)=>{
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

router.get('/:comId',(req,res) =>{
    const comId = req.params.comId ;
    // username is passed as varible

    connection.query("SELECT * FROM customer where  customer.company_idcompany = ? ;",
        [comId],(error,rows,fields)=>{
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
router.post('/updateCus',(req,res)=>{
    const result = joi.validate(req.body, schemaAdd);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = {
        nic : req.body.nic,
        comId: req.body.comId,
        title : req.body.title,
        firstName : req.body.firstName,
        lastName: req.body.className,
        address : req.body.address,
        dob : req.body.dob,
        status: req.body.status,
        profPicUrl : req.body.profPicUrl

    };

    const sql = "update customer set  customer.title = ?,customer.firstName = ? , customer.lastName = ? , customer.adress = ? , customer.birthdate = ?,\n" +
        "customer.`status` = ?, customer.profilePicUrl = ? \n" +
        "where customer.NIC = ? and customer.company_idcompany = ?  ;";

    connection.query(sql,
        [ customer.title , customer.firstName , customer.lastName, customer.address ,  customer.dob ,customer.status ,
            customer.profPicUrl , customer.nic ,customer.comId],
        (err , result)=>{
            if(err){
                res.status(400).send(err);
                return;
            }
            if(result.affectedRows >0){
                res.send("success");
            }else{
                res.status(400).send("incorrect customer id , company id combination");
            }
            console.log(result.rowsAffected);
        }) ;



});
// connection.end();
module.exports = router;