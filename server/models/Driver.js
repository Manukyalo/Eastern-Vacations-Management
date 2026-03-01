const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  driverType: {
    type: String,
    enum: ['standard', 'safari'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'on-leave'],
    default: 'available'
  },
  tasks: [{
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    date: { type: String },
    time: { type: String },
    pickupLocation: { type: String },
    dropoffLocation: { type: String },
    guests: { type: Number },
    vehicleType: { type: String },
    flightNumber: { type: String },
    flightArrivalTime: { type: String },
    sgrArrivalTime: { type: String },
    // Safari Specific
    park: { type: String },
    days: { type: Number },
    nights: { type: Number },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  // Legacy support for backwards compatibility during transition
  task: {
    type: String,
    trim: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);
