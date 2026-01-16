const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const { Op } = require('sequelize');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res, next) => {
  try {
    const { service, date } = req.body;

    if (!service || !date) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    // --- AUTO ASSIGN WORKER LOGIC ---
    // 1. Get all workers
    const workers = await User.findAll({ where: { role: 'worker' } });
    
    let assignedWorkerId = null;

    if (workers.length > 0) {
      // 2. Check availability (Simple: Who is free at this specific start time?)
      // Ideally, we should check time ranges (start < requested_end AND end > requested_start)
      // For this demo, we check if they have an appointment at the exact same time.
      
      const busyWorkerIds = await Appointment.findAll({
        where: {
          date: date,
          status: { [Op.not]: 'cancelled' }
        },
        attributes: ['workerId']
      }).then(appts => appts.map(a => a.workerId));

      const availableWorkers = workers.filter(w => !busyWorkerIds.includes(w.id));

      if (availableWorkers.length > 0) {
        // Pick a random available worker to distribute load
        const randomWorker = availableWorkers[Math.floor(Math.random() * availableWorkers.length)];
        assignedWorkerId = randomWorker.id;
      }
    }
    // --------------------------------

    const appointment = await Appointment.create({
      customerId: req.user.id,
      workerId: assignedWorkerId, // Auto-assigned or null
      serviceId: service,
      date,
      status: 'confirmed' // Auto-approve as requested
    });

    // Fetch full details for the receipt
    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        { model: User, as: 'customer', attributes: ['name', 'email'] },
        { model: User, as: 'worker', attributes: ['name'] },
        { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
      ]
    });

    res.status(201).json(fullAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
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
      ],
      order: [['date', 'ASC']]
    });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Worker/Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
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

    // Admin can also re-assign worker
    if (req.user.role === 'admin' && req.body.workerId) {
        appointment.workerId = req.body.workerId;
    }

    if (req.body.status) {
        appointment.status = req.body.status;
    }
    
    await appointment.save();

    // Return updated data with associations
    const updatedAppointment = await Appointment.findByPk(appointment.id, {
        include: [
          { model: User, as: 'customer', attributes: ['name', 'email'] },
          { model: User, as: 'worker', attributes: ['name'] },
          { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
        ]
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    await appointment.destroy();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};