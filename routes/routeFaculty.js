const express = require('express');

const FacultyController = require('../controllers/controlFaculty');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/faculty
router.get('/', checkAuth, FacultyController.getFaculty);

// /api/v1/faculty/:facultyID
router.get('/:facultyID', checkAuth, FacultyController.getFacultyMember);

module.exports = router;