// src/pages/quote-confirmed.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'gatsby';
import '../styles/orderconfirmed.css';

const QuoteConfirmedPage = ({ location }) => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location?.search || '');
    const urlOrderId = searchParams.get('orderId') || searchParams.get('id');
    const sessionOrderId = sessionStorage.getItem('lastOrderId');

    const finalOrderId = urlOrderId || sessionOrderId;
    if (finalOrderId) {
      setOrderId(finalOrderId);
    }
  }, [location]);

  return (
    <Layout>
      <div className="order-confirmed-container">
        <h1 className="confirmed-title">Quote Request Received</h1>
        <p className="confirmed-message">
          Thanks for reaching out. Check your email for a copy of your quote
          &mdash; we&apos;ll follow up if you have any questions or want to move
          forward with an order.
        </p>

        {orderId && <p className="confirmed-order-id">Quote ID: {orderId}</p>}

        <div className="confirmed-actions">
          <Link to="/blanks" className="back-to-shop-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="home-btn">
            Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default QuoteConfirmedPage;
