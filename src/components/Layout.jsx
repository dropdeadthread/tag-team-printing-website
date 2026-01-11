import React, { useState, useContext } from 'react';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
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

  const siteTitle = 'Tag Team Printing';
  const siteUrl =
    (typeof window !== 'undefined' && window.location.origin) ||
    process.env.GATSBY_SITE_URL ||
    process.env.URL ||
    '';

  const organizationSchema = siteUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteTitle,
        url: siteUrl,
        logo: `${siteUrl}/images/logo.png`,
      }
    : null;

  // Defensive: Check if CartContext is available
  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.cartItems || [];
  const itemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <div
      className={`layout-wrapper ${isProductPage ? 'product-layout' : ''} ${isCartPage ? 'cart-layout' : ''}`}
    >
      {organizationSchema ? (
        <Helmet>
          <script type="application/ld+json">{`${JSON.stringify(organizationSchema)}`}</script>
        </Helmet>
      ) : null}
      <Header itemCount={itemCount} /> {/* ✅ Passing cart count to Header */}
      <main>
        {children}
        <FloatingCartButton
          onClick={() => setCartOpen(true)}
          itemCount={itemCount}
        />
        {cartOpen && (
          <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
