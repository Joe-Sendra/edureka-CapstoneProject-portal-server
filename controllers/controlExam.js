// Models for mongoose schema
const Exam = require('../models/exam');

exports.addExam = (req, res, next) => {
    const examName = req.body.exam.name && req.body.exam.name !== '' ? req.body.exam.name : null;
    const examLocation = req.body.exam.location && req.body.exam.location !== '' ? req.body.exam.location : null;

    if (!examName || !examLocation) {
        return res.status(500).send("Error: Invalid exam data provided");
    }

    const newExam = {
        name: examName.toUpperCase(),
        location: examLocation.toUpperCase()
    }

    Exam.create( newExam , (err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not create exam.");
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

exports.addTimeTable = (req, res, next) => {
    const examID = req.params.examID;
    const examDate = req.body.examShift.examDate && req.body.examShift.examDate !== '' ? req.body.examShift.examDate : null;
    const examTime = req.body.examShift.examTime && req.body.examShift.examTime !== '' ? req.body.examShift.examTime : null;

    if (!examDate || !examTime) {
        return res.status(500).send("Error: Invalid data format provided.");
    }
    const newTimeTable = {
        examDate: examDate,
        examTime: examTime,
    }

    Exam.findById({_id: examID}, (err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not fetch exam.");
        }
        // verify newTimeTable does not exist in Exam.timeTable[]
        if (exam.timeTable.length > 0) {
            let isValidShift = true;
            exam.timeTable.forEach(shift => {
                if ((shift.examDate === newTimeTable.examDate) && (shift.examTime === newTimeTable.examTime)) {
                    isValidShift = false;
                }; 
            });
            if (!isValidShift) return res.status(500).send("Error: time shift already exists");
        }

        exam.timeTable.push(newTimeTable);
        exam.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not add shift to time table.");
            } 
            res.status(201).json({
                message : "Time shift successfully added to time table for exam id"
            })            
        });
    });

}

exports.getExam = (req, res, next) => {
    Exam.find({_id: req.params.examID},(err,exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exam.");
        }
        res.status(200).json(exam);
    });
}

exports.getExamShifts = (req, res, next) => {
    Exam.findOne({_id: req.params.examID},(err,exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exam.");
        }
        res.status(200).json(exam.timeTable);
    });
}

exports.getExamShift = (req, res, next) => {
    // /api/v1/exams/:examID/shifts/:shiftID
    const examID = req.params.examID;
    const shiftID = req.params.shiftID;
    Exam.findOne({_id: examID},(err,exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exam.");
        }
        
        let shift = exam.timeTable.id(shiftID);
        res.status(200).json(shift);
    });
}

exports.addGatePass = (req, res, next) => {
    const examID = req.params.examID;
    const shiftID = req.params.shiftID;
    const studentID = req.body.studentID && req.body.studentID !== '' ? req.body.studentID : null;
    if (!studentID) return res.status(500).send("Error: Invalid student data provided");
    Exam.findById(examID,(err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error can not find examID in DB.");
        }

        let shift = exam.timeTable.id(shiftID);

        if ((shift.gatePass.filter(pass => (pass.student === studentID))).length > 0) {
            return res.status(500).send("Student gatepass already exists for this shift");
        };

        shift.gatePass.push({ student: studentID});

        exam.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not add student gatepass to examID.");
            } 
            res.status(201).json({
                message : "Student gatepass successfully added to exam/shift"
            });
        });
    });
}

exports.viewGatePasses = (req, res, next) => {
    const examID = req.params.examID;
    const shiftID = req.params.shiftID;
    if (examID && shiftID) {
        Exam.findOne({_id: examID}, (err, exam)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error retrieving gate pass list.");
            }
            let gatePasses = exam.timeTable.id(shiftID).gatePass;
            return res.status(200).json({gatePassList: gatePasses});
        });
    } else {
        return res.status(500).send("Error: Invalid request data provided");
    }

}

exports.removeGatePass = (req, res, next) => {
    const examID = req.params.examID;
    const shiftID = req.params.shiftID;
    // const studentID = req.params.studentID;
    const gatepassID = req.params.gpID;

    Exam.findById(examID,(err, exam) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error can not find examID in DB.");
        }

        exam.timeTable.id(shiftID).gatePass.id(gatepassID).remove();

        exam.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not remove student gatepass from examID.");
            } 
            res.status(201).json({
                message : "Student gatepass successfully removed from exam/shift"
            });
        });
    });
}
