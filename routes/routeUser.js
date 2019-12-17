const express = require('express');

const UserController = require('../controllers/controlUser');
const EnrollController = require('../controllers/controlEnroll');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/users
router.get('/', checkAuth, UserController.getAllUsers);
router.post('/', UserController.addUser);

// /api/v1/users/enroll
router.get('/enroll', EnrollController.getNonRegistered); // TODO add checkAuth
router.post('/enroll', EnrollController.addEnroll); // TODO add checkAuth

module.exports = router;




