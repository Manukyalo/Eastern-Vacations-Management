const axios = require('axios');

const PESAPAL_ENV = process.env.PESAPAL_ENV || 'sandbox'; // sandbox or production
const BASE_URL = PESAPAL_ENV === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3';

const getAuthToken = async () => {
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error('Pesapal credentials not configured');
    }

    try {
        const response = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
            consumer_key: consumerKey,
            consumer_secret: consumerSecret
        });
        return response.data.token;
    } catch (error) {
        console.error('Pesapal Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Pesapal');
    }
};

const registerIPN = async (token) => {
    const ipnUrl = `${process.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/pesapal/ipn`;

    try {
        const response = await axios.post(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
            url: ipnUrl,
            ipn_notification_type: 'POST'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Contains ipn_id
    } catch (error) {
        console.error('Pesapal IPN Registration Error:', error.response?.data || error.message);
        throw new Error('Failed to register IPN URL');
    }
};

const submitOrder = async (orderData) => {
    const token = await getAuthToken();
    const ipnData = await registerIPN(token);

    try {
        const response = await axios.post(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
            id: orderData.merchantReference, // Unique order ID
            currency: orderData.currency || 'USD',
            amount: orderData.amount,
            description: orderData.description,
            callback_url: `${process.env.VITE_API_URL || 'http://localhost:3000'}/pricing?status=pesapal_callback`,
            notification_id: ipnData.ipn_id,
            billing_address: {
                email_address: orderData.email,
                phone_number: orderData.phone,
                country_code: 'KE',
                first_name: orderData.firstName,
                last_name: orderData.lastName,
                line_1: 'N/A',
                line_2: 'N/A',
                city: 'N/A',
                state: 'N/A',
                postal_code: 'N/A',
                zip_code: 'N/A'
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data; // Contains redirect_url for the iframe
    } catch (error) {
        console.error('Pesapal Submit Order Error:', error.response?.data || error.message);
        throw new Error('Failed to submit Pesapal order');
    }
};

const getTransactionStatus = async (orderTrackingId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Pesapal Transaction Status Error:', error.response?.data || error.message);
        throw new Error('Failed to get transaction status');
    }
};

module.exports = {
    submitOrder,
    getTransactionStatus
};
