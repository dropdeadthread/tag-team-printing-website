/**
 * Fixed 2026-09-17: same bug class already found and fixed on Track Order (get-order.js) --
 * this only ever read a local data/orders.json file, which is never populated in Netlify's
 * stateless Functions environment. Every real email lookup on the Customer Dashboard's
 * "Order History" tab silently returned "no orders found," always, for every real customer,
 * regardless of how many real orders they actually had. Now queries Control Hub's real
 * cross-model /api/orders endpoint (the same one Control Hub's own staff "All Orders" page
 * uses) with x-api-key, and maps each result onto the dashboard's status vocabulary the same
 * way get-order.js does for a single order.
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

// Covers both the generic Order model's status enum (submitted/confirmed/in-production/
// completed/shipped) and TagTeamOrder's richer one (adds quote-requested/quoted/
// pre-production/quality-check) -- this list endpoint has no per-order Job populate the way
// GET /orders/:id does, so status comes from the order's own status field only.
const ORDER_STATUS_TO_DASHBOARD_STATUS = {
  submitted: 'pending',
  'quote-requested': 'pending',
  quoted: 'artwork-review',
  confirmed: 'approved',
  'pre-production': 'approved',
  'in-production': 'production',
  'quality-check': 'quality-check',
  completed: 'delivered',
  shipped: 'shipped',
};

const resolveDashboardStatus = (order) => {
  if (
    order.jobCurrentStage &&
    JOB_STAGE_TO_DASHBOARD_STATUS[order.jobCurrentStage]
  ) {
    return JOB_STAGE_TO_DASHBOARD_STATUS[order.jobCurrentStage];
  }
  return ORDER_STATUS_TO_DASHBOARD_STATUS[order.status] || 'pending';
};

const buildDashboardOrder = (order) => ({
  id: order.orderId,
  status: resolveDashboardStatus(order),
  customerName: order.customer?.name || '',
  items: order.garment
    ? [
        {
          name:
            order.garment.title ||
            order.garment.style ||
            order.garment.brand ||
            'Item',
          quantity: order.printing?.quantity || 1,
        },
      ]
    : [],
  total: order.quote?.totalWithTax ?? order.quote?.subtotal ?? 0,
  createdAt: order.createdAt,
  estimatedDelivery: null,
});

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email } = req.query || {};
  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }

  const CONTROL_HUB_URL =
    process.env.CONTROL_HUB_URL || 'http://localhost:4000';
  const CONTROL_HUB_API_KEY = process.env.CONTROL_HUB_API_KEY || '';

  try {
    const response = await fetch(
      `${CONTROL_HUB_URL}/api/orders?search=${encodeURIComponent(email.trim())}&limit=100`,
      { headers: { 'x-api-key': CONTROL_HUB_API_KEY } },
    );

    if (!response.ok) {
      throw new Error(`Control Hub responded with ${response.status}`);
    }

    const data = await response.json();
    const allOrders = Array.isArray(data.orders) ? data.orders : [];

    // This TTP website's Customer Dashboard should only ever show orders placed through
    // Tag Team Printing -- Control Hub's /api/orders merges in DDT's orders too (by design,
    // for its own internal staff view), which would be confusing/wrong context to surface
    // here if a customer happens to share an email across both businesses.
    const ttpOrders = allOrders.filter((o) => o.orderModel !== 'DDTOrder');

    // Exact-match the email -- Control Hub's search is a substring/regex match across
    // multiple fields (orderId, customer.name, customer.email), so confirm the match is
    // really on this email, not an orderId or name that happens to contain it.
    const matchedOrders = ttpOrders.filter(
      (o) =>
        (o.customer?.email || '').toLowerCase() === email.trim().toLowerCase(),
    );

    const orders = matchedOrders
      .map(buildDashboardOrder)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error('Error retrieving customer orders from Control Hub:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch order history. Please try again later.',
    });
  }
};
