const express = require('express');

const ExamController = require('../controllers/controlExam');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/exams
router.post('/', checkAuth, ExamController.addExam);
router.get('/', checkAuth, ExamController.getExams);

// /api/v1/exams/:examID
router.post('/:examID', checkAuth, ExamController.addTimeTable);
router.get('/:examID', checkAuth, ExamController.getExam);

// /api/v1/exams/:examID/shifts
router.get('/:examID/shifts', checkAuth, ExamController.getExamShifts);


// /api/v1/exams/:examID/shifts/:shiftID
router.get('/:examID/shifts/:shiftID', checkAuth, ExamController.getExamShift);
router.post('/:examID/shifts/:shiftID', checkAuth, ExamController.addGatePass);
router.patch('/:examID/shifts/:shiftID', checkAuth, ExamController.patchExamShift);
router.delete('/:examID/shifts/:shiftID', checkAuth, ExamController.deleteExamShift);


// /api/v1/exams/:examID/shifts/:shiftID/gp
router.get('/:examID/shifts/:shiftID/gp', checkAuth, ExamController.viewGatePasses);

// /api/v1/exams/:examID/shifts/:shiftID/gp/:gpID
router.delete('/:examID/shifts/:shiftID/gp/:gpID', checkAuth, ExamController.removeGatePass);

module.exports = router;
