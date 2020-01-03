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

exports.getExams = (req, res, next) => {
    Exam.find({},(err,exams) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exams.");
        }
        res.status(200).json(exams);
    });
}

exports.addGatePass = (req, res, next) => {
    const examID = req.body.examID;
    const studentID = req.body.studentID;
    Exam.findById(examID,(err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error can not find examID in DB.");
        }
        exam.gatePass.push(studentID);
        exam.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not add student gatepass to examID.");
            } 
            res.status(201).json({
                message : "Student gatepass successfully added to exam id"
            });
        });
    });
}

exports.removeGatePass = (req, res, next) => {
    const examID = req.params.examID;
    const studentID = req.params.studentID;
    Exam.findById(examID,(err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error can not find examID in DB.");
        }
        const index = exam.gatePass.indexOf(studentID);
        exam.gatePass.splice(index,1);
        exam.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not remove student gatepass from examID.");
            } 
            res.status(201).json({
                message : "Student gatepass successfully removed from exam id"
            });
        });
    });
}

exports.viewGatePass = (req, res, next) => {
    Exam.findOne({_id: req.params.examID},{gatePass: 1}, (err, exam)=>{
        if (err) {
            console.log(err);
            return res.status(500).send("Server error retrieving gate pass list.");
        }
        res.status(200).json({gatePassList: exam.gatePass});
    });
}

exports.getStudentGatePasses = (req, res, next) => {
    // /api/v1/exams/:studentID/gp/
    Exam.find({},(err,exams) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exams.");
        }
        let studentGatePasses;
        studentGatePasses = exams.filter(exam => exam.gatePass.includes(req.params.studentID));
        studentGatePasses = studentGatePasses.map(exam => {
            return {
                _id: exam._id,
                examDate: exam.examDate,
                examTime: exam.examTime,
                name: exam.name,
                location: exam.location
            }
        });
        res.status(200).json(studentGatePasses);
    });
}