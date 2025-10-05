// src/api/process-payment.js
import { Client, Environment } from 'square';
import crypto from 'crypto'; // ✅ Make sure this is imported!

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox, // ✅ sandbox for testing
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = JSON.parse(req.body); // ✅ THIS is the fix!
    const { token } = body;

    const { result } = await client.paymentsApi.createPayment({
      idempotencyKey: crypto.randomUUID(),
      sourceId: token,
      amountMoney: {
        amount: 2500, // $25.00 in cents
        currency: 'USD',
      },
      locationId: process.env.SQUARE_LOCATION_ID,
    });

    console.log('Payment Success:', result);
    return res.status(200).json({ success: true, payment: result });
  } catch (error) {
    console.error('Payment Failure:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
