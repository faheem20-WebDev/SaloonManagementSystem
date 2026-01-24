const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const Settings = require('../models/Settings');
const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db'); 
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper to check if a time string (HH:mm) is between two others
const isTimeBetween = (target, start, end) => {
    if (start <= end) {
        return target >= start && target <= end;
    } else {
        return target >= start || target <= end;
    }
};

const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && endA > startB;
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const addAppointment = async (req, res, next) => {
  const t = await sequelize.transaction(); 

  try {
    const { service, date, paymentMethod } = req.body; 
    
    if (!service || !date) {
      throw new Error('Please provide both a service and a preferred time.');
    }

    // 1. Validate Date (Past check and 3-month limit)
    const startTime = new Date(date);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    if (isNaN(startTime.getTime())) {
        throw new Error('The date format provided is invalid. Please try again.');
    }

    if (startTime < now) {
        throw new Error('Oops! You have selected a past date. Please choose a future time for your luxury experience.');
    }

    if (startTime > threeMonthsFromNow) {
        throw new Error('We are currently only accepting bookings up to 3 months in advance. Please select a closer date.');
    }

    // 2. Validate Service
    const serviceObj = await Service.findByPk(service, { transaction: t });
    if (!serviceObj) throw new Error('We could not find the selected service in our menu.');

    // 3. Calculate Times
    const endTime = new Date(startTime.getTime() + serviceObj.duration * 60000);
    const startStr = startTime.toTimeString().slice(0, 5);
    const endStr = endTime.toTimeString().slice(0, 5);

    // 4. Validate Shop Hours
    const shopOpen = await Settings.findOne({ where: { key: 'shopOpenTime' }, transaction: t });
    const shopClose = await Settings.findOne({ where: { key: 'shopCloseTime' }, transaction: t });
    const openTime = shopOpen ? shopOpen.value : '09:00';
    const closeTime = shopClose ? shopClose.value : '21:00';

    if (!isTimeBetween(startStr, openTime, closeTime) || !isTimeBetween(endStr, openTime, closeTime)) {
        throw new Error(`We are closed at your selected time. Our premium services are available between ${openTime} and ${closeTime}.`);
    }

    // 5. Find Qualified Workers
    const allWorkers = await User.findAll({ where: { role: 'worker' }, transaction: t });
    const qualifiedWorkers = allWorkers.filter(worker => {
        if (worker.isActive === false) return false;
        const workerSkills = Array.isArray(worker.skills) ? worker.skills : (worker.skills ? JSON.parse(worker.skills) : []);
        const hasSkill = workerSkills.includes(service) || workerSkills.includes(String(service));
        if (!hasSkill && workerSkills.length > 0) return false;
        
        const wStart = worker.shiftStart || '09:00';
        const wEnd = worker.shiftEnd || '21:00';
        if (!isTimeBetween(startStr, wStart, wEnd)) return false;

        if (worker.breakStart && worker.breakEnd && isOverlapping(startStr, endStr, worker.breakStart, worker.breakEnd)) return false;
        return true;
    });

    if (qualifiedWorkers.length === 0) {
        throw new Error('Our experts for this treatment are not available at this specific time. Please try another slot.');
    }

    // 6. Check Conflicts
    const busyWorkerIds = (await Appointment.findAll({
        where: {
            status: { [Op.not]: 'cancelled' },
            workerId: { [Op.in]: qualifiedWorkers.map(w => w.id) },
            [Op.and]: [{ startTime: { [Op.lt]: endTime } }, { endTime: { [Op.gt]: startTime } }]
        },
        attributes: ['workerId'],
        transaction: t
    })).map(a => a.workerId);
    
    const availableWorkers = qualifiedWorkers.filter(w => !busyWorkerIds.includes(w.id));
    if (availableWorkers.length === 0) {
        throw new Error('Our master stylists are fully booked for this slot. We would love to serve you at a different time!');
    }

    // Assign
    const selectedWorker = availableWorkers[Math.floor(Math.random() * availableWorkers.length)];

    // 7. Create
    const appointment = await Appointment.create({
      customerId: req.user.id,
      workerId: selectedWorker.id,
      serviceId: service,
      date: startTime,
      startTime: startTime,
      endTime: endTime,
      status: 'confirmed',
      paymentMethod: paymentMethod || 'onsite',
      paymentStatus: 'unpaid' 
    }, { transaction: t });

    await t.commit(); 
    
    const fullAppt = await Appointment.findByPk(appointment.id, {
        include: [
            { model: User, as: 'worker', attributes: ['name'] },
            { model: Service, as: 'service', attributes: ['name', 'price'] }
        ]
    });

    res.status(201).json(fullAppt);
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    res.status(400).json({ message: error.message }); // 400 for validation errors
  }
};

