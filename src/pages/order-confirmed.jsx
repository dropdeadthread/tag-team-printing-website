// src/pages/order-confirmed.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import OrderStatusWidget from '../components/OrderStatusWidget';
import { Link } from 'gatsby';
import '../styles/orderconfirmed.css';

const OrderConfirmedPage = ({ location }) => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Get order ID from URL params or sessionStorage
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
        <h1 className="confirmed-title">🎉 Order Confirmed!</h1>
        <p className="confirmed-message">
          Thank you for your purchase. Your items will be printed and shipped soon.
        </p>
        
        {orderId && (
          <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
            <OrderStatusWidget 
              orderId={orderId}
              variant="default"
              showProgress={true}
              showDetails={true}
              autoRefresh={true}
            />
          </div>
        )}
        
        <div className="confirmed-actions">
          <Link to="/my-orders" className="back-to-shop-btn">
            📋 View All Orders
          </Link>
          <Link to="/blanks" className="back-to-shop-btn">
            ← Continue Shopping
          </Link>
          <Link to="/" className="home-btn">
            🏠 Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmedPage;
