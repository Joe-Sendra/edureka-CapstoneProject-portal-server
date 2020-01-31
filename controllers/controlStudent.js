const User = require('../models/user');
const Exam = require('../models/exam');

exports.getStudents = (req, res, next) => {
    User.find({role: "student"},{password: 0, __v: 0}, (err, students)=>{
        if (err) return res.status(500).send("Can not fetch students");
        res.status(200).send({students});
    });
}

exports.getStudent = (req, res, next) => {
    User.findOne({_id: req.params.studentID}, {password: 0}, (err, student)=>{
        if (err) return res.status(500).send("Can not fetch student");

        if (student.role !== "student") return res.status(500).send("Student not found");

        return res.status(200).send(student);
    });
}

exports.getStudentGatePasses = (req, res, next) => {
    // /api/v1/students/:studentID/gp/
    const studentID = req.params.studentID;
    Exam.find({},(err,exams) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve exams.");
        }

        let studentGatePasses = [];
        exams.forEach(exam => {
            exam.timeTable.forEach(timeTable => {
                timeTable.gatePass.filter(pass => pass.student === studentID)
                .map(gatePass => {
                    studentGatePasses.push({
                        examID: exam.id,
                        examName: exam.name,
                        examLocation: exam.location,
                        shiftID: timeTable._id,
                        shiftDate: timeTable.examDate,
                        shiftTime: timeTable.examTime,
                        gpID: gatePass._id,
                        gpCreated: gatePass.created,
                    });
                });
            });
        });
        res.status(200).json(studentGatePasses);        
    });
}

exports.addStudentLeave = (req, res, next) => {
    User.findOne({_id: req.params.studentId}, (err, student)=>{
        if (err) return res.status(500).send("Can not fetch student");
        const newLeave = {
            requestDate: req.body.requestDate,
            status: req.body.status,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }
        student.leave.push(newLeave);
        student.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not add student leave.");
            } 
            res.status(201).json({
                message : "Student leave request successfully added"
            });
        })
        
    });
}

exports.getStudentLeave = (req, res, next) => {
    // /api/v1/users/students/:studentId/leave
    User.findOne({_id: req.params.studentId}, {password: 0}, (err, student) => {
        if (err) return res.status(500).send("Can not fetch student");
        return res.status(200).send(student.leave);
    });
}

exports.updateStudentLeave = (req, res, next) => {
    // /api/v1/users/students/:studentId/leave/:leaveId
    User.findOne({_id: req.params.studentId}, (err, student)=>{
        if (err) return res.status(500).send("Can not fetch student");
        const newStatus = req.body.status;
        const requestId = req.params.leaveId;
        student.leave.forEach(leaveRequest => {
            if (leaveRequest._id == requestId) {
                leaveRequest.status = newStatus;
            }
        });
        student.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not update student leave.");
            } 
            res.status(201).json({
                message : "Student leave request successfully updated"
            });            
        });
    });
}

exports.getStudentLeaves = (req, res, next) => {
    const leaveStatus = req.params.status;
    User.find({}, (err, students) => {
        if (err) return res.status(500).send("Can not fetch leave requests");
        let leaveRequests = [];
        students.filter(student => student.leave.length > 0).map(student => {
            student.leave.forEach(leaveRequest => {
                if (leaveRequest.status === leaveStatus || leaveStatus === 'all') {
                    result = {
                        studentId: student._id,
                        email: student.email,
                        leaveRequest
                    }
                    leaveRequests.push(result);
                }
            });
        });
        return res.status(200).json(leaveRequests);
    });
}



