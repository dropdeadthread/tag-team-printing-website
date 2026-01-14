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

  const validateCartItems = () => {
    // Validate cart items have required fields
    for (const item of cartItems) {
      if (!item.price || item.price <= 0) {
        return 'Some items in your cart have invalid pricing. Please refresh and try again.';
      }
      if (!item.quantity || item.quantity <= 0) {
        return 'Some items in your cart have invalid quantities.';
      }
      if (!item.size || !item.color) {
        return 'Some items are missing size or color information.';
      }
    }
    return null;
  };

  const handleCheckout = async (retryCount = 0) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate cart items before checkout
    const validationError = validateCartItems();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsCheckingOut(true);

    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Provide specific error messages based on status code
        let errorMessage = 'Checkout failed';
        if (response.status === 404) {
          errorMessage =
            'Checkout service not found. Please contact support or use the order form.';
        } else if (response.status === 500) {
          errorMessage =
            data.details ||
            'Server error during checkout. Please try again or contact support.';
        } else if (response.status === 400) {
          errorMessage =
            'Invalid cart data. Please refresh the page and try again.';
        } else {
          errorMessage = data.details || data.error || 'Checkout failed';
        }
        throw new Error(errorMessage);
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // 🚀 Go to Square checkout page
      } else {
        throw new Error('No checkout URL received from payment processor');
      }
    } catch (error) {
      console.error('Checkout Error:', error);

      // Handle network timeout
      if (error.name === 'AbortError') {
        if (retryCount < 1) {
          // Retry once on timeout
          alert('Connection timeout. Retrying...');
          return handleCheckout(retryCount + 1);
        } else {
          alert(
            'Connection timeout. Please check your internet connection and try again.',
          );
        }
        setIsCheckingOut(false);
        return;
      }

      // In development, fallback to custom checkout
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to custom checkout form');
        window.location.href = '/checkout';
        return;
      }

      // In production, show detailed error message
      alert(
        `Checkout Error: ${error.message}\n\nPlease try again or use the Order Form to place your order.`,
      );
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
