// Fixed version - CommonJS with built-in fetch (Node.js 18+)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends order data to Control Hub after successful order creation.
 *
 * Fixed 2026-09-15: found live -- a real test order submitted during a brief Control Hub
 * backend restart got a real orderId back and a "submitted successfully" message, but the
 * order was never persisted anywhere (this function has no fallback storage of its own),
 * so Track Order could never find it again. Root cause was two-fold: (1) no retry for a
 * transient connection failure during exactly the kind of few-second restart window that's
 * common for this desktop-hosted backend, and (2) even on total failure this always
 * returned overall success to the caller (see handler below) with no way to distinguish a
 * real submission from a silently-lost one. This adds a short retry for transient failures;
 * true failure is now reported honestly (see handler).
 */
async function sendToControlHub(orderData, orderId, attempt = 1) {
  try {
    const CONTROL_HUB_URL =
      process.env.CONTROL_HUB_URL || 'http://localhost:4000';

    // Transform order data to Control Hub format
    const hubOrderData = {
      orderId: orderId,
      source: 'tag-team-website',
      requestType: orderData.requestType === 'quote' ? 'quote' : 'order',
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
        // Fixed 2026-09-16: found live -- Control Hub's Order schema declares
        // printing.inkColors as [String], but this passed through the full
        // {name,value,hex} color objects the form's color picker uses internally.
        // Mongoose's array-of-String cast rejects objects outright, so order.save()
        // threw on every single real submission -- confirmed live via a real quote
        // attempt through the actual form (502, no order ever created) and reproduced
        // directly against the real backend by isolating this one field. Send the
        // plain color name strings the schema (and Control Hub's own downstream ink-
        // color logic, e.g. quoteCalculatorService's .toLowerCase() checks) expects.
        inkColors: (orderData.selectedInkColors || []).map(
          (color) => color?.name || color?.value || color,
        ),
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
    // A connection failure (backend mid-restart, ngrok blip) is exactly the transient case a
    // retry can ride out -- one retry after a short pause, then give up for real.
    if (attempt < 2) {
      console.warn('Control Hub unreachable, retrying once', {
        orderId,
        attempt,
        error: error.message,
      });
      await sleep(2000);
      return sendToControlHub(orderData, orderId, attempt + 1);
    }
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

    // Control Hub is the ONLY place this order is ever persisted -- this function has no
    // fallback storage of its own. Fixed 2026-09-15: this used to always return
    // statusCode 200 / success: true even when hubSuccess was false, with a false claim
    // that the order was "saved locally" -- meaning a customer could see "Order submitted
    // successfully!", get redirected to the confirmation page, and the order would not
    // exist anywhere, ever, with no way for them or us to know. Now a real sync failure
    // (after the retry above) is reported honestly as a failure, so the frontend's existing
    // error-handling path (already tells the customer to try again or contact directly)
    // actually runs instead of the false-success path.
    if (!hubSuccess) {
      console.error(
        'Order could not be persisted anywhere -- Control Hub sync failed after retry',
        {
          orderId,
        },
      );
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message:
            "We couldn't process your submission right now. Please try again in a moment, or contact us directly so we don't miss your order.",
        }),
      };
    }

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        orderId,
        jobId: hubResult.jobId,
        controlHub: 'synced',
        preflightCheck: hubResult.preflightCheck,
        message: 'Order submitted successfully! Job created in Control Hub.',
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
