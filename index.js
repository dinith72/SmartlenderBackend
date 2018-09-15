const login = require('./routes/login/login');
const portConfig = require('./conFig/portConfig');
const express = require('express');
const app = express();
// console.log(process.env.PORT);

app.get('/api',(req,res)=>{
    res.send('hello ....SmartLender');
});

app.use('/api/login',login);

app.listen(portConfig.port, ()=>{
    console.log(`listining on port ${portConfig.port}`);
});