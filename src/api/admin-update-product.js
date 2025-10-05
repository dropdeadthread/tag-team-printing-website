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
      const { styleID, ...updates } = JSON.parse(body);
      if (!styleID) {
        res.status(400).json({ error: 'Missing styleID' });
        return;
      }
      if (!fs.existsSync(productsPath)) {
        res.status(404).json({ error: 'No products found' });
        return;
      }
      let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      const idx = products.findIndex(p => String(p.styleID) === String(styleID));
      if (idx === -1) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      products[idx] = { ...products[idx], ...updates };
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      res.status(200).json({ success: true, product: products[idx] });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};