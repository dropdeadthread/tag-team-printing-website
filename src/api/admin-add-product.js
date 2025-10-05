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
      const product = JSON.parse(body);
      if (!product.styleID || !product.title) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      let products = [];
      if (fs.existsSync(productsPath)) {
        products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      }
      products.push(product);
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};