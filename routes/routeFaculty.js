const express = require('express');

const FacultyController = require('../controllers/controlFaculty');

const router = express.Router();

// /api/v1/faculty
router.get('/', FacultyController.getFaculty); // TODO add checkAuth

// /api/v1/faculty/:facultyID
router.get('/:facultyID', FacultyController.getFacultyMember) // TODO add checkAuth

module.exports = router;