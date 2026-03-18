const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @route   GET /api/auth/seed
// @desc    One-Time Seed route for Vercel Cloud Database initialization
// @access  Public (Emergency Setup)
router.get('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@easternvacations.com' });
    if (!adminExists) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 100);

      await User.create({
        name: 'Admin Executive',
        email: 'admin@easternvacations.com',
        password: '@EasternVacations2026',
        role: 'admin',
        planType: 'Enterprise',
        subscriptionExpiry: futureDate
      });
    }

    const staffExists = await User.findOne({ email: 'staff@easternvacations.com' });
    if (!staffExists) {
      await User.create({
        name: 'Reservation Agent',
        email: 'staff@easternvacations.com',
        password: 'Reservations@2026',
        role: 'reservation'
      });
    }

    res.status(200).json({ message: '✅ Database successfully populated with initial Admin and Staff credentials.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public (but should be protected in production)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'reservation'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        planType: user.planType,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      planType: user.planType,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// @route   POST /api/auth/subscribe
// @desc    Upgrade user subscription tier
// @access  Private
router.post('/subscribe', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['Basic', 'Pro', 'Enterprise'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year expiry

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        planType: plan,
        subscriptionStatus: 'active',
        subscriptionExpiry: futureDate
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
