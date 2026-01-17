const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db'); // Import sequelize instance for transactions

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res, next) => {
  const t = await sequelize.transaction(); // Start Transaction

  try {
    console.log('--- START SECURE BOOKING ---');
    console.log('Request Body:', req.body);
    console.log('Logged in User ID:', req.user.id);

    const { service, date } = req.body;

    // 1. Basic Validation
    if (!service || !date) {
      await t.rollback();
      res.status(400);
      throw new Error('Please add all required fields (service and date)');
    }

    // 2. Validate Service & Get Duration
    let serviceIdInt;
    try {
        serviceIdInt = parseInt(service, 10);
        if (isNaN(serviceIdInt)) throw new Error('Invalid Service ID format');
    } catch (e) {
        await t.rollback();
        res.status(400);
        throw new Error('Service ID must be a valid number');
    }

    const serviceObj = await Service.findByPk(serviceIdInt, { transaction: t });
    if (!serviceObj) {
        await t.rollback();
        res.status(404);
        throw new Error('Service not found');
    }

    // 3. Calculate Start & End Times
    const startTime = new Date(date);
    if (isNaN(startTime.getTime())) {
        await t.rollback();
        res.status(400);
        throw new Error('Invalid date format');
    }

    // Check if date is in the past
    if (startTime < new Date()) {
        await t.rollback();
        res.status(400);
        throw new Error('Cannot book appointments in the past');
    }

    const durationMinutes = serviceObj.duration;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    console.log(`Booking Time: ${startTime.toISOString()} to ${endTime.toISOString()} (${durationMinutes} mins)`);

    // 4. Worker Assignment (Preserving Auto-Assign Logic but Validating)
    let assignedWorkerId = null;
    
    // Fetch all workers
    const workers = await User.findAll({ 
        where: { role: 'worker' },
        transaction: t
    });

    if (!workers || workers.length === 0) {
        await t.rollback();
        res.status(500);
        throw new Error('No stylists available in the system');
    }

    // Find busy workers during this SPECIFIC interval
    // Overlap Logic: (StartA < EndB) AND (EndA > StartB)
    const conflictingAppointments = await Appointment.findAll({
        where: {
            status: { [Op.not]: 'cancelled' }, // Ignore cancelled
            [Op.and]: [
                { startTime: { [Op.lt]: endTime } }, // Existing start is before new end
                { endTime: { [Op.gt]: startTime } }  // Existing end is after new start
            ]
        },
        attributes: ['workerId'],
        transaction: t,
        lock: true // LOCK rows to prevent race conditions during read
    });

    const busyWorkerIds = conflictingAppointments.map(a => a.workerId);
    console.log('Busy Worker IDs during this slot:', busyWorkerIds);

    // Filter free workers
    const freeWorkers = workers.filter(w => !busyWorkerIds.includes(w.id));

    if (freeWorkers.length === 0) {
        await t.rollback();
        // Return 409 Conflict
        res.status(409).json({ message: 'All stylists are fully booked for this time slot. Please choose another time.' });
        return;
    }

    // Randomly assign one of the free workers
    const randomWorker = freeWorkers[Math.floor(Math.random() * freeWorkers.length)];
    assignedWorkerId = randomWorker.id;
    console.log(`Assigned Worker: ${randomWorker.name} (ID: ${assignedWorkerId})`);


    // 5. Create Booking (Insert)
    const appointment = await Appointment.create({
      customerId: req.user.id,
      workerId: assignedWorkerId,
      serviceId: serviceIdInt,
      date: startTime,      // Legacy support
      startTime: startTime, // New Field
      endTime: endTime,     // New Field
      status: 'confirmed'
    }, { transaction: t });

    await t.commit(); // COMMIT Transaction
    console.log('Booking Committed! ID:', appointment.id);

    // 6. Fetch Full Details for Receipt
    const fullAppt = await Appointment.findByPk(appointment.id, {
        include: [
            { model: User, as: 'customer', attributes: ['name', 'email'] },
            { model: User, as: 'worker', attributes: ['name'] },
            { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
        ]
    });

    res.status(201).json(fullAppt);

  } catch (error) {
    if (t) await t.rollback();
    console.error('CRITICAL ERROR IN ADD APPOINTMENT:', error);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ 
        message: error.message || 'Server Error: Booking Failed',
        stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
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
    console.log(`--- UPDATE APPOINTMENT STATUS ---`);
    console.log(`Appointment ID: ${req.params.id}`);
    console.log(`User ID: ${req.user.id}, Role: ${req.user.role}`);
    console.log(`Request Body:`, req.body);

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      console.log('Appointment not found');
      res.status(404);
      throw new Error('Appointment not found');
    }

    console.log(`Current Appointment WorkerId: ${appointment.workerId}`);

    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      console.log('User not admin or worker');
      res.status(401);
      throw new Error('Not authorized');
    }

    if (req.user.role === 'worker') {
        // Ensure types match for comparison
        if (Number(appointment.workerId) !== Number(req.user.id)) {
            console.log(`Worker ID mismatch. Appt Worker: ${appointment.workerId}, User: ${req.user.id}`);
            res.status(401);
            throw new Error('Not authorized to update this appointment');
        }
    }

    if (req.user.role === 'admin' && req.body.workerId) {
        appointment.workerId = req.body.workerId;
    }

    if (req.body.status) {
        console.log(`Updating status to: ${req.body.status}`);
        appointment.status = req.body.status;
    }
    
    await appointment.save();
    console.log('Appointment saved.');

    const updatedAppointment = await Appointment.findByPk(appointment.id, {
        include: [
          { model: User, as: 'customer', attributes: ['name', 'email'] },
          { model: User, as: 'worker', attributes: ['name'] },
          { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
        ]
    });

    console.log('Returning updated appointment.');
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('ERROR in updateAppointmentStatus:', error);
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