const express = require('express');

const AuthController = require('../controllers/controlAuth');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/auth/login
router.post('/login', AuthController.login);

// /api/v1/auth/reset
router.post('/reset', AuthController.resetPassword);

// /api/v1/auth/change
router.post('/change', checkAuth, AuthController.changePassword);

module.exports = router;