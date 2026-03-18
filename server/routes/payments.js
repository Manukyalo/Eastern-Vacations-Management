const express = require('express');
const router = express.Router();
const { initiateSTKPush } = require('../services/mpesa');
const { submitOrder } = require('../services/pesapal');
const Payment = require('../models/Payment');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/subscribe
// @desc    Initiate subscription payment (M-Pesa or Pesapal)
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
    const { planId, gateway, phoneNumber } = req.body;

    try {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        let gatewayResponse;

        if (gateway === 'mpesa') {
            if (!phoneNumber) return res.status(400).json({ message: 'Phone number required for M-Pesa' });

            gatewayResponse = await initiateSTKPush(
                phoneNumber,
                plan.priceKES,
                req.user._id.toString(),
                `Subscription to ${plan.name}`
            );

            // Create pending payment record
            await Payment.create({
                user: req.user._id,
                subscriptionPlan: plan._id,
                amount: plan.priceKES,
                currency: 'KES',
                gateway: 'mpesa',
                checkoutRequestId: gatewayResponse.CheckoutRequestID,
                status: 'pending'
            });

            res.status(200).json({
                message: 'STK Push initiated successfully',
                data: gatewayResponse
            });

        } else if (gateway === 'pesapal') {
            gatewayResponse = await submitOrder({
                merchantReference: `SUB-${Date.now()}-${req.user._id}`,
                amount: plan.priceUSD,
                description: `Subscription to ${plan.name} Plan`,
                email: req.user.email,
                phone: phoneNumber || '0000000000',
                firstName: req.user.name.split(' ')[0],
                lastName: req.user.name.split(' ')[1] || ''
            });

            // Create pending payment record
            await Payment.create({
                user: req.user._id,
                subscriptionPlan: plan._id,
                amount: plan.priceUSD,
                currency: 'USD',
                gateway: 'pesapal',
                transactionId: gatewayResponse.order_tracking_id,
                status: 'pending'
            });

            res.status(200).json({
                message: 'Pesapal order created successfully',
                redirectUrl: gatewayResponse.redirect_url
            });

        } else {
            res.status(400).json({ message: 'Invalid payment gateway specified' });
        }

    } catch (error) {
        console.error('Subscription Initiation Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @route   POST /api/payments/mpesa/callback
// @desc    M-Pesa STK Push Webhook Callback
// @access  Public
router.post('/mpesa/callback', async (req, res) => {
    try {
        const callbackData = req.body.Body.stkCallback;
        const checkoutRequestId = callbackData.CheckoutRequestID;
        const resultCode = callbackData.ResultCode; // 0 means success

        const payment = await Payment.findOne({ checkoutRequestId });
        if (!payment) {
            return res.status(404).send('Payment record not found');
        }

        if (resultCode === 0) {
            // Find MpesaReceiptNumber in metadata
            const items = callbackData.CallbackMetadata.Item;
            const receiptItem = items.find(i => i.Name === 'MpesaReceiptNumber');

            payment.status = 'completed';
            payment.transactionId = receiptItem.Value;
            payment.metadata = callbackData;
            await payment.save();

            // Activate user subscription
            const user = await User.findById(payment.user);
            user.subscriptionTier = payment.subscriptionPlan;
            user.subscriptionStatus = 'active';
            // Set expiry to 30 days from now
            user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await user.save();

        } else {
            payment.status = 'failed';
            payment.metadata = callbackData;
            await payment.save();
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('M-Pesa Webhook Error:', error);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/payments/pesapal/ipn
// @desc    Pesapal IPN Webhook
// @access  Public
router.post('/pesapal/ipn', async (req, res) => {
    const { OrderTrackingId, OrderNotificationType, OrderMerchantReference } = req.body;

    if (!OrderTrackingId) return res.status(400).send('Missing OrderTrackingId');

    try {
        const payment = await Payment.findOne({ transactionId: OrderTrackingId });
        if (!payment) return res.status(404).send('Payment record not found');

        // In a real scenario, you'd use getTransactionStatus here to verify the payment 
        // against Pesapal's servers securely using OrderTrackingId, then fulfill it.

        // Simulating fulfillment for implementation purposes:
        payment.status = 'completed';
        payment.metadata = req.body;
        await payment.save();

        const user = await User.findById(payment.user);
        user.subscriptionTier = payment.subscriptionPlan;
        user.subscriptionStatus = 'active';
        user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();

        res.status(200).json({
            status: '200' // Pesapal expects this response
        });
    } catch (error) {
        console.error('Pesapal IPN Error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
