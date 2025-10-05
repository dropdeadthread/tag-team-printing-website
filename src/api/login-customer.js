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
      const { email, password } = JSON.parse(body);
      if (!email || !password) {
        res.status(400).json({ error: 'Missing email or password' });
        return;
      }
      if (!fs.existsSync(customersPath)) {
        res.status(404).json({ error: 'No customers found' });
        return;
      }
      const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
      const customer = customers.find(c => c.email === email && c.password === password);
      if (customer) {
        res.status(200).json({ success: true, customer: { email: customer.email } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};