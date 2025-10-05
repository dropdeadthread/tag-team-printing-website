const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Send order status update email
async function sendStatusUpdateEmail(order, oldStatus, newStatus) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'info@tagteamprints.com',
        pass: process.env.SMTP_PASS || ''
      }
    });

    // Status-specific messages
    const statusMessages = {
      'pending': 'We\'ve received your order and are reviewing the details.',
      'artwork-review': 'We\'re creating your artwork and will send you a proof for approval soon.',
      'approved': 'Your artwork has been approved and your order is ready for production!',
      'in-production': 'Great news! Your order is currently being printed.',
      'completed': 'Your order has been completed and is ready for pickup or shipping.',
      'shipped': 'Your order is on its way! You should receive tracking information shortly.',
      'delivered': 'Your order has been delivered. We hope you love it!',
      'cancelled': 'Your order has been cancelled. If you have questions, please contact us.'
    };

    const statusEmojis = {
      'pending': '⏳',
      'artwork-review': '🎨',
      'approved': '✅',
      'in-production': '🖨️',
      'completed': '🎉',
      'shipped': '📦',
      'delivered': '🏠',
      'cancelled': '❌'
    };

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c32b14; color: white; padding: 2rem; text-align: center;">
          <h1>${statusEmojis[newStatus]} Order Status Update</h1>
          <p>Your order status has been updated!</p>
        </div>
        
        <div style="padding: 2rem; background: #f9f9f9;">
          <div style="background: #fff; padding: 2rem; border-radius: 8px; border-left: 4px solid #c32b14;">
            <h2>Order ${order.id}</h2>
            <p><strong>Status:</strong> <span style="color: #c32b14; font-weight: bold; text-transform: capitalize;">${newStatus.replace('-', ' ')}</span></p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <p style="margin: 0; font-size: 16px;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          </div>
          
          ${newStatus === 'shipped' ? `
          <div style="background: #f0f8e8; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <h3>📦 Tracking Information</h3>
            <p>Your order is on its way! If tracking information is available, it will be sent in a separate email.</p>
          </div>
          ` : ''}
          
          ${newStatus === 'artwork-review' ? `
          <div style="background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <h3>🎨 Artwork Approval Process</h3>
            <p>We're working on your design and will send you a digital proof for approval. Please check your email regularly and respond promptly to keep your order on schedule.</p>
          </div>
          ` : ''}
          
          <div style="background: #fff; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; text-align: center;">
            <h3>Track Your Order</h3>
            <p>For the latest updates, visit your customer dashboard:</p>
            <a href="${process.env.SITE_URL || 'https://tagteamprints.com'}/customer-dashboard" 
               style="background: #c32b14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              View Order Status
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 2rem; text-align: center;">
          <h3>Questions?</h3>
          <p>Contact us anytime:</p>
          <p>Email: <a href="mailto:info@tagteamprints.com" style="color: #fff;">info@tagteamprints.com</a></p>
          <p>Phone: <a href="tel:+16133634997" style="color: #fff;">(613) 363-4997</a></p>
          <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Tag Team Printing" <${process.env.SMTP_USER || 'info@tagteamprints.com'}>`,
      to: order.customer?.email || order.email,
      subject: `Order Update: ${order.id} - ${newStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      html: customerEmailHtml
    });

    console.log('✅ Status update email sent successfully');
    return true;

  } catch (error) {
    console.error('❌ Error sending status update email:', error);
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
      const { orderId, newStatus, notes, trackingNumber } = JSON.parse(body);
      
      // Validate required fields
      if (!orderId || !newStatus) {
        return res.status(400).json({ error: 'Order ID and new status are required' });
      }
      
      // Read existing orders
      const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
      const orders = JSON.parse(ordersData);
      
      // Find the order
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = orders[orderIndex];
      const oldStatus = order.status;
      
      // Update order status
      orders[orderIndex] = {
        ...order,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            notes: notes || null
          }
        ],
        ...(trackingNumber && { trackingNumber })
      };
      
      // Save updated orders
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
      
      // Send status update email
      const emailSent = await sendStatusUpdateEmail(orders[orderIndex], oldStatus, newStatus);
      
      console.log(`✅ Order status updated: ${orderId} (${oldStatus} → ${newStatus})`);
      
      res.status(200).json({
        success: true,
        order: orders[orderIndex],
        notifications: {
          emailSent: emailSent
        }
      });
      
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      res.status(500).json({
        error: 'Failed to update order status',
        details: error.message
      });
    }
  });
};