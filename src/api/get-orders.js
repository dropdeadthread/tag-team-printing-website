const orders = require('../../data/orders.json');

module.exports = (req, res) => {
  const { email } = req.query || {};
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  const customerOrders = orders.filter(order => order.email === email);
  res.status(200).json(customerOrders);
};