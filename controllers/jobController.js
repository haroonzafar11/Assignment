const express = require('express');
const app = new express.Router();
const jobModel = require('../models/jobModel');
const userModel = require('../models/userModel');
const groupModel = require('../models/groupModel');

app.get('/:groupId',function(req,res){
    console.log("Hello From Job Get");
    let requestBody = req;
    groupId = requestBody.params.groupId;
    jobModel.find({"Group":groupId}).populate([{
        path:'User'},{path:'Group'}]).then(job =>{
        let response = {};
        response.status="200";
        response.message="Success";
        response.data=job;
        return res.json(response);
    }).catch(error =>{
            res.send(error.toString());    
    });
});


app.post('/',function(req,res){
    console.log("Hello From Job Post");
    let requestBody = req.body;
    groupId = requestBody.groupId;
    groupModel.findById(groupId).then(function(group){
    console.log('GROUP');
    console.log(group);
    userModel.find({
       '_id': { $in: group.Users}}).sort({"jobsCount": 1}).then(function(users){
    console.log("User found for Allocation"+ users[0]);
    let job = new jobModel();
    job.jobName=requestBody.jobName;
    job.User= (users[0]._id);
    job.Group = groupId;
    job.save().then(function(job){
    console.log('Saving Job');
    userModel.findByIdAndUpdate(users[0]._id,{"$push": { "jobs":job._id},"$inc":{"jobsCount":1}}).then(
        function(){
            console.log('Updating User Job count');
            jobModel.populate(job, {path:"User"}).then(job => 
            {
            console.log('Populating User in job')    
            console.log(job)
            let response = {};
            response.status="200";
            response.message="Success";           
            response.data=job;
            return res.json(response);
    });
    }).catch(function(error){
        res.send(error.toString());
    })
    })
    }).catch(function(error){
        res.send(error.toString());
    });
})
  
});

app.delete('/:key',function(req,res){
    console.log("Hello Delete");
    let requestBody=req;
    console.log(requestBody.params.key);
    jobModel.findById(requestBody.params.key).then(job =>{
       var userId = job.User;
       console.log(userId);
       userModel.findByIdAndUpdate(userId,{"$pull": { "jobs":job._id},"$inc":{"jobsCount":-1}}).then(
            () => 
            {
            console.log('User Updated');
            jobModel.findByIdAndRemove(requestBody.params.key).then(job => {
            console.log('Deleting Job');
            console.log(job);
            jobModel.populate(job, {path:"User"}).then(
            () =>
            {
            let response = {};
            response.status="200";
            response.message="Success";
            job.User.jobsCount++; 
            response.data=job;   
               
            console.log(response);
            return res.json(response);
            })
           }).catch(error => {
            res.send(error.toString());
         })
        }   
        )
    })

});


app.put('/',function(req,res){
    console.log("PUT Request");
    let response = {};
    requestBody=req.body;
    groupId = requestBody.groupId;
    userName = requestBody.userName;
    jobModel.findById(requestBody.jobId).then(job => {
        groupModel.findById(groupId).then(function(group){
    userModel.find({ $and:[{'_id': { $in: group.Users}},{ userName:  userName}]}).then(function(users){
        console.log('Users FOUND/NOT');
        console.log(users);
        console.log(users.length);
        if (!users.length) {
            console.log('No result');
            response.status="404";
            response.message="User not found";   
            return res.json(response);
        }
        userModel.findByIdAndUpdate(job.User,{"$pull": { "jobs":job._id},"$inc":{"jobsCount":-1}}).then(
            () => {
        job.User=users[0]._id;
        job.save().then(function(job){
        console.log('Saving Job');
        userModel.findByIdAndUpdate(users[0]._id,{"$push": { "jobs":job._id},"$inc":{"jobsCount":1}}).then(
            function(){
                console.log('Updating User Job count');
                jobModel.populate(job, {path:"User"}).then(job => 
                {
                console.log('Populating User in job')    
                console.log(job)
                
                response.status="200";
                response.message="Success";           
                response.data=job;
                return res.json(response);
        });
        }).catch(function(error){
            res.send(error.toString());
        })
        })
        }).catch(function(error){
            res.send(error.toString());
        })
        })
        
        })
    })
        
});


module.exports=app;