const fs = require('fs');
const path = require('path');
const customersPath = path.join(__dirname, '../../data/customers.json');

module.exports = (req, res) => {
  const { email } = req.query || {};
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!fs.existsSync(customersPath)) {
    res.status(404).json({ error: 'No customers found' });
    return;
  }
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
  const customer = customers.find(c => c.email === email);
  if (customer) {
    // Never send password back!
    const { password, ...safeCustomer } = customer;
    res.status(200).json(safeCustomer);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
};
