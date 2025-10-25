import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/cartpanel.css';

const CartPanel = ({ onClose, isOpen }) => {
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } =
    useContext(CartContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (index, delta) => {
    const item = cartItems[index];
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    updateCartItemQuantity(index, newQty);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleRemove = (index) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(index);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsCheckingOut(true);

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
        // Redirect to custom checkout form in development
        window.location.href = '/checkout';
      } else {
        alert(
          'There was a problem creating your checkout session. Please try again.',
        );
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  return (
    <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="cart-panel-close"
        aria-label="Close cart"
      >
        ✕
      </button>

      <h2>Your Cart</h2>

      {/* Cart Contents */}
      {cartItems.length === 0 ? (
        <p className="cart-panel-empty">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-panel-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-panel-item">
                <strong>{item.name || item.styleName}</strong>
                <p>
                  {item.color} - {item.size}
                </p>
                <div className="cart-panel-qty-controls">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                <button
                  onClick={() => handleRemove(index)}
                  className="cart-panel-remove"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Total and Actions */}
          <div className="cart-panel-total">Total: ${total.toFixed(2)}</div>

          <div className="cart-panel-actions">
            <button onClick={handleClearCart} className="cart-panel-clear">
              Clear Cart
            </button>

            <button
              onClick={handleCheckout}
              className="cart-panel-checkout"
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : '🔒 Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPanel;
