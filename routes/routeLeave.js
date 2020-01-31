const express = require('express');

const StudentController = require('../controllers/controlStudent');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


// /api/v1/leaves/:status
router.get('/:status', checkAuth, StudentController.getStudentLeaves);

module.exports = router;