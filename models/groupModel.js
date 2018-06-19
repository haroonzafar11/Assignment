const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const User = require('./userModel');
let groupSchema = new Schema({
   groupName:String,
   Users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
   }]
});
   
let Group = mongoose.model('Group',groupSchema);

module.exports=Group;