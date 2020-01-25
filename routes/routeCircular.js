const express = require('express');

const CircularController = require('../controllers/controlCircular');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/circulars
router.get('/', CircularController.getCirculars);
router.post('/', CircularController.addCircular);

module.exports = router;
