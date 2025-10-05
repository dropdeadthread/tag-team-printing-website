import { promises as fs } from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'streamlined-orders.json');

// Initialize orders file if it doesn't exist
async function initializeOrdersFile() {
  try {
    await fs.access(ORDERS_FILE);
  } catch (error) {
    // File doesn't exist, create it
    await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await initializeOrdersFile();
    
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customer?.name || !orderData.customer?.email || !orderData.quantity || !orderData.garment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Generate order ID
    const orderId = `SO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create complete order record
    const order = {
      id: orderId,
      type: 'streamlined',
      timestamp: new Date().toISOString(),
      status: 'submitted',
      customer: orderData.customer,
      garment: {
        brand: orderData.garment.brand,
        style: orderData.garment.styleName,
        title: orderData.garment.title,
        color: orderData.color,
        wholesalePrice: orderData.garment.wholesalePrice
      },
      printing: {
        quantity: orderData.quantity,
        colors: orderData.printColors,
        locations: orderData.printLocations,
        underbase: orderData.quote?.needsUnderbase || false,
        addOns: orderData.addOns
      },
      quote: {
        garmentCost: orderData.quote?.garmentCostPerShirt || 0,
        printingTotal: orderData.quote?.printingTotal || 0,
        setupTotal: orderData.quote?.setupTotal || 0,
        subtotal: orderData.quote?.subtotal || 0,
        totalWithTax: orderData.quote?.totalWithTax || 0,
        pricePerShirt: orderData.quote?.totalWithTax ? 
          (parseFloat(orderData.quote.totalWithTax) / orderData.quantity).toFixed(2) : 0,
        screenBreakdown: orderData.quote?.screenBreakdown || ''
      },
      notes: orderData.customer?.notes || '',
      rushOrder: orderData.addOns?.rushOrder || false,
      premiumUpgrade: orderData.addOns?.premiumUpgrade || false
    };
    
    // Read existing orders
    const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(ordersData);
    
    // Add new order
    orders.push(order);
    
    // Save updated orders
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    
    // Send email notification (you would integrate with your email service here)
    const emailSubject = `New Streamlined Order: ${orderId}`;
    const emailBody = `
New streamlined order received:

ORDER ID: ${orderId}
CUSTOMER: ${order.customer.name} (${order.customer.email})
GARMENT: ${order.garment.brand} ${order.garment.style} - ${order.garment.color}
QUANTITY: ${order.printing.quantity}
PRINT: ${order.printing.colors} color(s), ${order.printing.locations} location(s)
TOTAL: $${order.quote.totalWithTax} ($${order.quote.pricePerShirt}/shirt)

${order.rushOrder ? '⚡ RUSH ORDER (+25%)' : ''}
${order.premiumUpgrade ? '⭐ PREMIUM UPGRADE' : ''}

SETUP: ${order.quote.screenBreakdown}
NOTES: ${order.notes}

---
Contact customer at ${order.customer.email}${order.customer.phone ? ` or ${order.customer.phone}` : ''} to confirm details.
    `;
    
    console.log('New streamlined order:', emailSubject);
    console.log(emailBody);
    
    res.status(200).json({ 
      success: true, 
      orderId,
      message: 'Order submitted successfully!' 
    });
    
  } catch (error) {
    console.error('Error processing streamlined order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again.' 
    });
  }
}
