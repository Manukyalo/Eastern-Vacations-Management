const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('driver', 'name phone')
      .populate('vehicle', 'model plate seats')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('driver', 'name phone email')
      .populate('vehicle', 'model plate seats insuranceExpiry')
      .populate('createdBy', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private (Admin only for payment, all for assignments)
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if updating payment info - admin only
    if ((req.body.payment !== undefined || req.body.paymentStatus !== undefined) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update payment information' });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driver vehicle');

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/assign
// @desc    Assign driver and vehicle to booking
// @access  Private
router.put('/:id/assign', protect, async (req, res) => {
  try {
    const { driverId, vehicleId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Unassign previous driver/vehicle if exists
    if (booking.driver) {
      await Driver.findByIdAndUpdate(booking.driver, {
        status: 'available',
        currentBooking: null
      });
    }
    if (booking.vehicle) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, {
        status: 'available',
        currentBooking: null
      });
    }

    // Assign new driver
    if (driverId) {
      await Driver.findByIdAndUpdate(driverId, {
        status: 'assigned',
        currentBooking: booking._id
      });
    }

    // Assign new vehicle
    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        status: 'assigned',
        currentBooking: booking._id
      });
    }

    // Update booking
    booking.driver = driverId || booking.driver;
    booking.vehicle = vehicleId || booking.vehicle;
    booking.status = 'confirmed';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('driver vehicle');

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Free up driver and vehicle
    if (booking.driver) {
      await Driver.findByIdAndUpdate(booking.driver, {
        status: 'available',
        currentBooking: null
      });
    }
    if (booking.vehicle) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, {
        status: 'available',
        currentBooking: null
      });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
