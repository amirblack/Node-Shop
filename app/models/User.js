const mongoose = require("mongoose");
const uniqueString = require("unique-string");
const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2')
const userschema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  active:{
    type:Boolean,
    default:false,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  roles : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Role'
  }],
  rememberToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON:{virtuals:true}
  
});
userschema.plugin(mongoosePaginate);

userschema.methods.hashPassword = function(password){
  let salt =  bcrypt.genSaltSync(10);
  let hash =  bcrypt.hashSync(password, salt);
  return hash;
}

userschema.methods.comparePassword = function (password) {
  return  bcrypt.compareSync(password, this.password);
};
userschema.methods.hasRole = function (roles) {
  let result = roles.filter(role=>{
    return this.roles.indexOf(role) > -1
  })
  return !! result.length
};
userschema.methods.setRememberToken = function (res) {
  const token = uniqueString();
  res.cookie("remember_token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 90,
    httpOnly: true,
    signed: true
  });
  this.update({
      rememberToken: token
    },
    err => {
      if (err) throw err;
    }
  );
};
userschema.virtual('myroles',{
  ref:'Role',
  localField:'roles',
  foreignField:'_id'
});

module.exports = mongoose.model("User", userschema);
