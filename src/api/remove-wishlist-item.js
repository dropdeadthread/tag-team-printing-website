const fs = require('fs');
const path = require('path');
const wishlistPath = path.join(__dirname, '../../data/wishlist.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { email, styleID } = JSON.parse(body);
      if (!email || !styleID) {
        res.status(400).json({ error: 'Missing email or styleID' });
        return;
      }
      if (!fs.existsSync(wishlistPath)) {
        res.status(404).json({ error: 'Wishlist not found' });
        return;
      }
      let wishlist = JSON.parse(fs.readFileSync(wishlistPath, 'utf8'));
      let userWishlist = wishlist.find(w => w.email === email);
      if (userWishlist) {
        userWishlist.items = userWishlist.items.filter(id => id !== styleID);
        fs.writeFileSync(wishlistPath, JSON.stringify(wishlist, null, 2));
      }
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};