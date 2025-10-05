const fs = require('fs');
const path = require('path');
const discountsPath = path.join(__dirname, '../../data/discounts.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    // List all codes or validate a code
    const { code } = req.query || {};
    if (!fs.existsSync(discountsPath)) {
      res.status(200).json([]);
      return;
    }
    const codes = JSON.parse(fs.readFileSync(discountsPath, 'utf8'));
    if (code) {
      const found = codes.find(d => d.code === code);
      if (found) {
        res.status(200).json(found);
      } else {
        res.status(404).json({ error: 'Code not found' });
      }
    } else {
      res.status(200).json(codes);
    }
  } else if (req.method === 'POST') {
    // Add a new code
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { code, amount, type, expires } = JSON.parse(body);
        if (!code || !amount || !type) {
          res.status(400).json({ error: 'Missing fields' });
          return;
        }
        let codes = [];
        if (fs.existsSync(discountsPath)) {
          codes = JSON.parse(fs.readFileSync(discountsPath, 'utf8'));
        }
        codes.push({ code, amount, type, expires });
        fs.writeFileSync(discountsPath, JSON.stringify(codes, null, 2));
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};