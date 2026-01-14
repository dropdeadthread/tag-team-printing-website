const { Client, Environment } = require('square');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Initialize Square client inside handler to ensure env vars are available
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  // CORS headers - Allow only from Tag Team Printing domain
  const allowedOrigins = [
    'https://tagteamprints.com',
    'https://www.tagteamprints.com',
    'http://localhost:8000', // Gatsby dev server
    'http://localhost:5000', // Alternative dev server
  ];
  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : 'https://tagteamprints.com';

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
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
    // Support both GATSBY_SQUARE_LOCATION_ID (build-time) and SQUARE_LOCATION_ID (runtime)
    const locationId =
      process.env.GATSBY_SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID;
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('Missing SQUARE_ACCESS_TOKEN');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Square checkout not configured',
          details:
            'SQUARE_ACCESS_TOKEN is not configured. Please contact support.',
        }),
      };
    }

    if (!locationId) {
      console.error(
        'Missing location ID - checked GATSBY_SQUARE_LOCATION_ID and SQUARE_LOCATION_ID',
      );
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Square checkout not configured',
          details:
            'Square location ID is not configured. Please contact support.',
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

    // Validate cart items before sending to Square
    for (const item of cartItems) {
      if (!item.price || item.price <= 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid cart data',
            details: 'Some items have invalid pricing',
          }),
        };
      }
      if (!item.quantity || item.quantity <= 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid cart data',
            details: 'Some items have invalid quantities',
          }),
        };
      }
    }

    const { result } = await client.checkoutApi.createCheckout(locationId, {
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: locationId,
        lineItems,
      },
      redirectUrl: 'https://tagteamprints.com/order-confirmed',
    });

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
