const fs = require('fs');
const path = require('path');
const newsletterPath = path.join(__dirname, '../../data/newsletter.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { email } = JSON.parse(body);
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        return;
      }
      let subscribers = [];
      if (fs.existsSync(newsletterPath)) {
        subscribers = JSON.parse(fs.readFileSync(newsletterPath, 'utf8'));
      }
      if (subscribers.includes(email)) {
        res.status(409).json({ error: 'Already subscribed' });
        return;
      }
      subscribers.push(email);
      fs.writeFileSync(newsletterPath, JSON.stringify(subscribers, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};