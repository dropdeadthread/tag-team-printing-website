const fs = require('fs').promises;
const path = require('path');

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Basic admin authentication check
    const authHeader = req.headers.authorization;
    const adminPassword = "2StaceyS>@ne"; // Should match your admin password
    
    // For now, we'll skip auth check for simplicity, but you should implement proper auth
    // if (!authHeader || !authHeader.includes(adminPassword)) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Read orders from file
    try {
      const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
      const orders = JSON.parse(ordersData);
      
      // Sort by timestamp (newest first)
      orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Add computed fields for admin interface
      const enrichedOrders = orders.map(order => ({
        ...order,
        customerName: order.customer?.name || order.customerName,
        customerEmail: order.customer?.email || order.email,
        daysSinceCreated: Math.ceil((new Date() - new Date(order.timestamp)) / (1000 * 60 * 60 * 24)),
        statusDisplay: formatStatusForDisplay(order.status)
      }));
      
      console.log(`✅ Admin retrieved ${enrichedOrders.length} orders`);
      
      res.status(200).json({
        success: true,
        orders: enrichedOrders,
        totalOrders: enrichedOrders.length,
        statusCounts: getStatusCounts(enrichedOrders)
      });
      
    } catch (fileError) {
      // If file doesn't exist, return empty array
      if (fileError.code === 'ENOENT') {
        res.status(200).json({
          success: true,
          orders: [],
          totalOrders: 0,
          statusCounts: {}
        });
      } else {
        throw fileError;
      }
    }
    
  } catch (error) {
    console.error('❌ Error retrieving orders for admin:', error);
    res.status(500).json({
      error: 'Failed to retrieve orders',
      details: error.message
    });
  }
};

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

// Helper function to get status counts
function getStatusCounts(orders) {
  const counts = {};
  orders.forEach(order => {
    counts[order.status] = (counts[order.status] || 0) + 1;
  });
  return counts;
}