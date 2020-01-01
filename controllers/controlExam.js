// Models for mongoose schema
const Exam = require('../models/exam');

exports.addExam = (req, res, next) => {
    const newExam = {
        examDate: req.body.exam.examDate,
        examTime: req.body.exam.examTime,
        name: req.body.exam.name,
        location: req.body.exam.location
    }
    Exam.create( newExam , (err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not register user.");
        }
        res.status(201).json({
            message : "Exam successfully added",
            exam: exam
        });
    });
}
