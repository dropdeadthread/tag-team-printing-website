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

/**
 * Sends order data to Control Hub after successful order creation
 * @param {Object} orderData - The complete order object from your website
 * @param {string} orderId - The generated order ID
 * @returns {Promise<boolean>} - Success status
 */
async function sendToControlHub(orderData, orderId) {
  try {
    // Your Control Hub URL (update this with your actual server URL)
    const CONTROL_HUB_URL =
      process.env.CONTROL_HUB_URL || 'http://localhost:4000';

    // Transform your order data to Control Hub format
    const hubOrderData = {
      orderId: orderId,
      source: 'tag-team-website',
      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone || '',
        notes: orderData.customer.notes || '',
      },
      garment: {
        brand: orderData.garment.brand,
        style: orderData.garment.styleName,
        title: orderData.garment.title,
        color: orderData.color,
        wholesalePrice: orderData.garment.wholesalePrice,
      },
      printing: {
        quantity: orderData.quantity,
        colors: orderData.printColors,
        locations: orderData.printLocations || [orderData.printLocation],
        underbase: orderData.quote?.needsUnderbase || false,
        inkColors: orderData.selectedInkColors || [],
        addOns: {
          rushOrder: orderData.addOns?.rushOrder || null,
          premiumUpgrade: orderData.addOns?.premiumUpgrade || false,
          extraLocations: orderData.addOns?.extraLocations || {},
        },
      },
      quote: {
        garmentCost: orderData.quote?.garmentCostPerShirt || 0,
        printingTotal: orderData.quote?.printingTotal || 0,
        setupTotal: orderData.quote?.setupTotal || 0,
        subtotal: orderData.quote?.subtotal || 0,
        totalWithTax: orderData.quote?.totalWithTax || 0,
        pricePerShirt: orderData.quote?.pricePerShirt || 0,
        screenBreakdown: orderData.quote?.screenBreakdown || '',
      },
      files: (orderData.uploadedFiles || []).map((file) => ({
        filename: file.name,
        type: 'artwork',
        driveId: file.id || null,
      })),
    };

    // Send to Control Hub
    const response = await fetch(`${CONTROL_HUB_URL}/api/webhooks/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTROL_HUB_SECRET || ''}`, // Optional auth
      },
      body: JSON.stringify(hubOrderData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Order sent to Control Hub', {
        orderId,
        jobId: result.jobId,
      });
      return result;
    } else {
      console.error('❌ Failed to send order to Control Hub', {
        orderId,
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending order to Control Hub', {
      orderId,
      error: error.message,
    });
    return false;
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
    if (
      !orderData.customer?.name ||
      !orderData.customer?.email ||
      !orderData.quantity ||
      !orderData.garment
    ) {
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
        wholesalePrice: orderData.garment.wholesalePrice,
      },
      printing: {
        quantity: orderData.quantity,
        colors: orderData.printColors,
        locations: orderData.printLocations,
        underbase: orderData.quote?.needsUnderbase || false,
        addOns: orderData.addOns,
      },
      quote: {
        garmentCost: orderData.quote?.garmentCostPerShirt || 0,
        printingTotal: orderData.quote?.printingTotal || 0,
        setupTotal: orderData.quote?.setupTotal || 0,
        subtotal: orderData.quote?.subtotal || 0,
        totalWithTax: orderData.quote?.totalWithTax || 0,
        pricePerShirt: orderData.quote?.totalWithTax
          ? (
              parseFloat(orderData.quote.totalWithTax) / orderData.quantity
            ).toFixed(2)
          : 0,
        screenBreakdown: orderData.quote?.screenBreakdown || '',
      },
      notes: orderData.customer?.notes || '',
      rushOrder: orderData.addOns?.rushOrder || false,
      premiumUpgrade: orderData.addOns?.premiumUpgrade || false,
    };

    // Read existing orders
    const ordersData = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(ordersData);

    // Add new order
    orders.push(order);

    // Save updated orders
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // 🎯 NEW: Send to Control Hub
    const hubResult = await sendToControlHub(orderData, orderId);
    const hubSuccess = !!hubResult;

    // Send email notification (you would integrate with your email service here)
    const emailSubject = `New Streamlined Order: ${orderId}${hubSuccess ? ' [Synced to Hub]' : ''}`;
    const emailBody = `
New streamlined order received:

ORDER ID: ${orderId}
${hubSuccess ? `JOB ID: ${hubResult.jobId}` : 'STATUS: Local only (Hub sync failed)'}
CUSTOMER: ${order.customer.name} (${order.customer.email})
GARMENT: ${order.garment.brand} ${order.garment.style} - ${order.garment.color}
QUANTITY: ${order.printing.quantity}
PRINT: ${order.printing.colors} color(s), ${order.printing.locations} location(s)
TOTAL: $${order.quote.totalWithTax} ($${order.quote.pricePerShirt}/shirt)

${order.rushOrder ? '⚡ RUSH ORDER (+25%)' : ''}
${order.premiumUpgrade ? '⭐ PREMIUM UPGRADE' : ''}
${
  hubSuccess && hubResult.preflightCheck
    ? `
📋 PREFLIGHT CHECK:
   Status: ${hubResult.preflightCheck.status}
   Score: ${hubResult.preflightCheck.score}/100
   Priority: ${hubResult.preflightCheck.priority || 'normal'}
   Issues Found: ${hubResult.preflightCheck.issuesFound}
`
    : ''
}

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
      jobId: hubSuccess ? hubResult.jobId : null,
      controlHub: hubSuccess ? 'synced' : 'failed',
      preflightCheck: hubSuccess ? hubResult.preflightCheck : null,
      message: `Order submitted successfully!${hubSuccess ? ' Job created in Control Hub.' : ''}`,
    });
  } catch (error) {
    console.error('Error processing streamlined order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
}

// Export the helper function for use in other parts of your site
export { sendToControlHub };
