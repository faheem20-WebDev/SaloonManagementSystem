const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const { Op } = require('sequelize');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res, next) => {
  try {
    console.log('--- START BOOKING ---');
    console.log('Request Body:', req.body);
    console.log('Logged in User ID:', req.user.id);

    const { service, date } = req.body;

    // 1. Basic Validation
    if (!service || !date) {
      res.status(400);
      throw new Error('Please add all required fields (service and date)');
    }

    // 2. Service ID Parsing (Safe)
    let serviceIdInt;
    try {
        serviceIdInt = parseInt(service, 10);
        if (isNaN(serviceIdInt)) throw new Error('Invalid Service ID format');
    } catch (e) {
        res.status(400);
        throw new Error('Service ID must be a valid number');
    }

    // 3. Auto-Assign Logic (With Safety Net)
    let assignedWorkerId = null;
    try {
        console.log('Attempting Auto-Assign...');
        const workers = await User.findAll({ where: { role: 'worker' } });
        console.log(`System has ${workers.length} workers.`);
        
        if (workers && workers.length > 0) {
            // Find busy workers at this specific datetime
            const busyAppts = await Appointment.findAll({
                where: { 
                  date: date,
                  status: { [Op.not]: 'cancelled' } 
                },
                attributes: ['workerId']
            });
            
            const busyIds = busyAppts.map(a => a.workerId);
            console.log('Busy worker IDs at this time:', busyIds);

            const freeWorkers = workers.filter(w => !busyIds.includes(w.id));

            if (freeWorkers.length > 0) {
                const randomWorker = freeWorkers[Math.floor(Math.random() * freeWorkers.length)];
                assignedWorkerId = randomWorker.id;
                console.log('Assigned Worker Name:', randomWorker.name);
            } else {
                console.log('No workers are currently free for this time slot.');
            }
        }
    } catch (assignError) {
        console.error('Auto-Assign Process Error (Continuing booking without stylist):', assignError.message);
        // We don't crash the whole booking if auto-assignment logic fails
    }

    // 4. Create Booking in DB
    console.log('Attempting to save Appointment to Database...');
    const appointment = await Appointment.create({
      customerId: req.user.id,
      workerId: assignedWorkerId,
      serviceId: serviceIdInt,
      date: date,
      status: 'confirmed'
    });

    console.log('Booking Saved Successfully! ID:', appointment.id);

    // 5. Fetch Full Details for Receipt (Include associations)
    const fullAppt = await Appointment.findByPk(appointment.id, {
        include: [
            { model: User, as: 'customer', attributes: ['name', 'email'] },
            { model: User, as: 'worker', attributes: ['name'] },
            { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] }
        ]
    });

    res.status(201).json(fullAppt);

  } catch (error) {
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
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (req.user.role === 'worker' && appointment.workerId !== req.user.id) {
       res.status(401);
       throw new Error('Not authorized to update this appointment');
    }

    if (req.user.role === 'admin' && req.body.workerId) {
        appointment.workerId = req.body.workerId;
    }

    if (req.body.status) {
        appointment.status = req.body.status;
    }
    
    await appointment.save();

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