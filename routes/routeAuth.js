const express = require('express');

const AuthController = require('../controllers/controlAuth');

const router = express.Router();

// /api/v1/auth/login
router.post('/login', AuthController.login);

// /api/v1/auth/reset
router.post('/reset', AuthController.resetPassword);

module.exports = router;