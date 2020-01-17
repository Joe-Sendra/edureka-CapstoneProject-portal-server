const express = require('express');

const StudentController = require('../controllers/controlStudent');

const router = express.Router();


// /api/v1/leaves/:status
router.get('/:status', StudentController.getStudentLeaves);

module.exports = router;