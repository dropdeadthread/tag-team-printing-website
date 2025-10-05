// This is a mock endpoint. In production, integrate with an email/SMS service.
const fs = require('fs');
const path = require('path');
const customersPath = path.join(__dirname, '../../data/customers.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { subject, message } = JSON.parse(body);
      if (!subject || !message) {
        res.status(400).json({ error: 'Missing subject or message' });
        return;
      }
      let customers = [];
      if (fs.existsSync(customersPath)) {
        customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
      }
      // In production, send email/SMS to all customers here.
      res.status(200).json({ success: true, recipients: customers.map(c => c.email) });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};