// @desc    Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        const { reason } = req.body;
        const appt = await Appointment.findByPk(req.params.id, {
            include: [{ model: Service, as: 'service' }]
        });

        if (!appt) return res.status(404).json({ message: 'Appointment not found' });
        if (appt.customerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (appt.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const today = new Date();
        today.setHours(0,0,0,0);
        const cancelCount = await Appointment.count({
            where: {
                customerId: req.user.id,
                status: 'cancelled',
                updatedAt: { [Op.gte]: today }
            }
        });
        if (cancelCount >= 2) return res.status(400).json({ message: 'You have reached the daily cancellation limit (Max 2). Please contact us if you need further assistance.' });

        const diffMs = new Date(appt.date) - new Date();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 2) {
            return res.status(400).json({ message: 'Apologies, appointments cannot be cancelled less than 2 hours before the start time.' });
        }

        let refundAmount = 0;
        let refundStatus = 'none';

        if (appt.paymentStatus === 'paid' && appt.paymentMethod === 'online' && appt.transactionId) {
            const price = parseFloat(appt.service.price);
            
            if (diffHours >= 24) refundAmount = price; 
            else if (diffHours >= 2) refundAmount = price * 0.8; 

            if (refundAmount > 0) {
                try {
                    const isPartial = refundAmount < price;
                    const refundPayload = { payment_intent: appt.transactionId, reason: 'requested_by_customer' };
                    if (isPartial) refundPayload.amount = Math.round(refundAmount * 100);

                    await stripe.refunds.create(refundPayload);
                    refundStatus = 'processed';
                    
                    const transaction = await Transaction.findOne({ where: { transactionId: appt.transactionId } });
                    if (transaction) {
                        transaction.status = isPartial ? 'partially_refunded' : 'refunded';
                        transaction.refundReason = reason;
                        await transaction.save();
                    }
                } catch (stripeError) {
                    console.error('Stripe Refund Failed:', stripeError);
                    return res.status(500).json({ message: 'Cancellation accepted but refund processing failed: ' + stripeError.message });
                }
            }
        }

        appt.status = 'cancelled';
        appt.cancellationReason = reason;
        appt.paymentStatus = refundStatus === 'processed' ? 'refunded' : appt.paymentStatus;
        appt.refundAmount = refundAmount;
        await appt.save();

        res.json({ message: 'Appointment cancelled successfully.', refundAmount, refundStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add Review for Worker
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const appt = await Appointment.findByPk(req.params.id);

        if(!appt) return res.status(404).json({ message: 'Appointment not found' });
        if(appt.customerId !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });
        if(appt.status !== 'completed') return res.status(400).json({ message: 'Reviews can only be left for completed appointments.' });

        const review = await Review.create({
            appointmentId: appt.id,
            workerId: appt.workerId,
            customerId: req.user.id,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res, next) => {
  try {
    let where = {};
    if (req.user.role === 'worker') where = { workerId: req.user.id };
    else if (req.user.role === 'customer') where = { customerId: req.user.id };

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['name', 'email'] },
        { model: User, as: 'worker', attributes: ['name'] },
        { model: Service, as: 'service', attributes: ['name', 'price', 'duration'] },
        { model: Review } 
      ],
      order: [['date', 'ASC']]
    });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && req.user.role !== 'worker') return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role === 'worker' && appointment.workerId !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    if (req.body.status) appointment.status = req.body.status;
    if (req.body.paymentStatus) appointment.paymentStatus = req.body.paymentStatus;
    
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
    try {
        await Appointment.destroy({ where: { id: req.params.id } });
        res.json({ id: req.params.id });
    } catch(e) { next(e); }
};

module.exports = {
  addAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  cancelAppointment,
  addReview
};