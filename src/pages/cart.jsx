import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { CartContext } from '../context/CartContext';
import { Link } from 'gatsby';
import '../styles/cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/list-products')
      .then((res) => res.json())
      .then((data) => {
        // Handle both array format (legacy) and object format (Netlify function)
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
      });
  }, []);

  // Merge cart items with product details - FIXED: Use standardized field names
  const mergedCart = cartItems.map((item) => {
    const product = products.find(
      (p) => String(p.styleID) === String(item.styleID),
    );
    return {
      ...item,
      // Cart items now use standardized lowercase format, no need to merge different field names
      quantity: item.quantity || 1,
    };
  });

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
              <h2>Total: ${total.toFixed(2)}</h2>
              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
        <p>This page is under construction.</p>
      </div>
    </Layout>
  );
};

export default CartPage;
