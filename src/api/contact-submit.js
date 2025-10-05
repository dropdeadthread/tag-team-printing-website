const fs = require('fs');
const path = require('path');
const contactPath = path.join(__dirname, '../../data/contactMessages.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { name, email, message } = JSON.parse(body);
      if (!name || !email || !message) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }
      let messages = [];
      if (fs.existsSync(contactPath)) {
        messages = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
      }
      messages.push({ name, email, message, date: new Date().toISOString() });
      fs.writeFileSync(contactPath, JSON.stringify(messages, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};