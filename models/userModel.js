const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Job = require('./jobModel');
let userSchema = new Schema({
   userName:String,
   manager:Boolean,
   jobs:{
    type: Schema.Types.ObjectId,
    ref: 'Job'
   },
   jobsCount:{
    type:Number,
    default:0
}
});
   
let User = mongoose.model('User',userSchema);

module.exports=User;