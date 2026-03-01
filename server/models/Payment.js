const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'KES'],
        required: true
    },
    gateway: {
        type: String,
        enum: ['mpesa', 'pesapal'],
        required: true
    },
    transactionId: {
        type: String, // MPesa Receipt number or Pesapal Tracking ID
        unique: true,
        sparse: true
    },
    checkoutRequestId: {
        type: String, // For M-Pesa STK Push tracking
        sparse: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed // Store full gateway responses here
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
