const express = require('express');

const ExamController = require('../controllers/controlExam');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/exams
router.post('/', ExamController.addExam);

module.exports = router;
