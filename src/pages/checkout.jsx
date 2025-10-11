// src/pages/checkout.jsx - FIXED: Added inventory validation + React import fix
import { useEffect, useState, useContext } from 'react';
import { loadSquareSdk } from '../utils/loadSquareSdk';
import { CartContext } from '../context/CartContext';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState('');
  const [fields, setFields] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    async function initializeSquare() {
      await loadSquareSdk();
      if (!window.Square) return;

      const paymentsInstance = window.Square.payments(
        process.env.GATSBY_SQUARE_APP_ID,
        process.env.GATSBY_SQUARE_LOCATION_ID,
      );

      const cardInstance = await paymentsInstance.card();
      await cardInstance.attach('#card-container');
      setCard(cardInstance);
    }

    initializeSquare();
  }, []);

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    if (!card) return;

    try {
      setStatus('Processing...');

      // NEW: Step 1 - Validate inventory before processing payment
      setStatus('Validating inventory...');
      for (const item of cartItems) {
        try {
          const inventoryResponse = await fetch(
            `/.netlify/functions/get-inventory?styleID=${item.styleID}&color=${encodeURIComponent(item.color)}`,
          );

          if (inventoryResponse.ok) {
            const inventory = await inventoryResponse.json();
            const sizeInventory = inventory.sizes && inventory.sizes[item.size];

            if (!sizeInventory || sizeInventory.available < item.quantity) {
              setStatus(
                `Sorry, ${item.name} in ${item.color} size ${item.size} is ${sizeInventory ? 'low in stock' : 'out of stock'}. Available: ${sizeInventory?.available || 0}, Requested: ${item.quantity}`,
              );
              return;
            }
          } else {
            console.warn(
              `Could not validate inventory for ${item.name}, proceeding with payment`,
            );
          }
        } catch (inventoryError) {
          console.warn('Inventory validation failed:', inventoryError);
          // Continue with payment if inventory check fails to avoid blocking valid orders
        }
      }

      // Calculate total in cents
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const amountInCents = Math.round(totalAmount * 100);

      // Step 2: Tokenize card
      const result = await card.tokenize();

      if (result.status === 'OK') {
        // Step 3: Process payment with Square
        const response = await fetch('/.netlify/functions/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: result.token,
            amount: amountInCents,
            currency: 'CAD', // FIXED: Use CAD to match Canadian business and create-checkout.js
          }),
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          // Step 4: Send order to Control Hub
          try {
            const orderResponse = await fetch(
              '/.netlify/functions/streamlined-order',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customer: {
                    name: fields.name,
                    email: fields.email,
                    phone: fields.phone || '',
                    notes: `Checkout order - Payment ID: ${paymentResult.payment.id}`,
                  },
                  items: cartItems,
                  total: totalAmount,
                  paymentId: paymentResult.payment.id,
                  paymentStatus: 'completed',
                  orderType: 'checkout-cart',
                  shippingAddress: fields.address,
                }),
              },
            );

            const orderData = await orderResponse.json();
            console.log('✅ Order synced to Control Hub:', orderData);
          } catch (hubError) {
            console.warn(
              '⚠️ Control Hub sync failed (payment still processed):',
              hubError,
            );
          }

          clearCart();
          setStatus('Payment Successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/order-confirmed';
          }, 2000);
        } else {
          setStatus(
            'Payment Failed: ' + (paymentResult.message || 'Unknown error'),
          );
        }
      } else {
        setStatus(
          'Card validation failed: ' +
            (result.errors?.[0]?.message || 'Unknown error'),
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('Error during payment: ' + error.message);
    }
  };

  // Calculate cart total for display
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="checkout-container"
      style={{ fontFamily: 'var(--font-luchita-rueda)' }}
    >
      <div className="checkout-box">
        <h1>Checkout</h1>

        {/* Cart Summary */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h3>Order Summary</h3>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <input
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <input
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            type="tel"
          />
          <input
            name="address"
            value={fields.address}
            onChange={handleChange}
            placeholder="Shipping Address"
            required
          />

          <div id="card-container" style={{ marginBottom: '1rem' }}></div>

          <button
            className="checkout-button"
            type="submit"
            disabled={!card || status.includes('Processing')}
          >
            {status.includes('Processing')
              ? 'Processing...'
              : `Pay $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {status && (
          <div
            className={`payment-status ${
              status.includes('Failed') || status.includes('Error')
                ? 'error'
                : 'success'
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
