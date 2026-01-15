const express = require('express');
  const router = express.Router();
  const {
    registerUser,
    loginUser,
    getMe,
  } = require('../controllers/authController');
  const { protect } = require('../middleware/authMiddleware');

  router.post('/register', registerUser);
  router.post('/login', loginUser);
  router.get('/me', protect, getMe);
   router.get('/test', (req, res) => res.send('Auth route is working!'));

  module.exports = router;