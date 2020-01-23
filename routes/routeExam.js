const express = require('express');

const ExamController = require('../controllers/controlExam');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/exams
router.post('/', ExamController.addExam);
router.get('/', ExamController.getExams);

// /api/v1/exams/:examID
router.post('/:examID', ExamController.addTimeTable);
router.get('/:examID', ExamController.getExam);

// /api/v1/exams/:examID/shifts
router.get('/:examID/shifts', ExamController.getExamShifts);


// /api/v1/exams/:examID/shifts/:shiftID
router.get('/:examID/shifts/:shiftID', ExamController.getExamShift);
router.post('/:examID/shifts/:shiftID', ExamController.addGatePass);
router.patch('/:examID/shifts/:shiftID', ExamController.patchExamShift);
router.delete('/:examID/shifts/:shiftID', ExamController.deleteExamShift);


// /api/v1/exams/:examID/shifts/:shiftID/gp
router.get('/:examID/shifts/:shiftID/gp', ExamController.viewGatePasses);

// /api/v1/exams/:examID/shifts/:shiftID/gp/:gpID
router.delete('/:examID/shifts/:shiftID/gp/:gpID', ExamController.removeGatePass);

module.exports = router;
