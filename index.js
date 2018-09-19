const login = require('./routes/login');
const company = require('./routes/company');
const branch = require('./routes/branch');
const loan = require('./routes/loan');
const payment = require('./routes/payment');
const custermer = require('./routes/customer');
const center = require('./routes/center');
const loancycle = require('./routes/loanCycle');
const employee = require('./routes/employee');
const team = require('./routes/team');
const teamMember = require('./routes/teamMember');
const attendence = require('./routes/attendence');
const empLocation = require('./routes/empLocation');
const application = require('./routes/application');

const portConfig = require('./conFig/portConfig');
const express = require('express');
const app = express();
// console.log(process.env.PORT);

app.get('/api',(req,res)=>{
    res.send('hello ....SmartLender');
});

app.use('/api/login',login);
app.use('/api/com',company);
app.use('/api/brn',branch);
app.use('/api/cen',center)
app.use('/api/loan',loan);
app.use('/api/cus', custermer);
app.use('/api/lc',loancycle);   
app.use('/api/pmt',payment);
app.use('/api/emp',employee);
app.use('/api/team',team);
app.use('/api/tmem',teamMember);
app.use('/api/att',attendence);
app.use('/api/loc',empLocation);
app.use('/api/apl',application);

app.listen(portConfig.port, ()=>{
    console.log(`listining on port ${portConfig.port}`);
});