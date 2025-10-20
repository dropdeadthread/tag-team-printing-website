// Fixed version - CommonJS with built-in fetch (Node.js 18+)

/**
 * Sends order data to Control Hub after successful order creation
 */
async function sendToControlHub(orderData, orderId) {
  try {
    const CONTROL_HUB_URL =
      process.env.CONTROL_HUB_URL || 'http://localhost:4000';

    // Transform order data to Control Hub format
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

    // Send to Control Hub with CORRECT API key header
    const response = await fetch(`${CONTROL_HUB_URL}/api/webhooks/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CONTROL_HUB_API_KEY || '', // ✅ CORRECT header name
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

// Netlify Function Handler - Using CommonJS exports
exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body (Netlify already does this for us)
    const orderData = JSON.parse(event.body);

    // Validate required fields
    if (
      !orderData.customer?.name ||
      !orderData.customer?.email ||
      !orderData.quantity ||
      !orderData.garment
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
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

    // Send to Control Hub (this is the primary storage mechanism)
    const hubResult = await sendToControlHub(orderData, orderId);
    const hubSuccess = !!hubResult;

    // Log the order details
    console.log('✅ New streamlined order:', {
      orderId,
      customer: order.customer.name,
      email: order.customer.email,
      total: order.quote.totalWithTax,
      hubSync: hubSuccess,
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        orderId,
        jobId: hubSuccess ? hubResult.jobId : null,
        controlHub: hubSuccess ? 'synced' : 'failed',
        preflightCheck: hubSuccess ? hubResult.preflightCheck : null,
        message: `Order submitted successfully!${hubSuccess ? ' Job created in Control Hub.' : ' Order saved locally, Control Hub sync pending.'}`,
      }),
    };
  } catch (error) {
    console.error('❌ Error processing streamlined order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error. Please try again.',
      }),
    };
  }
};
