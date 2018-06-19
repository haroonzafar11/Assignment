const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const User = require('./userModel');
const Group = require('./groupModel');

let jobSchema = new Schema({
   jobName:String,
   User:{
    type: Schema.Types.ObjectId,
    ref: 'User'
   },
   Group:{
    type: Schema.Types.ObjectId,
    ref: 'Group'
   }
});
   
let Job = mongoose.model('Job',jobSchema);

module.exports=Job;