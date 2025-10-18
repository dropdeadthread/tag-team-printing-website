import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/globals.css';

const CartPanel = ({ onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Checkout failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // 🚀 Go to Square checkout page
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Checkout Error:', error);
        // Silently redirect to custom checkout form in development
        window.location.href = '/checkout';
      } else {
        alert(
          'There was a problem creating your checkout session. Please try again.',
        );
      }
    }
  };

  return (
    <div
      className="cart-panel"
      style={{
        position: 'fixed',
        top: '120px',
        right: 0,
        width: '320px',
        height: 'calc(100% - 120px)',
        backgroundColor: '#111',
        color: '#fff',
        padding: '20px',
        zIndex: 1001,
        overflowY: 'auto',
        boxShadow: '-3px 0 10px rgba(0,0,0,0.5)',
      }}
    >
      {/* ✕ Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#ff0000',
          border: '2px solid #fff',
          borderRadius: '50%',
          padding: '8px 12px',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 9999,
        }}
      >
        ✕
      </button>

      <h2>Your Cart</h2>

      {/* 🛒 Cart Contents */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <p>
                <strong>{item.name || item.styleName}</strong>
              </p>
              <p>
                {item.color} - {item.size}
              </p>
              <p>Qty: {item.quantity || 1}</p>
              <p>${(item.price || 0).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(index)}
                style={{
                  backgroundColor: '#ff5050',
                  border: 'none',
                  color: '#fff',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  marginTop: '5px',
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 🔘 Cart Actions */}
      {cartItems.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#fff',
            }}
          >
            Total: $
            {cartItems
              .reduce(
                (total, item) =>
                  total + (item.price || 0) * (item.quantity || 1),
                0,
              )
              .toFixed(2)}
          </div>

          <button
            onClick={clearCart}
            style={{
              backgroundColor: '#444',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            style={{
              backgroundColor: '#00cc66',
              color: '#fff',
              padding: '15px 25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '15px',
              width: '100%',
              fontSize: '1.1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            🔒 Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
