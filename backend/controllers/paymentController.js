const Stripe = require('stripe');
const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Get Revenue Statistics
const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const getSum = async (fromDate) => {
      const result = await Transaction.sum('amount', {
        where: {
          status: 'succeeded',
          createdAt: {
            [Op.gte]: fromDate
          }
        }
      });
      return result || 0;
    };

    const [daily, weekly, monthly, yearly] = await Promise.all([
      getSum(startOfDay),
      getSum(startOfWeek),
      getSum(startOfMonth),
      getSum(startOfYear)
    ]);

    res.json({
      daily,
      weekly,
      monthly,
      yearly
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// @desc    Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      description: description,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id.toString()
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record Successful Transaction
const recordTransaction = async (req, res) => {
  try {
    const { paymentIntentId, amount, provider } = req.body;

    // Sequelize version of check
    const existing = await Transaction.findOne({ where: { transactionId: paymentIntentId } });
    if (existing) {
      return res.status(200).json(existing);
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount: amount,
      provider: provider || 'stripe',
      transactionId: paymentIntentId,
      status: 'succeeded',
      description: 'Service Payment'
    });

    if (req.body.appointmentId) {
        const appt = await Appointment.findByPk(req.body.appointmentId);
        if (appt) {
            appt.paymentStatus = 'paid';
            appt.transactionId = paymentIntentId;
            await appt.save();
        }
    }

    res.status(201).json(transaction);

  } catch (error) {
    console.error('Record Transaction Error:', error);
    res.status(500).json({ message: 'Failed to record transaction', error: error.message });
  }
};

// @desc    Process Refund
const processRefund = async (req, res) => {
  try {
    const { transactionId, reason } = req.body;

    const transaction = await Transaction.findOne({ where: { transactionId } });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found in records.' });
    }

    if (transaction.status === 'refunded') {
      return res.status(400).json({ message: 'This transaction has already been refunded.' });
    }

    // Check time limit (7 days)
    const daysSincePayment = (Date.now() - new Date(transaction.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysSincePayment > 7) {
      return res.status(400).json({ message: 'Refund period expired. Refunds only allowed within 7 days.' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      reason: reason ? 'requested_by_customer' : null,
    });

    // Update Sequelize instance
    await transaction.update({
      status: 'refunded',
      refundReason: reason
    });

    res.json({ message: 'Refund successful', refundDetails: refund });

  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({ message: 'Refund failed', error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  recordTransaction,
  processRefund,
  getRevenueStats
};