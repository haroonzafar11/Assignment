import React, { Component } from 'react';

import './users.css';

class Users extends Component {
constructor(){
    super();
    this.state={
        users:[]
    }
}

componentDidMount(){
fetch('api/user').then(res => 
    res.json()).then(users => this.setState({users:users.data},() =>
        console.log('Users Fetched...',users.data)
    )
);

}
  render() {
    return (
      <div >
       <h1>Users</h1>
       <ul>
         {  
           this.state.users.map(user =>
           <li key={user._id}> {user.userName} 
              <p>{user.jobsCount}</p>
             <input
              type="radio"
              onChange={() => void(0)}
              value="small"
              checked={user.manager} 
          />
           </li>
           
          



         )}</ul>
      </div>
    );
  }
}

export default Users;
