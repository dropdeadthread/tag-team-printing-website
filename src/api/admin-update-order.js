const fs = require('fs');
const path = require('path');
const ordersPath = path.join(__dirname, '../../data/orders.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { orderId, status } = JSON.parse(body);
      if (!orderId || !status) {
        res.status(400).json({ error: 'Missing orderId or status' });
        return;
      }
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
      const idx = orders.findIndex(o => String(o.id) === String(orderId));
      if (idx === -1) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      orders[idx].status = status;
      fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
      res.status(200).json({ success: true, order: orders[idx] });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};