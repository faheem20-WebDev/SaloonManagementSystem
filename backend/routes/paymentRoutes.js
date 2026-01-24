const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  recordTransaction, 
  processRefund,
  getRevenueStats
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Base URL: /api/payment

// Get Revenue Stats
router.get('/stats', protect, getRevenueStats);

// Create payment intent (Initialize payment)
router.post('/create-intent', protect, createPaymentIntent);

// Record successful payment in DB
router.post('/record-success', protect, recordTransaction);

// Request a refund
router.post('/refund', protect, processRefund);

module.exports = router;