const express = require('express');
const app = new express.Router();
const userModel = require('../models/userModel');
const groupModel = require('../models/groupModel');

app.get('/',function(req,res){
    console.log("Hello From Group Get");
    groupModel.find().populate({
        path:'tasks'}).then(groups =>{
        let response = {};
        response.status="200";
        response.message="Success";
        response.data=groups;
        return res.json(response);
    }).catch(error =>{
            res.send(error.toString());    
    });
  });



app.post('/',function(req,res){
    console.log("Hello From Group Post");
    let requestBody = req.body;
    console.log('POST REQUEST', requestBody);
    let group = new groupModel();
    group.groupName = requestBody.groupName;
    group.save().then(group =>{
        return res.json(group);
    }).catch(error =>{
        consoel.log('DB insertion failed!!!');
        res.send(error.toString());
    })

});

app.put('/',function(req,res){
    console.log("Hello From Group Put");
    let response = {};
    requestBody=req.body;
    groupId = requestBody.groupId;
    userId = requestBody.userId; 
    groupModel.findByIdAndUpdate(groupId,{$push: {"Users":userId}}).then(function(group){
        console.log(group);
        let response = {};
        response.status="200";
        response.message="Success";           
        response.data=group;
        return res.json(response);
    }).catch(function(error){
        res.send(error.toString());
    })
});



module.exports=app;