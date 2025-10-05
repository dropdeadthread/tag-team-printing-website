const fs = require('fs');
const path = require('path');
const wishlistPath = path.join(__dirname, '../../data/wishlist.json');

module.exports = (req, res) => {
  const { email } = req.query || {};
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!fs.existsSync(wishlistPath)) {
    res.status(200).json([]);
    return;
  }
  const wishlist = JSON.parse(fs.readFileSync(wishlistPath, 'utf8'));
  const userWishlist = wishlist.find(w => w.email === email);
  res.status(200).json(userWishlist ? userWishlist.items : []);
};