const fs = require('fs');
const path = require('path');
const auditPath = path.join(__dirname, '../../data/audit.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    if (!fs.existsSync(auditPath)) {
      res.status(200).json([]);
      return;
    }
    const logs = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    res.status(200).json(logs);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { action, user, details } = JSON.parse(body);
        if (!action || !user) {
          res.status(400).json({ error: 'Missing fields' });
          return;
        }
        let logs = [];
        if (fs.existsSync(auditPath)) {
          logs = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
        }
        logs.push({ action, user, details, date: new Date().toISOString() });
        fs.writeFileSync(auditPath, JSON.stringify(logs, null, 2));
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};