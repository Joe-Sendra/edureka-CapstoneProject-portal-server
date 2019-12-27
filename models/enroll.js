const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const EnrollSchema = new mongoose.Schema({  
  email: {type: String, required: true, unique: true},
  isRegistered: {type: Boolean, required: true},
  isEnrollInProcess: {type: Boolean, required: true}
});

EnrollSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Enroll', EnrollSchema, 'enrollUsers');