const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res) => {
  const { service, worker, date } = req.body;

  if (!service || !date) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const appointment = await Appointment.create({
    customerId: req.user.id,
    workerId: worker || null, // Optional at booking, can be assigned later
    serviceId: service,
    date,
  });

  res.status(201).json(appointment);
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  let where = {};
  
  if (req.user.role === 'worker') {
    where = { workerId: req.user.id };
  } else if (req.user.role === 'customer') {
    where = { customerId: req.user.id };
  }
  // Admin sees all (empty where)

  const appointments = await Appointment.findAll({
    where,
    include: [
      { model: User, as: 'customer', attributes: ['name', 'email'] },
      { model: User, as: 'worker', attributes: ['name'] },
      { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
    ]
  });

  res.status(200).json(appointments);
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Worker/Admin)
const updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && req.user.role !== 'worker') {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Workers can only update their own appointments
  if (req.user.role === 'worker' && appointment.workerId !== req.user.id) {
     res.status(401);
     throw new Error('Not authorized to update this appointment');
  }

  appointment.status = req.body.status;
  await appointment.save();

  res.status(200).json(appointment);
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await appointment.destroy();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};