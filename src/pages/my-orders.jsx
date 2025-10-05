import { useEffect } from 'react';
import { navigate } from 'gatsby';

// Redirect page - this page has been moved to /customer-dashboard
const MyOrders = () => {
  useEffect(() => {
    // Get URL parameters and redirect to new dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
      navigate(`/customer-dashboard?email=${email}`);
    } else {
      navigate('/customer-dashboard?tab=history');
    }
  }, []);

  return null; // Component will redirect immediately
};

export default MyOrders;