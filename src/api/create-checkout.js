import { Client, Environment } from 'square';
import crypto from 'crypto'; // ✅ Required for idempotencyKey

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production, // Using production environment
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // In Gatsby API routes, body is already parsed
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Check if Square credentials are available
    const locationId =
      process.env.GATSBY_SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID;
    if (!process.env.SQUARE_ACCESS_TOKEN || !locationId) {
      return res.status(500).json({
        error: 'Square checkout not configured',
        details:
          'Square API credentials are missing. Please configure SQUARE_ACCESS_TOKEN and GATSBY_SQUARE_LOCATION_ID environment variables.',
      });
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

    const { result } = await client.checkoutApi.createCheckout(locationId, {
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: locationId,
        lineItems,
      },
      redirectUrl: 'https://tagteamprints.com/order-confirmed',
    });

    return res
      .status(200)
      .json({ checkoutUrl: result.checkout.checkoutPageUrl });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Checkout Error:', error);
    }

    let errorMessage = 'Checkout failed';
    let errorDetails = error.message;

    // Handle specific Square API errors
    if (error.errors && error.errors.length > 0) {
      errorDetails = error.errors.map((e) => e.detail || e.code).join(', ');
    }

    return res.status(500).json({
      error: errorMessage,
      details: errorDetails,
    });
  }
}
