const mongoose = require('mongoose');

const GatePassSchema = new mongoose.Schema({
  student: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

const ExamTimetableSchema = new mongoose.Schema({
  examDate: {type: String, required: true},
  examTime: {type: String, required: true},
  gatePass: [GatePassSchema]
});

const ExamSchema = new mongoose.Schema({  
  name: {type: String, required: true},
  location: {type: String, required: true},
  timeTable: [ExamTimetableSchema],
});

ExamSchema.index({ 'name': 1, 'location': 1}, {unique: true});

ExamSchema.set('autoIndex', true);

module.exports = mongoose.model('Exam', ExamSchema, 'exams');
