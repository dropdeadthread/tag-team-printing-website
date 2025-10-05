import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/globals.css';

const CartPanel = ({ onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
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

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl; // 🚀 Go to Square checkout page
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("There was a problem creating your checkout session.");
    }
  };

  return (
    <div
      className="cart-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
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
              <p><strong>{item.Title}</strong></p>
              <p>{item.Fit} - {item.Size}</p>
              <p>Qty: {item.Quantity || 1}</p>
              <p>${item.Price}</p>
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
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#fff'
          }}>
            Total: ${cartItems.reduce((total, item) => total + (item.Price || 0) * (item.Quantity || 1), 0).toFixed(2)}
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
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
