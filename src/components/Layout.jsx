import React, { useState, useContext } from 'react';
import { useLocation } from '@reach/router';
import { CartContext } from '../context/CartContext';
import '../styles/globals.css';

import Header from './Header'; // ✅ Use updated dropdown Header
import Footer from './Footer';
import FloatingCartButton from './FloatingCartButton';
import CartPanel from './CartPanel';

const Layout = ({ children }) => {
  const location = useLocation();
  const isProductPage =
    location.pathname.startsWith('/products/') ||
    location.pathname.startsWith('/shop/');
  const isCartPage = location.pathname === '/cart/';
  const [cartOpen, setCartOpen] = useState(false);

  const { cartItems } = useContext(CartContext);
  const itemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <div
      className={`layout-wrapper ${isProductPage ? 'product-layout' : ''} ${isCartPage ? 'cart-layout' : ''}`}
    >
      <Header itemCount={itemCount} /> {/* ✅ Passing cart count to Header */}
      <main>
        {children}
        <FloatingCartButton
          onClick={() => setCartOpen(true)}
          itemCount={itemCount}
        />
        {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
