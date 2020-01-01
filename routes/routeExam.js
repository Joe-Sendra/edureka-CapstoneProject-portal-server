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

// /api/v1/exams/gp/:exam
router.get('/gp/:examID', ExamController.viewGatePass)

module.exports = router;
