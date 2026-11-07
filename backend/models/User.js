const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: true // Keeping for backward compatibility
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
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

// Generate and hash password reset token
User.prototype.getResetPasswordToken = function () {
  // Generate random 32-byte token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and assign to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiration (30 minutes from generation)
  this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);

  return resetToken;
};

module.exports = User;