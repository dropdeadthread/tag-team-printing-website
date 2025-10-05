const { promises: fs } = require('fs');
const path = require('path');

// Try to load from both local orders and streamlined orders
const loadOrders = async () => {
  try {
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const streamlinedOrdersPath = path.join(process.cwd(), 'data', 'streamlined-orders.json');
    
    let orders = [];
    
    // Load regular orders
    try {
      const ordersData = await fs.readFile(ordersPath, 'utf8');
      orders = orders.concat(JSON.parse(ordersData));
    } catch (err) {
      console.log('No orders.json found, continuing...');
    }
    
    // Load streamlined orders
    try {
      const streamlinedData = await fs.readFile(streamlinedOrdersPath, 'utf8');
      const streamlinedOrders = JSON.parse(streamlinedData);
      orders = orders.concat(streamlinedOrders);
    } catch (err) {
      console.log('No streamlined-orders.json found, continuing...');
    }
    
    return orders;
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Fetch status from Control Hub
const getControlHubStatus = async (orderId) => {
  try {
    const CONTROL_HUB_URL = process.env.CONTROL_HUB_URL || 'http://localhost:4000';
    const response = await fetch(`${CONTROL_HUB_URL}/api/orders/${orderId}/status`);
    
    if (response.ok) {
      const statusData = await response.json();
      return statusData;
    }
  } catch (error) {
    console.log('Control Hub not available, using local data');
  }
  return null;
};

module.exports = async (req, res) => {
  const { orderId } = req.query || {};
  
  if (!orderId) {
    res.status(400).json({ error: 'Missing orderId parameter' });
    return;
  }

  try {
    // Load orders from local files
    const orders = await loadOrders();
    const order = orders.find(o => 
      String(o.orderId) === String(orderId) || 
      String(o.id) === String(orderId)
    );

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Try to get updated status from Control Hub
    const controlHubStatus = await getControlHubStatus(orderId);
    
    // Merge local order data with Control Hub status
    const orderResponse = {
      ...order,
      // Use Control Hub status if available, otherwise default to 'pending'
      status: controlHubStatus?.status || order.status || 'pending',
      estimatedCompletion: controlHubStatus?.estimatedCompletion || order.estimatedCompletion,
      actualCompletion: controlHubStatus?.actualCompletion || order.actualCompletion,
      notes: controlHubStatus?.notes || order.notes || '',
      // Ensure we have all the fields the frontend expects
      orderId: order.orderId || order.id,
      orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
    };

    res.status(200).json(orderResponse);
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};