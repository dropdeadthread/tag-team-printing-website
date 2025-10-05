// Control Hub Integration Utilities
// Handles all backend communication to your centralized control hub

const CONTROL_HUB_URL = process.env.CONTROL_HUB_URL || 'http://localhost:4000';
const CONTROL_HUB_API_KEY = process.env.CONTROL_HUB_API_KEY || 'dev-secret-key';

/**
 * Send data to Control Hub backend
 * @param {string} endpoint - The Control Hub endpoint (e.g., '/orders', '/contacts')
 * @param {Object} data - Data to send
 * @param {string} method - HTTP method (default: POST)
 * @returns {Promise<Object>} - Control Hub response
 */
async function sendToControlHub(endpoint, data, method = 'POST') {
  try {
    const response = await fetch(`${CONTROL_HUB_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTROL_HUB_API_KEY}`,
        'X-Source': 'tagteam-website'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'website',
        ...data
      })
    });

    if (!response.ok) {
      throw new Error(`Control Hub responded with ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Control Hub communication error:', error);
    
    // Fallback: Still save to local JSON files as backup
    await saveToLocalBackup(endpoint, data);
    
    throw error;
  }
}

/**
 * Send new order to Control Hub
 * This replaces direct email notifications
 */
async function sendOrderToControlHub(orderData) {
  return await sendToControlHub('/api/orders', {
    type: 'new_order',
    order: orderData,
    priority: orderData.totalPrice > 500 ? 'high' : 'normal',
    notifications: {
      email: true,
      sms: orderData.totalPrice > 200,
      slack: true
    }
  });
}

/**
 * Send contact form submission to Control Hub
 * This replaces direct email notifications
 */
async function sendContactToControlHub(contactData) {
  return await sendToControlHub('/api/contacts', {
    type: 'contact_form',
    contact: contactData,
    priority: contactData.projectType === 'urgent' ? 'high' : 'normal',
    notifications: {
      email: true,
      sms: false,
      slack: true
    }
  });
}

/**
 * Send order status update to Control Hub
 * This triggers customer notifications through Control Hub
 */
async function sendOrderStatusToControlHub(orderId, statusData) {
  return await sendToControlHub('/api/orders/status', {
    type: 'status_update',
    orderId: orderId,
    status: statusData,
    notifications: {
      customer_email: true,
      customer_sms: statusData.status === 'completed' || statusData.status === 'shipped',
      internal_slack: true
    }
  });
}

/**
 * Send customer registration to Control Hub
 */
async function sendCustomerToControlHub(customerData) {
  return await sendToControlHub('/api/customers', {
    type: 'new_customer',
    customer: customerData,
    notifications: {
      welcome_email: true,
      internal_slack: false
    }
  });
}

/**
 * Send analytics event to Control Hub
 * For additional business intelligence beyond Google Analytics
 */
async function sendAnalyticsToControlHub(eventData) {
  return await sendToControlHub('/api/analytics', {
    type: 'website_event',
    event: eventData,
    notifications: {
      real_time_dashboard: true
    }
  }, 'POST');
}

/**
 * Get data from Control Hub
 * @param {string} endpoint - The Control Hub endpoint
 * @returns {Promise<Object>} - Control Hub response
 */
async function getFromControlHub(endpoint) {
  try {
    const response = await fetch(`${CONTROL_HUB_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTROL_HUB_API_KEY}`,
        'X-Source': 'tagteam-website'
      }
    });

    if (!response.ok) {
      throw new Error(`Control Hub responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Control Hub fetch error:', error);
    throw error;
  }
}

/**
 * Local backup function - saves to JSON file if Control Hub is unavailable
 * This ensures no data is lost during Control Hub downtime
 */
async function saveToLocalBackup(endpoint, data) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Determine backup file based on endpoint
    let backupFile = 'backup.json';
    if (endpoint.includes('orders')) backupFile = 'orders.json';
    if (endpoint.includes('contacts')) backupFile = 'contactMessages.json';
    if (endpoint.includes('customers')) backupFile = 'customers.json';
    
    const backupPath = path.join(process.cwd(), 'data', backupFile);
    const backupData = {
      ...data,
      _backup: true,
      _backupTimestamp: new Date().toISOString(),
      _needsControlHubSync: true
    };

    // Read existing data
    let existingData = [];
    try {
      const existing = await fs.readFile(backupPath, 'utf8');
      existingData = JSON.parse(existing);
    } catch (e) {
      // File doesn't exist or is empty
    }

    // Add new data
    existingData.push(backupData);
    
    // Write back to file
    await fs.writeFile(backupPath, JSON.stringify(existingData, null, 2));
    
    console.log('✅ Data saved to local backup:', backupFile);
  } catch (error) {
    console.error('❌ Failed to save local backup:', error);
  }
}

/**
 * Health check for Control Hub connection
 */
async function checkControlHubHealth() {
  try {
    const response = await fetch(`${CONTROL_HUB_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTROL_HUB_API_KEY}`
      },
      timeout: 5000 // 5 second timeout
    });
    
    return {
      status: response.ok ? 'healthy' : 'error',
      url: CONTROL_HUB_URL,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'offline',
      error: error.message,
      url: CONTROL_HUB_URL,
      timestamp: new Date().toISOString()
    };
  }
}

// Export all functions for use in API endpoints
module.exports = {
  sendToControlHub,
  sendOrderToControlHub,
  sendContactToControlHub,
  sendOrderStatusToControlHub,
  sendCustomerToControlHub,
  sendAnalyticsToControlHub,
  getFromControlHub,
  checkControlHubHealth,
  saveToLocalBackup
};

// For ES6 imports
export {
  sendToControlHub,
  sendOrderToControlHub,
  sendContactToControlHub,
  sendOrderStatusToControlHub,
  sendCustomerToControlHub,
  sendAnalyticsToControlHub,
  getFromControlHub,
  checkControlHubHealth,
  saveToLocalBackup
};