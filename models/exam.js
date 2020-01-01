const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({  
  examDate: {type: String, required: true},
  examTime: {type: String, required: true},
  name: {type: String, required: true},
  location: {type: String, required: true},
  gatePass: [{type: String}]
});

module.exports = mongoose.model('Exam', ExamSchema, 'exams');
