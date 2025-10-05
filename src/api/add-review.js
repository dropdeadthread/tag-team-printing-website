const fs = require('fs');
const path = require('path');
const reviewsPath = path.join(__dirname, '../../data/reviews.json');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const review = JSON.parse(body);
      if (!review.styleID || !review.email || !review.rating || !review.comment) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      let reviews = [];
      if (fs.existsSync(reviewsPath)) {
        reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
      }
      reviews.push({ ...review, date: new Date().toISOString() });
      fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};