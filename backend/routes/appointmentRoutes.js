const express = require('express');
const router = express.Router();
const {
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  cancelAppointment,
  addReview
} = require('../controllers/appointmentController');
const { protect, admin, worker } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, addAppointment);

router.route('/:id')
  .put(protect, worker, updateAppointmentStatus)
  .delete(protect, admin, deleteAppointment);

router.post('/:id/cancel', protect, cancelAppointment);
router.post('/:id/review', protect, addReview);

module.exports = router;