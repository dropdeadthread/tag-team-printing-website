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
    const body = await req.json();
    const { cartItems } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    const lineItems = cartItems.map((item) => ({
      name: item.Title,
      quantity: item.Quantity?.toString() || '1',
      basePriceMoney: {
        amount: Math.round(item.Price * 100), // In cents
        currency: 'CAD',
      },
      note: `${item.Fit || 'Unisex'} - ${item.Size || 'M'}`,
    }));

    const { result } = await client.checkoutApi.createCheckout(
      process.env.SQUARE_LOCATION_ID,
      {
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          lineItems,
        },
        redirectUrl: 'https://tagteamprinting.ca/Order-Confirmed',
      }
    );

    return res.status(200).json({ checkoutUrl: result.checkout.checkoutPageUrl });
  } catch (error) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ error: 'Checkout failed', details: error.message });
  }
}
