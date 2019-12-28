const express = require('express');

const UserController = require('../controllers/controlUser');
const EnrollController = require('../controllers/controlEnroll');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

// Middleware - Log
const enrollProcess = require('../middleware/enrollProcess');

const router = express.Router();

// /api/v1/users
router.get('/', checkAuth, UserController.getAllUsers);
router.post('/', UserController.addUser);
router.patch('/', UserController.updateUser); // TODO add checkAuth


// /api/v1/users/reset-password
router.post('/reset-password', UserController.resetPassword);

// /api/v1/users/students
router.get('/students', UserController.getAllStudents); // TODO add checkAuth


// /api/v1/users/students/:studentId
router.get('/students/:studentId', UserController.getStudent); // TODO add checkAuth


// /api/v1/users/enroll
router.get('/enroll', EnrollController.getNonRegistered); // TODO add checkAuth
router.post('/enroll', EnrollController.addEnroll); // TODO add checkAuth


// /api/v1/users/enroll/register
router.post('/enroll/register',
    EnrollController.enrollStudent,
    enrollProcess,
    UserController.addUser,
    enrollProcess,
    EnrollController.enrollStudent);

module.exports = router;




