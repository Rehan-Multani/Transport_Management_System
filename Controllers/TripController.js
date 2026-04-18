const Trip = require('../Models/TripModel');
const User = require('../Models/UserModel');

// @desc    Create new trip
// @route   POST /api/v1/trips
// @access  Private (Admin)
exports.createTrip = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const trip = await Trip.create(req.body);
        res.status(201).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Assign driver to trip
// @route   PATCH /api/v1/trips/:id/assign
// @access  Private (Admin)
exports.assignDriver = async (req, res, next) => {
    try {
        const { driverId } = req.body;
        const driver = await User.findById(driverId);

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ success: false, error: 'Driver not found' });
        }

        const trip = await Trip.findByIdAndUpdate(req.params.id, {
            driverId,
            status: 'ASSIGNED'
        }, { new: true });

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Driver Accept Trip
// @route   PATCH /api/v1/trips/:id/accept
// @access  Private (Driver)
exports.acceptTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip || trip.driverId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized for this trip' });
        }

        trip.status = 'ACCEPTED';
        await trip.save();

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Start Trip
// @route   PATCH /api/v1/trips/:id/start
// @access  Private (Driver)
exports.startTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip || trip.driverId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized for this trip' });
        }

        trip.status = 'EN_ROUTE';
        trip.startTime = Date.now();
        await trip.save();

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Complete Trip & Calculate Fare
// @route   PATCH /api/v1/trips/:id/complete
// @access  Private (Driver)
exports.completeTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip || trip.driverId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized for this trip' });
        }

        const { distance } = req.body; // Driver provides distance at the end or calculated via GPS
        
        // Fare Calculation Logic
        const baseFare = 50;
        const perKmRate = 15;
        const commissionRate = 0.20; // 20% system commission

        const fare = baseFare + (distance * perKmRate);
        const driverEarning = fare - (fare * commissionRate);

        trip.status = 'COMPLETED';
        trip.endTime = Date.now();
        trip.distance = distance;
        trip.fare = fare;
        trip.driverEarning = driverEarning;

        await trip.save();

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel Trip
// @route   PATCH /api/v1/trips/:id/cancel
// @access  Private (Admin/Driver)
exports.cancelTrip = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const trip = await Trip.findByIdAndUpdate(req.params.id, {
            status: 'CANCELLED',
            cancellationReason: reason
        }, { new: true });

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all trips
// @route   GET /api/v1/trips
// @access  Private (Admin)
exports.getTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find().populate('driverId', 'name phone vehicleNumber');
        res.status(200).json({ success: true, data: trips });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single trip
// @route   GET /api/v1/trips/:id
// @access  Private
exports.getTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('driverId', 'name phone vehicleNumber');
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Driver Trips
// @route   GET /api/v1/trips/driver/:driverId
// @access  Private
exports.getDriverTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find({ driverId: req.params.driverId });
        res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
        next(err);
    }
};

// @desc    Update trip
// @route   PUT /api/v1/trips/:id
// @access  Private (Admin)
exports.updateTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete trip
// @route   DELETE /api/v1/trips/:id
// @access  Private (Admin)
exports.deleteTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
