// Fixed version - CommonJS syntax for Netlify
const { Client, Environment } = require('square');
const crypto = require('crypto');

// Initialize Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.NODE_ENV === 'production'
      ? Environment.Production
      : Environment.Sandbox,
});

// Netlify Function Handler
exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse request body safely
    const body =
      typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { token, amount, currency = 'CAD', locationId } = body; // FIXED: Default to CAD for Canadian business

    // Validate required fields
    if (!token) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Payment token is required',
        }),
      };
    }

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Valid amount is required',
        }),
      };
    }

    // Create payment with Square
    const { result } = await client.paymentsApi.createPayment({
      idempotencyKey: crypto.randomUUID(),
      sourceId: token,
      amountMoney: {
        amount: Math.round(amount), // Amount in cents
        currency: currency,
      },
      locationId: locationId || process.env.GATSBY_SQUARE_LOCATION_ID,
    });

    console.log('✅ Payment Success:', {
      paymentId: result.payment.id,
      amount: result.payment.amountMoney.amount,
      status: result.payment.status,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        payment: result.payment,
        message: 'Payment processed successfully',
      }),
    };
  } catch (error) {
    console.error('❌ Payment Failure:', error);

    // Return appropriate error response
    const statusCode = error.statusCode || 500;
    const errorMessage =
      error.errors?.[0]?.detail || error.message || 'Payment processing failed';

    return {
      statusCode: statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error:
          process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      }),
    };
  }
};
