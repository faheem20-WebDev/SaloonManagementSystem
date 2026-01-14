const express = require('express');
const router = express.Router();
const {
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, admin, worker } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, addAppointment);

router.route('/:id')
  .put(protect, worker, updateAppointmentStatus) // Worker or Admin
  .delete(protect, admin, deleteAppointment); // Admin only

module.exports = router;
