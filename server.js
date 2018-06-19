const express= require('express');
const app = new express();
const mongoose = require('mongoose');
const groupController = require('./controllers/groupController.js');
const userController = require('./controllers/userController.js');
const jobController = require('./controllers/jobController.js');
const bodyParser = require('body-parser');
let connectionString="mongodb://127.0.0.1:27017/TaskAllocation";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(connectionString);
mongoose.promise=global.promise;
let db=mongoose.connection;

db.on('error',function(){
    console.log("Error connecting to DB");
});

db.once('open',function(){
    console.log("DB connected",connectionString);
    app.listen(5000,"localhost",function(){
        console.log("Welcome");
        });
});

app.get('/api/customers', (req, res) => {
    const customers = [
      {id: 1, firstName: 'John', lastName: 'Doe'},
      {id: 2, firstName: 'Brad', lastName: 'Traversy'},
      {id: 3, firstName: 'Mary', lastName: 'Swanson'},
    ];
  
    res.json(customers);
  });

  
  app.use('/api/job',jobController);
  app.use('/api/user',userController);
  app.use('/api/group',groupController);