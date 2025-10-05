import React, { useState, useEffect, useCallback } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Seo from '../components/SEO';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 160px auto 0 auto; /* Add top margin to clear absolute positioned header */
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 120px; /* Adjust for mobile header height */
    padding: 1rem;
  }
`;

const DashboardHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  
  h1 {
    color: #1f2937;
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
  }
  
  p {
    color: #6b7280;
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #3b82f6;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

const ContentSection = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

// Order Tracking Styles
const TrackingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h2 {
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

// Order History Styles
const LoginSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  button {
    background: #059669;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-right: 1rem;
    
    &:hover {
      background: #047857;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const OrderGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'pending': return '#f59e0b';
      case 'artwork-review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'production': return '#8b5cf6';
      case 'quality-check': return '#f97316';
      case 'shipped': return '#06b6d4';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  h3 {
    color: #1f2937;
    margin: 0;
    font-size: 1.25rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'artwork-review':
        return 'background: #dbeafe; color: #1e40af;';
      case 'approved':
        return 'background: #d1fae5; color: #065f46;';
      case 'production':
        return 'background: #ede9fe; color: #5b21b6;';
      case 'quality-check':
        return 'background: #fed7aa; color: #9a3412;';
      case 'shipped':
        return 'background: #cffafe; color: #155e75;';
      case 'delivered':
        return 'background: #dcfce7; color: #166534;';
      case 'cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const OrderDetails = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  p {
    margin: 0.25rem 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &.primary {
      background: #3b82f6;
      color: white;
      border: 1px solid #3b82f6;
      
      &:hover {
        background: #2563eb;
      }
    }
    
    &.secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      
      &:hover {
        background: #f9fafb;
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  div {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;



// Order Status Display Component
const OrderStatusDisplay = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'artwork-review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'production': return '#8b5cf6';
      case 'quality-check': return '#f97316';
      case 'shipped': return '#06b6d4';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const steps = [
    'pending',
    'artwork-review',
    'approved',
    'production',
    'quality-check',
    'shipped',
    'delivered'
  ];

  const currentStepIndex = steps.indexOf(order.status);

  return (
    <OrderCard status={order.status}>
      <OrderHeader>
        <h3>Order {order.id}</h3>
        <StatusBadge status={order.status}>{order.status.replace('-', ' ')}</StatusBadge>
      </OrderHeader>
      
      <OrderDetails>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Items:</strong> {order.items?.length || 0} item(s)</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        {order.estimatedDelivery && (
          <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
        )}
      </OrderDetails>

      {/* Progress Bar */}
      <div style={{ margin: '1rem 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#f3f4f6',
          borderRadius: '8px',
          padding: '0.5rem',
          position: 'relative'
        }}>
          <div 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              background: getStatusColor(order.status),
              borderRadius: '8px',
              opacity: 0.3,
              transition: 'width 0.3s ease'
            }}
          />
          {steps.map((step, index) => (
            <div 
              key={step}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index <= currentStepIndex ? getStatusColor(order.status) : '#d1d5db',
                zIndex: 1
              }}
            />
          ))}
        </div>
      </div>

      <ActionButtons>
        <button 
          className="primary"
          onClick={() => navigate(`/order-details/${order.id}`)}
        >
          View Details
        </button>
        {order.status === 'delivered' && (
          <button 
            className="secondary"
            onClick={() => {/* Handle reorder */}}
          >
            Reorder
          </button>
        )}
      </ActionButtons>
    </OrderCard>
  );
};

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('track');
  
  // Order Tracking State
  const [orderId, setOrderId] = useState('');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  
  // Order History State
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  
  // Define callback functions before useEffect
  const handleTrackOrder = useCallback(async (searchOrderId = orderId) => {
    if (!searchOrderId.trim()) return;
    
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingOrder(null);
    
    try {
      const response = await fetch(`/api/get-order?id=${encodeURIComponent(searchOrderId.trim())}`);
      const data = await response.json();
      
      if (data.success && data.order) {
        setTrackingOrder(data.order);
        // Update URL without page reload
        navigate(`/customer-dashboard?id=${encodeURIComponent(searchOrderId.trim())}`);
      } else {
        setTrackingError(data.message || 'Order not found. Please check your order ID and try again.');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setTrackingError('Unable to fetch order details. Please try again later.');
    } finally {
      setTrackingLoading(false);
    }
  }, [orderId, setTrackingLoading, setTrackingError, setTrackingOrder]);

  const handleEmailLogin = useCallback(async (email = customerEmail) => {
    if (!email.trim()) return;
    
    setHistoryLoading(true);
    setHistoryError('');
    
    try {
      const response = await fetch(`/api/get-customer-orders?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();
      
      if (data.success && data.orders) {
        setOrders(data.orders);
        setIsLoggedIn(true);
        // Update URL without page reload
        navigate(`/customer-dashboard?email=${encodeURIComponent(email.trim())}`);
      } else {
        setHistoryError(data.message || 'No orders found for this email address.');
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setHistoryError('Unable to fetch order history. Please try again later.');
    } finally {
      setHistoryLoading(false);
    }
  }, [customerEmail, setHistoryLoading, setHistoryError, setOrders, setIsLoggedIn]);
  
  // Check URL params on load  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('id');
    const emailParam = urlParams.get('email');
    const tabParam = urlParams.get('tab');
    
    // Set tab based on URL parameter
    if (tabParam === 'track' || tabParam === 'history') {
      setActiveTab(tabParam);
    }
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setActiveTab('track');
      handleTrackOrder(orderIdParam);
    } else if (emailParam) {
      setCustomerEmail(emailParam);
      setActiveTab('history');
      handleEmailLogin(emailParam);
    }
  }, [handleTrackOrder, handleEmailLogin]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCustomerEmail('');
    setOrders([]);
    navigate('/customer-dashboard');
  };

  return (
    <Layout>
      <Seo 
        title="Customer Dashboard" 
        description="Track your Tag Team Printing orders and view your order history. Get real-time updates on your custom apparel orders."
      />
      
      <DashboardContainer>
        <DashboardHeader>
          <h1>Customer Dashboard</h1>
          <p>Track your orders and view your order history all in one place</p>
        </DashboardHeader>

        <TabContainer>
          <Tab 
            active={activeTab === 'track'} 
            onClick={() => setActiveTab('track')}
          >
            Track Order
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            Order History
          </Tab>
        </TabContainer>

        {/* Order Tracking Tab */}
        <ContentSection active={activeTab === 'track'}>
          <TrackingCard>
            <h2>Track Your Order</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Enter your order ID to get real-time updates on your order status
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleTrackOrder(); }}>
              <input
                type="text"
                placeholder="Enter your order ID (e.g., TT-2024-001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                disabled={trackingLoading}
              />
              <button type="submit" disabled={trackingLoading || !orderId.trim()}>
                {trackingLoading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </TrackingCard>

          {trackingLoading && (
            <LoadingSpinner>
              <div />
            </LoadingSpinner>
          )}

          {trackingError && (
            <ErrorMessage>
              {trackingError}
            </ErrorMessage>
          )}

          {trackingOrder && (
            <OrderStatusDisplay order={trackingOrder} />
          )}
        </ContentSection>

        {/* Order History Tab */}
        <ContentSection active={activeTab === 'history'}>
          {!isLoggedIn ? (
            <LoginSection>
              <h3>View Your Order History</h3>
              <p>Enter your email address to view all your previous orders</p>
              <form onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={historyLoading}
                />
                <button type="submit" disabled={historyLoading || !customerEmail.trim()}>
                  {historyLoading ? 'Loading...' : 'View Orders'}
                </button>
              </form>
            </LoginSection>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1f2937' }}>Welcome back!</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{customerEmail}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>

              {historyLoading && (
                <LoadingSpinner>
                  <div />
                </LoadingSpinner>
              )}

              {historyError && (
                <ErrorMessage>
                  {historyError}
                </ErrorMessage>
              )}

              {orders.length > 0 ? (
                <OrderGrid>
                  {orders.map(order => (
                    <OrderStatusDisplay key={order.id} order={order} />
                  ))}
                </OrderGrid>
              ) : !historyLoading && (
                <div style={{
                  background: 'white',
                  padding: '3rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ color: '#6b7280' }}>No orders found</h3>
                  <p style={{ color: '#9ca3af' }}>
                    You haven't placed any orders yet, or they may be under a different email address.
                  </p>
                </div>
              )}
            </div>
          )}
        </ContentSection>
      </DashboardContainer>
    </Layout>
  );
};

export default CustomerDashboard;