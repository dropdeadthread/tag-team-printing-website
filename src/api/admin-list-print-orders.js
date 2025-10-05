const fs = require('fs');
const path = require('path');
const ordersPath = path.join(__dirname, '../../data/printOrders.json');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!fs.existsSync(ordersPath)) {
    res.status(200).json([]);
    return;
  }
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  res.status(200).json(orders);
};