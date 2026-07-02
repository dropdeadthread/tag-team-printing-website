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

  const canonicalUrl = siteUrl || 'https://tagteamprints.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PrintingCompany'],
    name: 'Tag Team Printing',
    url: canonicalUrl,
    logo: `${canonicalUrl}/images/logo.png`,
    image: `${canonicalUrl}/images/logo.png`,
    telephone: '+1-613-363-4997',
    email: 'info@tagteamprints.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1016 First St E',
      addressLocality: 'Cornwall',
      addressRegion: 'ON',
      postalCode: 'K6H 1N4',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.0186,
      longitude: -74.7414,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://www.youtube.com/@tagteamprinting',
      'https://www.instagram.com/dropdeadthread',
      'https://www.facebook.com/dropdeadthread',
    ],
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'City',
        name: 'Cornwall',
        containedInPlace: { '@type': 'Province', name: 'Ontario' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Eastern Ontario',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Screen Printing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Screen Printing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Bulk Apparel Printing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DTF Printing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'School and Event Shirts',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Band and Artist Merch',
          },
        },
      ],
    },
  };

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
      <Helmet htmlAttributes={{ lang: 'en' }}>
        <script type="application/ld+json">{`${JSON.stringify(organizationSchema)}`}</script>
      </Helmet>
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
