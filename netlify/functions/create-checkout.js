const { Client, Environment } = require('square');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Initialize Square client inside handler to ensure env vars are available
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { cartItems } = JSON.parse(event.body);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid cart data' }),
      };
    }

    // Check if Square credentials are available
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Square checkout not configured',
          details:
            'Square API credentials are missing. Please configure SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID environment variables.',
        }),
      };
    }

    const lineItems = cartItems.map((item) => ({
      name: item.name || item.styleName || 'Product',
      quantity: (item.quantity || 1).toString(),
      basePriceMoney: {
        amount: Math.round((item.price || 0) * 100), // In cents
        currency: 'CAD',
      },
      note: `${item.color || 'Default'} - ${item.size || 'M'}`,
    }));

    const { result } = await client.checkoutApi.createCheckout(
      process.env.SQUARE_LOCATION_ID,
      {
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          lineItems,
        },
        redirectUrl: 'https://tagteamprints.com/order-confirmed',
      },
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ checkoutUrl: result.checkout.checkoutPageUrl }),
    };
  } catch (error) {
    console.error('Checkout Error:', error);

    let errorMessage = 'Checkout failed';
    let errorDetails = error.message;

    // Handle specific Square API errors
    if (error.errors && error.errors.length > 0) {
      errorDetails = error.errors.map((e) => e.detail || e.code).join(', ');
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: errorMessage,
        details: errorDetails,
      }),
    };
  }
};
