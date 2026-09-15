const { promises: fs } = require('fs');
const path = require('path');

/**
 * Fetch the real order from Control Hub — the actual source of truth for every order
 * this site creates (streamlined-order.js sends every order/quote here on submission;
 * nothing in production writes to the local JSON files this function used to check first).
 *
 * Fixed 2026-09-15: this used to look up local orders.json/streamlined-orders.json files
 * FIRST and return 404 immediately if not found there, before ever attempting Control Hub
 * -- meaning even a real order that genuinely existed in Control Hub always came back
 * "Order not found," since those local files are never populated in Netlify's stateless
 * Functions environment. Control Hub is now the primary (only) lookup; the old endpoint
 * this called (/api/orders/:id/status) didn't even exist -- the real route is
 * /api/orders/:id, and it needs an x-api-key header (no staff JWT exists for a customer's
 * browser to present), not a Bearer token.
 */
const getOrderFromControlHub = async (orderId) => {
  const CONTROL_HUB_URL =
    process.env.CONTROL_HUB_URL || 'http://localhost:4000';
  const CONTROL_HUB_API_KEY = process.env.CONTROL_HUB_API_KEY || '';

  const response = await fetch(
    `${CONTROL_HUB_URL}/api/orders/${encodeURIComponent(orderId)}`,
    {
      headers: { 'x-api-key': CONTROL_HUB_API_KEY },
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Control Hub responded with ${response.status}`);
  }

  return response.json(); // { order, job }
};

/**
 * The Customer Dashboard (customer-dashboard.jsx) renders progress against its own fixed
 * step vocabulary: pending -> artwork-review -> approved -> production -> quality-check ->
 * shipped -> delivered. Neither Control Hub model speaks that vocabulary natively --
 * Job.currentStage is a fine-grained production enum (prepress, screen-cleaning,
 * screen-coating, ..., printing, curing, quality-check, packaging, shipping) and
 * Order.status is coarse (submitted, confirmed, in-production, completed, shipped) -- so
 * this maps whichever is available onto the dashboard's steps.
 */
const JOB_STAGE_TO_DASHBOARD_STATUS = {
  prepress: 'approved',
  'screen-cleaning': 'production',
  'screen-drying': 'production',
  'screen-coating': 'production',
  'emulsion-drying': 'production',
  'screen-exposure': 'production',
  'screen-washout': 'production',
  'screens-ready': 'production',
  'press-setup': 'production',
  printing: 'production',
  curing: 'production',
  'quality-check': 'quality-check',
  packaging: 'quality-check',
  shipping: 'shipped',
};

const resolveDashboardStatus = (order, job) => {
  if (job?.currentStage && JOB_STAGE_TO_DASHBOARD_STATUS[job.currentStage]) {
    return JOB_STAGE_TO_DASHBOARD_STATUS[job.currentStage];
  }

  switch (order?.status) {
    case 'submitted':
      return 'pending';
    case 'confirmed':
      if (order.workflow?.proofApproved) return 'approved';
      if (order.workflow?.proofSent) return 'artwork-review';
      return 'pending';
    case 'in-production':
      return 'production';
    case 'shipped':
      return 'shipped';
    case 'completed':
      return 'delivered';
    default:
      return 'pending';
  }
};

/**
 * Legacy local-file fallback — kept only for any pre-migration orders that might still be
 * sitting in these files from before Control Hub sync existed. Checked AFTER Control Hub,
 * not before, since Control Hub is the real, current source of truth.
 */
const loadLegacyLocalOrder = async (orderId) => {
  try {
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const streamlinedOrdersPath = path.join(
      process.cwd(),
      'data',
      'streamlined-orders.json',
    );

    let orders = [];
    try {
      orders = orders.concat(JSON.parse(await fs.readFile(ordersPath, 'utf8')));
    } catch (err) {
      // No local orders.json — expected in production, not an error.
    }
    try {
      orders = orders.concat(
        JSON.parse(await fs.readFile(streamlinedOrdersPath, 'utf8')),
      );
    } catch (err) {
      // No local streamlined-orders.json — expected in production, not an error.
    }

    return (
      orders.find(
        (o) =>
          String(o.orderId) === String(orderId) ||
          String(o.id) === String(orderId),
      ) || null
    );
  } catch (error) {
    console.error('Error loading legacy local orders:', error);
    return null;
  }
};

module.exports = async (req, res) => {
  const { orderId } = req.query || {};

  if (!orderId) {
    res.status(400).json({ error: 'Missing orderId parameter' });
    return;
  }

  try {
    let hubResult = null;
    try {
      hubResult = await getOrderFromControlHub(orderId);
    } catch (error) {
      console.error(
        'Control Hub lookup failed, falling back to legacy local data:',
        error,
      );
    }

    if (hubResult?.order) {
      const { order, job } = hubResult;
      res.status(200).json({
        orderId: order.orderId,
        status: resolveDashboardStatus(order, job),
        estimatedCompletion: job?.dueDate || null,
        actualCompletion:
          order.workflow?.shipped || order.workflow?.productionComplete || null,
        notes: job?.notes || '',
        orderDate: order.createdAt,
        customer: order.customer,
        garment: order.garment,
        printing: order.printing,
        quote: order.quote,
      });
      return;
    }

    const legacyOrder = await loadLegacyLocalOrder(orderId);
    if (!legacyOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({
      ...legacyOrder,
      orderId: legacyOrder.orderId || legacyOrder.id,
      orderDate:
        legacyOrder.orderDate ||
        legacyOrder.createdAt ||
        new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
