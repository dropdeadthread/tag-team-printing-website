import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";
import { Link } from "gatsby";
import "../styles/cart.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/list-products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Merge cart items with product details
  const mergedCart = cartItems.map(item => {
    const product = products.find(p => String(p.styleID) === String(item.styleID));
    return {
      ...item,
      ...product,
      Quantity: item.Quantity || 1,
    };
  });

  const handleQuantityChange = (index, delta) => {
    const item = cartItems[index];
    const newQty = Math.max(1, (item.Quantity || 1) + delta);
    updateCartItemQuantity(index, newQty);
  };

  const total = mergedCart.reduce((acc, item) => acc + (item.Price || 0) * (item.Quantity || 1), 0);

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
                  <img src={item.styleImage || item.Image} alt={item.title || item.Title} className="cart-thumbnail" />
                  <div className="cart-info">
                    <h3>{item.title || item.Title}</h3>
                    <p>Fit: {item.Fit || item.fit}</p>
                    <p>Size: {item.Size || item.size}</p>
                    <div className="cart-qty-controls">
                      <button onClick={() => handleQuantityChange(idx, -1)}>-</button>
                      <span>{item.Quantity}</span>
                      <button onClick={() => handleQuantityChange(idx, 1)}>+</button>
                    </div>
                    <p>${((item.Price || 0) * item.Quantity).toFixed(2)}</p>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(idx)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Total: ${total.toFixed(2)}</h2>
              <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
            </div>
          </>
        )}
        <p>This page is under construction.</p>
      </div>
    </Layout>
  );
};

export default CartPage;
