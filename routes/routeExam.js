const express = require('express');

const ExamController = require('../controllers/controlExam');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/exams
router.post('/', ExamController.addExam);
router.get('/', ExamController.getExams);

// /api/v1/exams/gp
router.post('/gp', ExamController.addGatePass);

// /api/v1/exams/gp/:examID
router.get('/gp/:examID', ExamController.viewGatePass)

// /api/v1/exams/gp/:examID/:studentID
router.delete('/gp/:examID/:studentID', ExamController.removeGatePass);

// /api/v1/exams/:studentID/gp/
router.get('/:studentID/gp', ExamController.getStudentGatePasses);

module.exports = router;
