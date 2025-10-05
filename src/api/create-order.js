const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Initialize orders file if it doesn't exist
async function initializeOrdersFile() {
  try {
    await fs.access(ORDERS_FILE);
  } catch (error) {
    // File doesn't exist, create it
    await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

// Save order to JSON database
async function saveOrder(order) {
  try {
    await initializeOrdersFile();
    
    // Read existing orders
    const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(ordersData);
    
    // Add new order with timestamp and ID
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...order
    };
    
    orders.push(newOrder);
    
    // Write back to file
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    
    return newOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

// Send email notifications
async function sendOrderEmails(order) {
  try {
    // Configure email transporter (using environment variables for security)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'info@tagteamprints.com',
        pass: process.env.SMTP_PASS || '' // Use app password for Gmail
      }
    });

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c32b14; color: white; padding: 2rem; text-align: center;">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order with Tag Team Printing!</p>
        </div>
        
        <div style="padding: 2rem; background: #f9f9f9;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customer?.name || order.customerName || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.customer?.email || order.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.customer?.phone || order.phone || 'N/A'}</p>
          
          <h3>Order Summary</h3>
          <p><strong>Items:</strong> ${order.items?.length || 'Custom order'}</p>
          <p><strong>Total:</strong> $${order.total || 'TBD'}</p>
          
          ${order.notes ? `<h3>Notes</h3><p>${order.notes}</p>` : ''}
          
          <div style="background: #fff; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <h3>What's Next?</h3>
            <ol>
              <li>We'll review your order and contact you within 1 business day</li>
              <li>If artwork is needed, we'll send you a digital proof for approval</li>
              <li>Production begins once artwork is approved and payment is received</li>
              <li>We'll keep you updated on your order status</li>
            </ol>
          </div>
          
          <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <h3>Track Your Order</h3>
            <p>You can track your order status anytime at:</p>
            <p><a href="${process.env.SITE_URL || 'https://tagteamprints.com'}/customer-dashboard" style="color: #c32b14;">Customer Dashboard</a></p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 2rem; text-align: center;">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:info@tagteamprints.com" style="color: #fff;">info@tagteamprints.com</a></p>
          <p>Phone: <a href="tel:+16133634997" style="color: #fff;">(613) 363-4997</a></p>
          <p>Address: 1014 First St East, Cornwall, ON K6H 1N4</p>
          <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>
      </div>
    `;

    // Internal notification email
    const internalEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c32b14; color: white; padding: 1.5rem; text-align: center;">
          <h1>🚨 New Order Received</h1>
          <p>Order ID: ${order.id}</p>
        </div>
        
        <div style="padding: 2rem; background: #f9f9f9;">
          <h2>Customer Details</h2>
          <p><strong>Name:</strong> ${order.customer?.name || order.customerName || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.customer?.email || order.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.customer?.phone || order.phone || 'N/A'}</p>
          
          <h2>Order Information</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Timestamp:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Items:</strong> ${order.items?.length || 'Custom order'}</p>
          <p><strong>Total:</strong> $${order.total || 'TBD'}</p>
          
          ${order.notes ? `<h2>Customer Notes</h2><p style="background: #fff; padding: 1rem; border-radius: 4px;">${order.notes}</p>` : ''}
          
          <h2>Raw Order Data</h2>
          <pre style="background: #fff; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 12px;">
${JSON.stringify(order, null, 2)}
          </pre>
          
          <div style="background: #fff; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; text-align: center;">
            <h3>Action Required</h3>
            <p>Please review this order and contact the customer within 1 business day.</p>
            <p><strong>Customer Contact:</strong> ${order.customer?.email || order.email} | ${order.customer?.phone || order.phone || 'No phone'}</p>
          </div>
        </div>
      </div>
    `;

    // Send customer confirmation
    await transporter.sendMail({
      from: `"Tag Team Printing" <${process.env.SMTP_USER || 'info@tagteamprints.com'}>`,
      to: order.customer?.email || order.email,
      subject: `Order Confirmation - ${order.id} - Tag Team Printing`,
      html: customerEmailHtml
    });

    // Send internal notification
    await transporter.sendMail({
      from: `"Tag Team Website" <${process.env.SMTP_USER || 'info@tagteamprints.com'}>`,
      to: process.env.INTERNAL_EMAIL || 'info@tagteamprints.com',
      subject: `🚨 New Order: ${order.id} - ${order.customer?.name || order.customerName}`,
      html: internalEmailHtml
    });

    console.log('✅ Order emails sent successfully');
    return true;

  } catch (error) {
    console.error('❌ Error sending order emails:', error);
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  
  req.on('end', async () => {
    try {
      const orderData = JSON.parse(body);
      
      // Validate required fields
      if (!orderData.customer?.email && !orderData.email) {
        return res.status(400).json({ error: 'Customer email is required' });
      }
      
      // Save order to database
      const savedOrder = await saveOrder(orderData);
      console.log('✅ Order saved:', savedOrder.id);
      
      // Send email notifications
      const emailsSent = await sendOrderEmails(savedOrder);
      
      // Respond with success
      res.status(200).json({ 
        success: true, 
        order: savedOrder,
        notifications: {
          emailsSent: emailsSent
        }
      });
      
    } catch (error) {
      console.error('❌ Error processing order:', error);
      res.status(500).json({ 
        error: 'Failed to process order',
        details: error.message 
      });
    }
  });
};