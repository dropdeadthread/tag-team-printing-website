const fs = require('fs');
const path = require('path');
const customersPath = path.join(__dirname, '../../data/customers.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const customer = JSON.parse(body);
      // Basic validation
      if (!customer.email || !customer.password) {
        res.status(400).json({ error: 'Missing email or password' });
        return;
      }
      // Load existing customers
      let customers = [];
      if (fs.existsSync(customersPath)) {
        customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
      }
      // Check for duplicate email
      if (customers.some(c => c.email === customer.email)) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }
      // Add new customer
      customers.push(customer);
      fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2));
      res.status(200).json({ success: true, customer: { email: customer.email } });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};