import React, { Component } from 'react';

import './jobs.css';

class Jobs extends Component {
constructor(){
    super();
    this.state={
        jobs:[],
        managerChecked: false , 
        groupId:0,
        groups:[],
        groupSelected:false

    }

    this.save = this.save.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.loadGroupTasks = this.loadGroupTasks.bind(this);
    
    
  //  this.delete = this.delete.bind(this);
}


handleUserChange() {
  this.setState({
    managerChecked: !this.state.managerChecked
  })
}


delete(key){
  fetch('/api/job/'+key, {
     method: 'DELETE'
    }).then(res => {
    res.json().then( res =>
     {
       console.log('Response Data');
       console.log(res.data);
       console.log('State Data');
       console.log(this.state.jobs); 
       if(res.status !== "200"){
        alert("Deletion Falied");
        return;
      }
       var matchIndex=-1;
       for(var i=0;i<this.state.jobs.length;i++){
        if(this.state.jobs[i]._id === res.data._id){
            matchIndex=i;
        }
       }
       var array = this.state.jobs; 
       array.splice(matchIndex,1);
       console.log(array);
       this.setState({jobs: array});
      
      }
   )
 })
}


edit(key){
  var jobId = key;
  var userName = document.getElementById('userName').value;
  var groupId = this.state.groupId;
 if(userName === '' || userName === ' ')
  {
    alert("Enter UserName");
    return;
  }
  fetch('/api/job', {
     method: 'PUT',
     headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        'jobId': jobId,
        'userName': userName,
        'groupId':groupId
     })
    }).then(res => {
    res.json().then( res =>
     {
       if(res.status !== "200"){
          alert("No such User Exists");
          return;
        }

       var matchIndex=-1;
       for(var i=0;i<this.state.jobs.length;i++){
        if(this.state.jobs[i]._id === res.data._id){
            matchIndex=i;
        }
       }
       var array = this.state.jobs; 
       array.splice(matchIndex,1,res.data);
       //array.push(res.data);
       console.log(array);
       this.setState({jobs: array});
      
      }
   )
 })
}



save(){
  var jobName = document.getElementById('jobName').value;
  var groupId = this.state.groupId;
  fetch('/api/job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        'jobName': jobName,
        'groupId':groupId
     })
}).then(res => {
  res.json().then( res =>
    {
      if(res.status !== "200"){
        alert("Insertion failed");
        return;
      }
      var newArray = this.state.jobs.slice();    
       newArray.push(res.data);   
        this.setState({jobs:newArray})
      //this.state.jobs.push(res.data);
      document.getElementById('jobName').value='';
      console.log(res.data);
    }
  )
})
}

loadGroupTasks(){
var groups = document.getElementsByName('groups');
var groupId;
for(var i = 0; i < groups.length; i++){
    if(groups[i].checked){
        groupId = groups[i].value;
    }
}

this.setState({groupId:groupId});
this.setState({groupSelected:true});

fetch('api/job/'+ groupId).then(res => 
  res.json()).then(jobs => this.setState({jobs:jobs.data},() =>
      console.log('Jobs Fetched...',jobs.data)
  )
);
}

componentDidMount(){
fetch('api/group').then(res => 
    res.json()).then(groups => {
      this.setState({groups:groups.data},() =>{
        console.log(groups.data);
      })
    }
);
}
render() {
    return (
      


      <div>
        <h1>Groups</h1>
         <ul>
         {  this.state.groups.map(group =>
           <li key={group._id} >
           
           <p>{group.groupName}</p>
           <input
              type="radio"
              value={group._id}
              name='groups'
              onChange={this.loadGroupTasks}
            />

           </li>
         )}</ul>
        {this.state.groupSelected && 
        <div>
        <label>Manager/User</label>
        <input 
          type="checkbox" 
          managerChecked={ this.state.managerChecked } 
          onChange={ this.handleUserChange } />
        
       <h1>Job</h1>
       <ul>
         {  this.state.jobs.map(job =>
           <li key={job._id} >
           <p> {job.jobName} </p>
           <p> {job.User.userName} </p>
           <input
              type="radio"
              value="small"
              onChange={() => void(0)}
              managerChecked={job.User.manager} 
          />
            <button onClick={() => this.delete(job._id)} className='button-primary'>DELETE</button>
            {this.state.managerChecked && 
            <div>
            <button onClick={() => this.edit(job._id)} className='button-primary'>EDIT</button>
            </div>
            }
            </li>
         )}</ul>

 {this.state.managerChecked && 
  <div>
<h1>Job Update</h1>
 <p>New User Name</p><input type="text" name="" id="userName"></input>
 </div>
 }
        <h1>Job Save</h1>
         <p>Job Name</p><input type="text" name="" id="jobName"></input>
         <button onClick={this.save} className='button-primary'>SAVE</button>
      </div>
        }
</div>
      
    );
    
  }
}

export default Jobs;
