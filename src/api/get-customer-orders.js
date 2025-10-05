const fs = require('fs').promises;
const path = require('path');

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get('email');
    const orderId = url.searchParams.get('orderId');
    
    if (!email && !orderId) {
      return res.status(400).json({ error: 'Email or Order ID is required' });
    }
    
    // Read orders from file
    try {
      const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
      const orders = JSON.parse(ordersData);
      
      let filteredOrders = [];
      
      if (orderId) {
        // Find specific order by ID
        const order = orders.find(order => order.id === orderId);
        if (order) {
          filteredOrders = [order];
        }
      } else if (email) {
        // Find orders by customer email
        filteredOrders = orders.filter(order => 
          (order.customer?.email || order.email) === email
        );
      }
      
      // Sort by timestamp (newest first)
      filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Add computed fields for frontend
      const enrichedOrders = filteredOrders.map(order => ({
        ...order,
        customerName: order.customer?.name || order.customerName,
        customerEmail: order.customer?.email || order.email,
        estimatedDelivery: calculateEstimatedDelivery(order),
        statusDisplay: formatStatusForDisplay(order.status),
        daysInCurrentStatus: calculateDaysInStatus(order)
      }));
      
      console.log(`✅ Retrieved ${enrichedOrders.length} orders for ${email || orderId}`);
      
      res.status(200).json({
        success: true,
        orders: enrichedOrders,
        totalOrders: enrichedOrders.length
      });
      
    } catch (fileError) {
      // If file doesn't exist, return empty array
      if (fileError.code === 'ENOENT') {
        res.status(200).json({
          success: true,
          orders: [],
          totalOrders: 0
        });
      } else {
        throw fileError;
      }
    }
    
  } catch (error) {
    console.error('❌ Error retrieving orders:', error);
    res.status(500).json({
      error: 'Failed to retrieve orders',
      details: error.message
    });
  }
};

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(order) {
  const createdDate = new Date(order.timestamp);
  const status = order.status;
  
  // Estimated days based on status
  const estimatedDays = {
    'pending': 14,
    'artwork-review': 12,
    'approved': 10,
    'in-production': 7,
    'completed': 3,
    'shipped': 1,
    'delivered': 0,
    'cancelled': null
  };
  
  const daysToAdd = estimatedDays[status];
  if (daysToAdd === null || daysToAdd === 0) {
    return null;
  }
  
  const estimatedDate = new Date(createdDate);
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
  
  return estimatedDate.toISOString();
}

// Helper function to format status for display
function formatStatusForDisplay(status) {
  const statusMap = {
    'pending': 'Order Received',
    'artwork-review': 'Artwork Review',
    'approved': 'Approved for Production',
    'in-production': 'In Production',
    'completed': 'Production Complete',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to calculate days in current status
function calculateDaysInStatus(order) {
  const statusHistory = order.statusHistory || [];
  
  if (statusHistory.length === 0) {
    // Use order creation date if no status history
    const createdDate = new Date(order.timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Get the most recent status change
  const latestStatusChange = statusHistory[statusHistory.length - 1];
  const statusDate = new Date(latestStatusChange.timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - statusDate);
  
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}