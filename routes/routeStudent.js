const express = require('express');

const StudentController = require('../controllers/controlStudent');

const router = express.Router();

// /api/v1/students
router.get('/', StudentController.getStudents); // TODO add checkAuth


// /api/v1/students/:studentID
router.get('/:studentID', StudentController.getStudent) // TODO add checkAuth


// /api/v1/students/:studentID/gp/
router.get('/:studentID/gp/', StudentController.getStudentGatePasses); // TODO add checkAuth


// /api/v1/students/:studentId/leave
router.post('/:studentId/leave', StudentController.addStudentLeave);
router.get('/:studentId/leave', StudentController.getStudentLeave);


// /api/v1/students/:studentId/leave/:leaveId
router.patch('/:studentId/leave/:leaveId', StudentController.updateStudentLeave);


// /api/v1/users/students/leave/:status
// TODO create routeLeave then move router.get('/students/leave/:status', UserController.getStudentLeaves);

module.exports = router;