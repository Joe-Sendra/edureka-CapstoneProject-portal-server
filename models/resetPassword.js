const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const resetPasswordSchema = new mongoose.Schema({  
  email: {type: String, required: true, unique: true},
  token: {type: String, required: true},
  expire: {type: Date, required: true}
});

resetPasswordSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ResetPassword', resetPasswordSchema, 'password_reset');