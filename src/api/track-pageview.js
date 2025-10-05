const fs = require('fs');
const path = require('path');
const analyticsPath = path.join(__dirname, '../../data/analytics.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { page, user } = JSON.parse(body);
      if (!page) {
        res.status(400).json({ error: 'Missing page' });
        return;
      }
      let analytics = [];
      if (fs.existsSync(analyticsPath)) {
        analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
      }
      analytics.push({ page, user, date: new Date().toISOString() });
      fs.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};