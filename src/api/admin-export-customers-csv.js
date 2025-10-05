const fs = require('fs');
const path = require('path');
const customersPath = path.join(__dirname, '../../data/customers.json');

module.exports = (req, res) => {
  if (!fs.existsSync(customersPath)) {
    res.status(200).send('email,name\n');
    return;
  }
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
  const csv = [
    'email,name',
    ...customers.map(c =>
      [c.email, c.name || ''].join(',')
    )
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(csv);
};