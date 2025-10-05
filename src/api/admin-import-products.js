const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../../data/all_styles_raw.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { products } = JSON.parse(body);
      if (!Array.isArray(products)) {
        res.status(400).json({ error: 'Products must be an array' });
        return;
      }
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      res.status(200).json({ success: true, count: products.length });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};