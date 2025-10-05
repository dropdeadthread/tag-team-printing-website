import { useEffect } from 'react';
import { navigate } from 'gatsby';

// Redirect page - this page has been moved to /customer-dashboard
const OrderStatus = () => {
  useEffect(() => {
    // Get URL parameters and redirect to new dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (orderId) {
      navigate(`/customer-dashboard?id=${orderId}`);
    } else {
      navigate('/customer-dashboard?tab=track');
    }
  }, []);

  return null; // Component will redirect immediately
};

export default OrderStatus;