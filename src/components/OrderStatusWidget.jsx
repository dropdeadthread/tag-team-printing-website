import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  max-width: 400px;
  
  &.compact {
    padding: 1rem;
    max-width: 300px;
  }
  
  &.inline {
    display: inline-block;
    margin: 0.5rem;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h4 {
    color: #1f2937;
    font-size: 1.125rem;
    margin: 0;
    
    .compact & {
      font-size: 1rem;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'artwork-review':
        return 'background: #ddd6fe; color: #5b21b6;';
      case 'approved':
        return 'background: #dcfce7; color: #166534;';
      case 'in-production':
        return 'background: #dbeafe; color: #1e40af;';
      case 'completed':
        return 'background: #d1fae5; color: #065f46;';
      case 'shipped':
        return 'background: #ecfdf5; color: #047857;';
      case 'cancelled':
        return 'background: #fee2e2; color: #dc2626;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.75rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const OrderInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  
  p {
    margin: 0.25rem 0;
  }
  
  .compact & {
    font-size: 0.8rem;
  }
`;

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
  
  .compact & {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  
  div {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f4f6;
    border-top: 2px solid #3b82f6;
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
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
`;

const getStatusProgress = (status) => {
  const statusMap = {
    'pending': 10,
    'artwork-review': 25,
    'approved': 40,
    'in-production': 70,
    'completed': 90,
    'shipped': 100,
    'cancelled': 0
  };
  return statusMap[status] || 0;
};

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Order Received',
    'artwork-review': 'Artwork Review',
    'approved': 'Approved',
    'in-production': 'In Production',
    'completed': 'Completed',
    'shipped': 'Shipped',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

const OrderStatusWidget = ({ 
  orderId, 
  variant = 'default', // 'default', 'compact', 'inline'
  showProgress = true,
  showDetails = true,
  onViewDetails,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderStatus = useCallback(async () => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/get-order?orderId=${encodeURIComponent(orderId)}`);
      
      if (!response.ok) {
        throw new Error('Order not found');
      }
      
      const data = await response.json();
      setOrderData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchOrderStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [orderId, autoRefresh, refreshInterval, fetchOrderStatus]);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(orderData);
    } else if (typeof window !== 'undefined') {
      window.open(`/order-status?id=${encodeURIComponent(orderId)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <WidgetContainer className={variant}>
        <LoadingSpinner>
          <div />
        </LoadingSpinner>
      </WidgetContainer>
    );
  }

  if (error) {
    return (
      <WidgetContainer className={variant}>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </WidgetContainer>
    );
  }

  if (!orderData) {
    return (
      <WidgetContainer className={variant}>
        <ErrorMessage>
          No order data available
        </ErrorMessage>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer className={variant}>
      <WidgetHeader>
        <h4>Order #{orderData.orderId}</h4>
        <StatusBadge status={orderData.status}>
          {formatStatus(orderData.status)}
        </StatusBadge>
      </WidgetHeader>

      {showProgress && (
        <ProgressBar>
          <ProgressFill progress={getStatusProgress(orderData.status)} />
        </ProgressBar>
      )}

      {showDetails && (
        <OrderInfo>
          <p><strong>Quantity:</strong> {orderData.quantity}</p>
          {orderData.garment && (
            <p><strong>Item:</strong> {orderData.garment.brand} {orderData.garment.styleName}</p>
          )}
          {orderData.color && (
            <p><strong>Color:</strong> {orderData.color}</p>
          )}
          {orderData.orderDate && (
            <p><strong>Ordered:</strong> {new Date(orderData.orderDate).toLocaleDateString()}</p>
          )}
          {orderData.estimatedCompletion && (
            <p><strong>Est. Completion:</strong> {new Date(orderData.estimatedCompletion).toLocaleDateString()}</p>
          )}
        </OrderInfo>
      )}

      <ActionButton onClick={handleViewDetails}>
        View Full Details
      </ActionButton>
    </WidgetContainer>
  );
};

export default OrderStatusWidget;