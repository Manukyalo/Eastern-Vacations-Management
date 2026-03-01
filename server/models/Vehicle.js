const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    trim: true
  },
  plate: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  seats: {
    type: Number,
    required: true,
    min: 2,
    max: 50
  },
  insuranceExpiry: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance'],
    default: 'available'
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastServiceDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
