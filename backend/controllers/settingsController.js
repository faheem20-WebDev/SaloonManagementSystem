const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findAll();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update setting
// @route   POST /api/settings
// @access  Private (Admin)
const updateSetting = async (req, res) => {
    const { key, value } = req.body;
    try {
        let setting = await Settings.findOne({ where: { key } });
        if (setting) {
            setting.value = value;
            await setting.save();
        } else {
            setting = await Settings.create({ key, value });
        }
        res.status(200).json(setting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getSettings, updateSetting };