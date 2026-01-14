const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Service = require('./Service');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

// Associations
User.hasMany(Appointment, { as: 'customerAppointments', foreignKey: 'customerId' });
User.hasMany(Appointment, { as: 'workerAppointments', foreignKey: 'workerId' });

Appointment.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
Appointment.belongsTo(User, { as: 'worker', foreignKey: 'workerId' });

Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { as: 'service', foreignKey: 'serviceId' });

module.exports = Appointment;