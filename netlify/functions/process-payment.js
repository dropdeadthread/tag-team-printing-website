// Fixed version - CommonJS syntax for Netlify
const { Client, Environment } = require('square');
const crypto = require('crypto');

// Fail loudly if token is missing - prevents silent authentication failures
const token = (process.env.SQUARE_ACCESS_TOKEN || '').trim();
if (!token) {
  throw new Error(
    'Missing SQUARE_ACCESS_TOKEN - Square SDK cannot authenticate without it',
  );
}

// Use production environment in production, sandbox otherwise
const environment =
  process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox;

// Initialize Square client
const client = new Client({
  token, // ✅ FIXED: Square SDK v42+ uses 'token', not 'accessToken'
  environment,
});

// Netlify Function Handler
exports.handler = async function (event) {
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

    // ✅ SYNC PAYMENT TO CONTROL HUB (for order matching)
    try {
      const controlHubUrl =
        process.env.CONTROL_HUB_URL || 'http://localhost:4000';
      const controlHubSync = await fetch(`${controlHubUrl}/api/square/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CONTROL_HUB_API_KEY || 'dev-secret-key',
        },
        body: JSON.stringify({
          transactionId: result.payment.id,
          amount: result.payment.amountMoney.amount,
          currency: result.payment.amountMoney.currency,
          status: result.payment.status,
          orderId: result.payment.orderId,
          customerId: result.payment.customerId,
          receiptUrl: result.payment.receiptUrl,
          timestamp: result.payment.createdAt,
        }),
      });

      if (controlHubSync.ok) {
        console.log('✅ Payment synced to Control Hub');
      } else {
        console.warn(
          '⚠️ Control Hub payment sync failed (payment still processed)',
        );
      }
    } catch (syncError) {
      console.warn(
        '⚠️ Control Hub unreachable (payment still processed):',
        syncError.message,
      );
    }

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
