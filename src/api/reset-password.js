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
      const { email, newPassword } = JSON.parse(body);
      if (!email || !newPassword) {
        res.status(400).json({ error: 'Missing email or newPassword' });
        return;
      }
      if (!fs.existsSync(customersPath)) {
        res.status(404).json({ error: 'No customers found' });
        return;
      }
      const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
      const idx = customers.findIndex(c => c.email === email);
      if (idx === -1) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      customers[idx].password = newPassword;
      fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};