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
router.patch('/', checkAuth, UserController.updateUser);


// /api/v1/users/reset-password
router.post('/reset-password', UserController.resetPassword);


// /api/v1/users/enroll
router.get('/enroll', checkAuth, EnrollController.getNonRegistered);
router.post('/enroll', checkAuth, EnrollController.addEnroll);


// /api/v1/users/enroll/register
router.post('/enroll/register',
    checkAuth,
    EnrollController.enrollStudent,
    enrollProcess,
    UserController.addUser,
    enrollProcess,
    EnrollController.enrollStudent
);


// /api/v1/users/enroll/register/email
router.post('/enroll/register/email', checkAuth, EnrollController.emailStudents)

module.exports = router;




