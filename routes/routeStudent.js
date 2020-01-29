const express = require('express');

const StudentController = require('../controllers/controlStudent');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/students
router.get('/', checkAuth, StudentController.getStudents);


// /api/v1/students/:studentID
router.get('/:studentID', checkAuth, StudentController.getStudent)


// /api/v1/students/:studentID/gp/
router.get('/:studentID/gp/', checkAuth, StudentController.getStudentGatePasses);


// /api/v1/students/:studentId/leave
router.post('/:studentId/leave', checkAuth, StudentController.addStudentLeave);
router.get('/:studentId/leave', checkAuth, StudentController.getStudentLeave);


// /api/v1/students/:studentId/leave/:leaveId
router.patch('/:studentId/leave/:leaveId', checkAuth, StudentController.updateStudentLeave);

module.exports = router;