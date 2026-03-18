const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Basic', 'Pro', 'Enterprise']
    },
    priceUSD: {
        type: Number,
        required: true
    },
    priceKES: {
        type: Number,
        required: true
    },
    maxBookings: {
        type: Number, // -1 means unlimited
        required: true
    },
    maxDrivers: {
        type: Number,
        required: true
    },
    features: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
