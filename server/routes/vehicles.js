const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true })
      .populate('currentBooking', 'clientName destination startDate endDate')
      .sort({ model: 1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vehicles/available
// @desc    Get available vehicles
// @access  Private
router.get('/available', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      status: 'available',
      isActive: true,
      insuranceExpiry: { $gt: new Date() } // Only vehicles with valid insurance
    }).sort({ model: 1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vehicles/insurance-expiring
// @desc    Get vehicles with expiring/expired insurance
// @access  Private
router.get('/insurance-expiring', protect, async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const vehicles = await Vehicle.find({
      isActive: true,
      insuranceExpiry: { $lte: sevenDaysFromNow }
    }).sort({ insuranceExpiry: 1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get single vehicle
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('currentBooking');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vehicles
// @desc    Create new vehicle
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.status === 'assigned') {
      return res.status(400).json({ message: 'Cannot delete vehicle currently assigned to a booking' });
    }

    vehicle.isActive = false;
    await vehicle.save();

    res.json({ message: 'Vehicle deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
