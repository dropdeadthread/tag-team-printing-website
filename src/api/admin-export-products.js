const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../../data/all_styles_raw.json');

module.exports = (req, res) => {
  if (!fs.existsSync(productsPath)) {
    res.status(200).json([]);
    return;
  }
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  res.status(200).json(products);
};