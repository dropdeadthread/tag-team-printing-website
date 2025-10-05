const fs = require('fs');
const path = require('path');
const cartsPath = path.join(__dirname, '../../data/carts.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { email, cart } = JSON.parse(body);
      if (!email || !cart) {
        res.status(400).json({ error: 'Missing email or cart' });
        return;
      }
      let carts = [];
      if (fs.existsSync(cartsPath)) {
        carts = JSON.parse(fs.readFileSync(cartsPath, 'utf8'));
      }
      let userCart = carts.find(c => c.email === email);
      if (!userCart) {
        userCart = { email, cart: [] };
        carts.push(userCart);
      }
      userCart.cart = cart;
      fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};