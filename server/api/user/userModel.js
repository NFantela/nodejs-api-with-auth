const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  role: {
    type:String,
    enum: ['Administrator', 'Editor'],
    default: 'Editor'
  },
  name:{
      type:String
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  } 
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = this.encryptPassword(this.password);
  next();
})


UserSchema.methods = {
  // check the passwords on signin
  authenticate: function(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  // hash the passwords
  encryptPassword: function(plainTextPword) {
    if (!plainTextPword) {
      return ''
    } else {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  },
  toJSON: function(){
    const obj = this.toObject();
    delete obj.password;
    return obj;
  }
};

module.exports = mongoose.model('user', UserSchema);