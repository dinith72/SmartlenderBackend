const express = require('express');
const portInfo = require('../../conFig/portConfig');
const router =  express();
console.log(portInfo.port);
router.get('/',(req,res) =>{
    res.send('login works');
})



// router.listen(portInfo.port);

module.exports = router;