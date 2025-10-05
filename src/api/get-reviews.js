const fs = require('fs');
const path = require('path');
const reviewsPath = path.join(__dirname, '../../data/reviews.json');

module.exports = (req, res) => {
  const { styleID } = req.query || {};
  if (!styleID) {
    res.status(400).json({ error: 'Missing styleID' });
    return;
  }
  if (!fs.existsSync(reviewsPath)) {
    res.status(200).json([]);
    return;
  }
  const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  const productReviews = reviews.filter(r => String(r.styleID) === String(styleID));
  res.status(200).json(productReviews);
};