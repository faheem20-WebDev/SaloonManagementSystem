const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Appointment = require('./Appointment');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
User.hasMany(Review, { foreignKey: 'workerId', as: 'receivedReviews' });
User.hasMany(Review, { foreignKey: 'customerId', as: 'writtenReviews' });
Appointment.hasOne(Review, { foreignKey: 'appointmentId' });

Review.belongsTo(User, { as: 'worker', foreignKey: 'workerId' });
Review.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
Review.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = Review;