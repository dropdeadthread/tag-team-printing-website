const fs = require('fs');
const path = require('path');
const rolesPath = path.join(__dirname, '../../data/userRoles.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    if (!fs.existsSync(rolesPath)) {
      res.status(200).json([]);
      return;
    }
    const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
    res.status(200).json(roles);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, role } = JSON.parse(body);
        if (!email || !role) {
          res.status(400).json({ error: 'Missing fields' });
          return;
        }
        let roles = [];
        if (fs.existsSync(rolesPath)) {
          roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
        }
        const idx = roles.findIndex(r => r.email === email);
        if (idx === -1) {
          roles.push({ email, role });
        } else {
          roles[idx].role = role;
        }
        fs.writeFileSync(rolesPath, JSON.stringify(roles, null, 2));
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};