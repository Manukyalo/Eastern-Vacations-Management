const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/drivers
// @desc    Get all drivers
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const drivers = await Driver.find().populate('currentBooking');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/drivers
// @desc    Create new driver
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const driver = await Driver.create(req.body);
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/drivers/:id
// @desc    Delete driver
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        await driver.deleteOne();
        res.json({ message: 'Driver removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
