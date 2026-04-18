const User = require('../Models/UserModel');

// @desc    Get all drivers
// @route   GET /api/v1/drivers
// @access  Private/Admin
exports.getDrivers = async (req, res, next) => {
    try {
        const drivers = await User.find({ role: 'driver' });
        res.status(200).json({ success: true, count: drivers.length, data: drivers });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single driver
// @route   GET /api/v1/drivers/:id
// @access  Private/Admin
exports.getDriver = async (req, res, next) => {
    try {
        const driver = await User.findById(req.params.id);

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        res.status(200).json({ success: true, data: driver });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create driver
// @route   POST /api/v1/drivers
// @access  Private/Admin
exports.createDriver = async (req, res, next) => {
    try {
        const driverData = { ...req.body };
        driverData.role = 'driver';

        if (req.file) {
            driverData.license = req.file.path;
        }

        const driver = await User.create(driverData);
        res.status(201).json({ success: true, data: driver });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update driver
// @route   PUT /api/v1/drivers/:id
// @access  Private/Admin
exports.updateDriver = async (req, res, next) => {
    try {
        const driver = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        res.status(200).json({ success: true, data: driver });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete driver
// @route   DELETE /api/v1/drivers/:id
// @access  Private/Admin
exports.deleteDriver = async (req, res, next) => {
    try {
        const driver = await User.findByIdAndDelete(req.params.id);

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
