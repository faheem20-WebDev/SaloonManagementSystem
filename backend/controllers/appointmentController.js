const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const Settings = require('../models/Settings');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db'); 

// Helper to check if a time string (HH:mm) is between two others
const isTimeBetween = (target, start, end) => {
    return target >= start && target <= end;
};

// Helper to check if intervals overlap
const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && endA > startB;
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res, next) => {
  const t = await sequelize.transaction(); 

  try {
    const { service, date } = req.body;

    if (!service || !date) {
      await t.rollback();
      res.status(400);
      throw new Error('Please add all required fields (service and date)');
    }

    // 1. Validate Service
    let serviceIdInt = parseInt(service, 10);
    const serviceObj = await Service.findByPk(serviceIdInt, { transaction: t });
    if (!serviceObj) {
        await t.rollback();
        res.status(404);
        throw new Error('Service not found');
    }

    // 2. Calculate Times
    const startTime = new Date(date);
    if (isNaN(startTime.getTime()) || startTime < new Date()) {
        await t.rollback();
        res.status(400);
        throw new Error('Invalid or past date provided');
    }

    const durationMinutes = serviceObj.duration;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Format times for string comparison (HH:mm)
    const startStr = startTime.toTimeString().slice(0, 5);
    const endStr = endTime.toTimeString().slice(0, 5);

    // 3. Validate Shop Hours
    const shopOpen = await Settings.findOne({ where: { key: 'shopOpenTime' }, transaction: t });
    const shopClose = await Settings.findOne({ where: { key: 'shopCloseTime' }, transaction: t });
    
    // Default shop hours if not set
    const openTime = shopOpen ? shopOpen.value : '09:00';
    const closeTime = shopClose ? shopClose.value : '21:00';

    if (!isTimeBetween(startStr, openTime, closeTime) || !isTimeBetween(endStr, openTime, closeTime)) {
        await t.rollback();
        res.status(400);
        throw new Error(`Shop is closed. Our hours are ${openTime} to ${closeTime}.`);
    }

    // 4. Find Qualified Workers (Skill Matching + Shift + Break)
    const allWorkers = await User.findAll({ 
        where: { role: 'worker', isActive: true },
        transaction: t
    });

    const qualifiedWorkers = allWorkers.filter(worker => {
        // A. Skill Match
        const workerSkills = Array.isArray(worker.skills) ? worker.skills : (worker.skills ? JSON.parse(worker.skills) : []);
        const hasSkill = workerSkills.includes(serviceIdInt) || workerSkills.includes(String(serviceIdInt));
        if (!hasSkill && workerSkills.length > 0) return false; // If they have defined skills, they must match. If empty, assume old worker/all-rounder.

        // B. Shift Match
        const inShift = isTimeBetween(startStr, worker.shiftStart, worker.shiftEnd) && 
                        isTimeBetween(endStr, worker.shiftStart, worker.shiftEnd);
        if (!inShift) return false;

        // C. Break Check (Must NOT overlap with break)
        const inBreak = isOverlapping(startStr, endStr, worker.breakStart, worker.breakEnd);
        if (inBreak) return false;

        return true;
    });

    if (qualifiedWorkers.length === 0) {
        await t.rollback();
        res.status(409).json({ message: 'No qualified stylists are available for this service at the selected time.' });
        return;
    }

    // 5. Check for Existing Booking Conflicts among qualified workers
    const conflictingAppointments = await Appointment.findAll({
        where: {
            status: { [Op.not]: 'cancelled' },
            workerId: { [Op.in]: qualifiedWorkers.map(w => w.id) },
            [Op.and]: [
                { startTime: { [Op.lt]: endTime } }, 
                { endTime: { [Op.gt]: startTime } }  
            ]
        },
        attributes: ['workerId'],
        transaction: t,
        lock: true 
    });

    const busyWorkerIds = conflictingAppointments.map(a => a.workerId);
    const availableWorkers = qualifiedWorkers.filter(w => !busyWorkerIds.includes(w.id));

    if (availableWorkers.length === 0) {
        await t.rollback();
        res.status(409).json({ message: 'All qualified stylists are busy during this time slot.' });
        return;
    }

    // Randomly assign
    const selectedWorker = availableWorkers[Math.floor(Math.random() * availableWorkers.length)];

    // 6. Create Booking
    const appointment = await Appointment.create({
      customerId: req.user.id,
      workerId: selectedWorker.id,
      serviceId: serviceIdInt,
      date: startTime,
      startTime: startTime,
      endTime: endTime,
      status: 'confirmed'
    }, { transaction: t });

    await t.commit(); 

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
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
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