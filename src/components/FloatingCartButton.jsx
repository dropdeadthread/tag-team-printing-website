import React from 'react';
import '../styles/floatingcartbutton.css';

const FloatingCartButton = ({ onClick, itemCount = 0 }) => {
  return (
    <button
      className="floating-cart-button"
      onClick={onClick}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      🛒
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </button>
  );
};

export default FloatingCartButton;
