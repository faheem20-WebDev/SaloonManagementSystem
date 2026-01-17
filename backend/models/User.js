const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('customer', 'worker', 'admin'),
    defaultValue: 'customer'
  },
  skills: {
    type: DataTypes.JSON, // Array of service IDs
    allowNull: true,
    defaultValue: []
  },
  shiftStart: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '09:00'
  },
  shiftEnd: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '21:00'
  },
  breakStart: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '13:00'
  },
  breakEnd: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '14:00'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: true // Keeping for backward compatibility
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method for password matching
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;