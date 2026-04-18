const express = require('express');
const {
    getDrivers,
    getDriver,
    createDriver,
    updateDriver,
    deleteDriver
} = require('../Controllers/DriverController');

const router = express.Router();

const { protect, authorize } = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// All routes here should be protected and only for admin (or driver themselves for update)
router.use(protect);

router
    .route('/')
    .get(authorize('admin'), getDrivers)
    .post(authorize('admin'), upload.single('license'), createDriver);

router
    .route('/:id')
    .get(authorize('admin', 'driver'), getDriver)
    .put(authorize('admin', 'driver'), updateDriver)
    .delete(authorize('admin'), deleteDriver);

module.exports = router;
