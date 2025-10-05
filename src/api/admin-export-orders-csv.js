const fs = require('fs');
const path = require('path');
const ordersPath = path.join(__dirname, '../../data/orders.json');

module.exports = (req, res) => {
  if (!fs.existsSync(ordersPath)) {
    res.status(200).send('id,email,items,status\n');
    return;
  }
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  const csv = [
    'id,email,items,status',
    ...orders.map(o =>
      [o.id, o.email, JSON.stringify(o.items), o.status].join(',')
    )
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(csv);
};