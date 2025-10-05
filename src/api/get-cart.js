const fs = require('fs');
const path = require('path');
const cartsPath = path.join(__dirname, '../../data/carts.json');

module.exports = (req, res) => {
  const { email } = req.query || {};
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!fs.existsSync(cartsPath)) {
    res.status(200).json([]);
    return;
  }
  const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf8'));
  const userCart = carts.find(c => c.email === email);
  res.status(200).json(userCart ? userCart.cart : []);
};