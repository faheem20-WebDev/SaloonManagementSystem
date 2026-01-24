const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER, // Assuming User ID is Integer based on typical Sequelize setup, will verify
    allowNull: false,
    references: {
      model: 'Users', // This needs to match your User table name exactly
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'stripe'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd'
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  paymentMethodDetails: {
    type: DataTypes.JSON, // Postgres supports JSON natively
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refundReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Transaction;