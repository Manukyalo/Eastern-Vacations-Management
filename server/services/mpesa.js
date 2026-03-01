const axios = require('axios');

const MPESA_ENV = process.env.MPESA_ENV || 'sandbox'; // sandbox or production
const BASE_URL = MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

const getAuthToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error('M-Pesa credentials not configured');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('M-Pesa Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with M-Pesa');
    }
};

const initiateSTKPush = async (phoneNumber, amount, accountReference, transactionDesc) => {
    const token = await getAuthToken();
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = `${process.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/mpesa/callback`;

    // Format phone number to 254XXXXXXXXX
    let phone = phoneNumber.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) phone = `254${phone.slice(1)}`;
    if (phone.startsWith('+')) phone = phone.slice(1);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline', // or CustomerBuyGoodsOnline
            Amount: Math.ceil(amount), // M-Pesa requires integer amounts
            PartyA: phone,
            PartyB: shortCode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference.substring(0, 12),
            TransactionDesc: transactionDesc
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data; // Includes CheckoutRequestID for tracking
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        throw new Error('Failed to initiate M-Pesa STK Push');
    }
};

module.exports = {
    getAuthToken,
    initiateSTKPush
};
