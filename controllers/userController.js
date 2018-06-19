const express = require('express');
const app = new express.Router();
const userModel = require('../models/userModel');

app.get('/',function(req,res){
    console.log("Hello From User Get");
    
    userModel.find().populate({
        path:'tasks'}).then(users =>{
        let response = {};
        response.status="200";
        response.message="Success";
        response.data=users;
        return res.json(response);
    }).catch(error =>{
            res.send(error.toString());    
    });
});



app.post('/',function(req,res){
    console.log("Hello From User Post");
    let requestBody = req.body;
    console.log('POST REQUEST', requestBody);
    let user = new userModel();
    user.userName = requestBody.userName;
    user.manager=requestBody.manager;
    user.save().then(user =>{
        return res.json(user);
    }).catch(error =>{
        consoel.log('DB insertion failed!!!');
        res.send(error.toString());
    })
});



module.exports=app;