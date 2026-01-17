const User = require('../models/User');

// @desc    Get all workers
// @route   GET /api/users/workers
// @access  Private
const getWorkers = async (req, res) => {
  const workers = await User.findAll({ 
    where: { role: 'worker' },
    attributes: { exclude: ['password'] }
  });
  res.status(200).json(workers);
};

// @desc    Create a worker
// @route   POST /api/users/workers
// @access  Private (Admin)
const createWorker = async (req, res) => {
  const { name, email, password, schedule } = req.body;

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const worker = await User.create({
    name,
    email,
    password,
    role: 'worker',
    schedule: schedule || '9AM - 5PM',
  });

  if (worker) {
    res.status(201).json({
      _id: worker.id,
      name: worker.name,
      email: worker.email,
      role: worker.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  });
  res.status(200).json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.destroy();
  res.status(200).json({ id: req.params.id });
};

// @desc    Update user (Admin can update worker skills/timings)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
  
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
  
      // Update fields if provided in request
      const fieldsToUpdate = [
        'name', 'email', 'role', 'isActive', 
        'skills', 'shiftStart', 'shiftEnd', 
        'breakStart', 'breakEnd'
      ];
  
      fieldsToUpdate.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
  
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    getWorkers,
    createWorker,
    getAllUsers,
    deleteUser,
    updateUser,
  };