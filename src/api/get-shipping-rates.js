module.exports = (req, res) => {
  const { postalCode, country } = req.query || {};
  if (!postalCode || !country) {
    res.status(400).json({ error: 'Missing postalCode or country' });
    return;
  }
  // Mock rates
  const rates = [
    { service: 'Standard', cost: 10.00, estimatedDays: 5 },
    { service: 'Express', cost: 25.00, estimatedDays: 2 }
  ];
  res.status(200).json(rates);
};