const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to set cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, 
    secure: true, // Required for SameSite: None
    sameSite: 'none', // Required for cross-site cookie sharing
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });
};

// @desc    Register new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    sendTokenResponse(user, 200, res);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
const logout = async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(200).json({ message: 'User logged out' });
};

// @desc    Get user data
const getMe = async (req, res) => {
  const user = {
    id: req.user.id,
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  res.status(200).json(user);
};

// @desc    Forgot password - generate reset token & send email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: cleanEmail } });

    // Generic response message to prevent account enumeration
    const genericSuccessMessage = 'If an account with that email exists, a password reset link has been sent.';

    // If no user exists, return generic success without revealing account absence
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericSuccessMessage
      });
    }

    // Generate reset token and set expiry on user instance (30 minutes)
    const resetToken = user.getResetPasswordToken();
    await user.save({ validate: false });

    // Determine frontend URL for password reset link with production safety
    const PRODUCTION_FRONTEND_URL = 'https://saloon-management-system-neon.vercel.app';
    const isProduction = process.env.NODE_ENV === 'production';

    // List of trusted origins
    const trustedOrigins = [
      PRODUCTION_FRONTEND_URL,
      'https://saloon-management-system-fzc0l8s4e-faheem-s-projects-4830cc72.vercel.app',
      'https://muhammadfaheem52006-saloonmanagementsystemfrontend.vercel.app',
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
    ].filter(Boolean);

    let clientBase = '';

    // Check request origin header
    const requestOrigin = (req.headers.origin || '').trim();
    if (requestOrigin && trustedOrigins.includes(requestOrigin)) {
      if (isProduction) {
        // In production, never accept localhost origin even if client claims it
        if (!requestOrigin.includes('localhost') && !requestOrigin.includes('127.0.0.1')) {
          clientBase = requestOrigin;
        }
      } else {
        clientBase = requestOrigin;
      }
    }

    // If clientBase not resolved from request origin, resolve from environment variables
    if (!clientBase) {
      const envUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || '').trim();
      if (isProduction) {
        // In production, strictly use HTTPS non-localhost domain
        if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1') && envUrl.startsWith('https://')) {
          clientBase = envUrl;
        } else {
          clientBase = PRODUCTION_FRONTEND_URL;
        }
      } else {
        clientBase = envUrl || 'http://localhost:5173';
      }
    }

    // Final safety guard: In production, URL MUST be the deployed HTTPS frontend domain, NEVER localhost
    if (isProduction && (clientBase.includes('localhost') || clientBase.includes('127.0.0.1') || !clientBase.startsWith('https://'))) {
      clientBase = PRODUCTION_FRONTEND_URL;
    }

    const resetUrl = `${clientBase.replace(/\/$/, '')}/reset-password/${resetToken}`;

    // Send password reset email via Gmail SMTP
    try {
      await sendEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });

      return res.status(200).json({
        success: true,
        message: genericSuccessMessage
      });
    } catch (emailError) {
      // Revert token fields on email failure so dead tokens do not persist
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validate: false });

      console.error('Password reset email sending failed:', emailError.message);

      const isProd = process.env.NODE_ENV === 'production';
      const statusCode = emailError.statusCode && emailError.statusCode < 500 ? emailError.statusCode : 500;

      // In production, do not expose internal SMTP or server details to client
      return res.status(statusCode).json({
        success: false,
        message: isProd
          ? 'Failed to send password reset email. Please try again later.'
          : (emailError.message || 'Failed to send password reset email.'),
        ...(isProd ? {} : { details: emailError.name || 'EmailDeliveryError' })
      });
    }
  } catch (error) {
    console.error('forgotPassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token or POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is missing' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Hash the token received from the client to match against the hashed token in DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.'
      });
    }

    // Set new password (beforeUpdate hook will automatically hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};