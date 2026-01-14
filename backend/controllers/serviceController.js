const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  const services = await Service.findAll();
  res.status(200).json(services);
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
  if (!req.body.name || !req.body.price) {
    res.status(400);
    throw new Error('Please add name and price');
  }

  const service = await Service.create(req.body);
  res.status(201).json(service);
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.update(req.body);
  res.status(200).json(service);
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.destroy();
  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};