const fs = require('fs');
const path = require('path');
const customersPath = path.join(__dirname, '../../data/customers.json');

module.exports = (req, res) => {
  if (!fs.existsSync(customersPath)) {
    res.status(200).json([]);
    return;
  }
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
  // Never send passwords!
  const safeCustomers = customers.map(({ password, ...rest }) => rest);
  res.status(200).json(safeCustomers);
};