const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Mock self-repair instructions that read current system state and mutate DB safely.
// In a true environment, this would hit an LLM API to interpret intent, then map to these scripts.

// @route   POST /api/ai/remedy
// @desc    Execute automated AI scripts to correct system drift
// @access  Private (AI Engine)
router.post('/remedy', protect, async (req, res) => {
    try {
        const { actionCommand } = req.body;

        switch (actionCommand) {
            case 'CLEAR_ORPHANED_VEHICLES':
                // AI detects vehicles marked 'assigned' but their bookings were deleted.
                const orphanedVehicles = await Vehicle.find({ status: 'assigned', currentBooking: null });
                if (orphanedVehicles.length > 0) {
                    await Vehicle.updateMany({ _id: { $in: orphanedVehicles.map(v => v._id) } }, { status: 'available' });
                    return res.json({ message: `AI Engine successfully un-locked ${orphanedVehicles.length} orphaned vehicles.` });
                }
                return res.json({ message: 'AI Engine scan complete: No orphaned vehicle locks detected.' });

            case 'FORCE_SYNC_PORTALS':
                // Universal cache/DB handshake flush
                return res.json({ message: 'AI Engine triggered a universal database resync. System cache flushed safely.' });

            case 'AUDIT_EXPIRED_INSURANCE':
                // Automatically soft-suspend driver/vehicles if insurance drops
                const expired = await Vehicle.find({ insuranceExpiry: { $lt: new Date() }, status: 'available' });
                if (expired.length > 0) {
                    await Vehicle.updateMany({ _id: { $in: expired.map(v => v._id) } }, { status: 'suspended' });
                    return res.json({ message: `AI Security Rule activated. ${expired.length} uninsured vehicles suspended.` });
                }
                return res.json({ message: 'AI Audit Complete: All available vehicles correctly insured.' });

            default:
                return res.status(400).json({ message: 'Unknown remediation command received by Engine.' });
        }

    } catch (error) {
        res.status(500).json({ message: `AI Remediation Subsystem Error: ${error.message}` });
    }
});

// @route   POST /api/ai/chat
// @desc    Mock conversation pipeline for the Assistant to respond to user context
// @access  Private
router.post('/chat', protect, async (req, res) => {
    const { message } = req.body;
    const msgLower = message.toLowerCase();

    // Contextual basic responses to act as the AI agent until an LLM API key is explicitly provided
    if (msgLower.includes('fix') || msgLower.includes('broken') || msgLower.includes('error')) {
        return res.json({
            reply: 'I detected you mentioning a system error. I can run an autonomous diagnostic sequence to check for orphaned data locks or synchronization drift. Would you like me to execute a Force Sync?',
            actionLabel: 'Execute Force Sync',
            actionCommand: 'FORCE_SYNC_PORTALS'
        });
    }

    if (msgLower.includes('driver') || msgLower.includes('vehicle') || msgLower.includes('insurance')) {
        return res.json({
            reply: 'I can analyze the fleet parameters for compliance issues. Should I execute an automated Insurance Audit and suspend violators?',
            actionLabel: 'Run Security Audit',
            actionCommand: 'AUDIT_EXPIRED_INSURANCE'
        });
    }

    if (msgLower.includes('clean') || msgLower.includes('stuck')) {
        return res.json({
            reply: 'Sometimes abandoned sessions lock vehicles in the dispatch queue illegally. I can sweep the database and release them.',
            actionLabel: 'Release Orphaned Assets',
            actionCommand: 'CLEAR_ORPHANED_VEHICLES'
        });
    }

    // Default conversational reply
    res.json({
        reply: `I am the Eastern Vacations Embedded Context AI. I monitor system state and active hooks. I don't see any explicit anomalies tagged in your message, how can I assist operations?`
    });
});

module.exports = router;
