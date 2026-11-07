const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Dedicated rate limiter for forgot-password: max 5 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dedicated rate limiter for reset-password attempts: max 10 attempts per 15 minutes per IP
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many password reset attempts from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Forgot & Reset Password routes with dedicated rate limiting
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPasswordLimiter, resetPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

module.exports = router;