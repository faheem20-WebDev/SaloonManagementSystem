const express = require('express');
const router = express.Router();
const {
  getWorkers,
  createWorker,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/workers', protect, getWorkers);
router.post('/workers', protect, admin, createWorker);
router.get('/', protect, admin, getAllUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;
