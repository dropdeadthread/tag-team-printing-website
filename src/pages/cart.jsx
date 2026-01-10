import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { CartContext } from '../context/CartContext';
import Layout from '../components/Layout';
import '../styles/cart.css';

const CartPage = () => {
  // Defensive: Ensure context is available
  const context = useContext(CartContext);

  // Fallback if context is blocked or unavailable
  if (!context) {
    return (
      <Layout>
        <div className="cart-container">
          <div className="cart-content">
            <h1 className="cart-title">Cart Unavailable</h1>
            <p className="empty-cart-message">
              Unable to load cart. Please disable browser extensions and refresh
              the page.
            </p>
            <Link
              to="/"
              style={{ color: '#fff5d1', textDecoration: 'underline' }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { cartItems = [], removeFromCart, updateCartItemQuantity } = context;

  // Cart items use standardized format - no need to merge with product data
  const mergedCart = (cartItems || []).map((item) => ({
    ...item,
    quantity: item.quantity || 1,
  }));

  const handleQuantityChange = (index, delta) => {
    const item = cartItems[index];
    const newQty = Math.max(1, (item.quantity || 1) + delta); // Use lowercase field name
    updateCartItemQuantity(index, newQty);
  };

  const total = mergedCart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1), // Use standardized lowercase field names
    0,
  );

  return (
    <Layout>
      <div className="cart-container">
        <div className="cart-content">
          <h1 className="cart-title">Your Cart</h1>

          {mergedCart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items-list">
                {mergedCart.map((item, idx) => (
                  <div className="cart-item" key={item.styleID || idx}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-thumbnail"
                    />
                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p>Brand: {item.brand}</p>
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                      <div className="cart-qty-controls">
                        <button onClick={() => handleQuantityChange(idx, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(idx, 1)}>
                          +
                        </button>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="total">Total: ${total.toFixed(2)}</div>
                <div className="checkout-options">
                  <p
                    style={{
                      fontSize: '1.1rem',
                      marginBottom: '1.5rem',
                      color: '#fff5d1',
                      textAlign: 'center',
                    }}
                  >
                    Ready to checkout? Use the floating cart button in the
                    bottom right for our secure Square checkout, or continue
                    with our custom form below.
                  </p>
                  <Link to="/checkout" className="checkout-button secondary">
                    Continue with Custom Form
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
