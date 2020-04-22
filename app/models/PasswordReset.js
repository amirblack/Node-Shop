const mongoose = require('mongoose');

const PasswordReset = mongoose.Schema({
    email:{type:String,required:true},
    use:{type:Boolean,default:false},
    token:{type:String},
},{ timestamps : { updatedAt : false } })


module.exports = mongoose.model('PasswordReset',PasswordReset)