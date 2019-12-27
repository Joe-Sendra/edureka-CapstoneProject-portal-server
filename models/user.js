const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({  
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
  isLockedOut: {type: Boolean, required: true},
  resetPassword: {type: Boolean, required: true},
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  address: {
    street: {type: String},
    city: {type: String},
    state: {type: String},
    zipcode: {type: String}
  },
  phone: {
    home: {type: String},
    work: {type: String},
    mobile: {type: String}
  }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema, 'users');