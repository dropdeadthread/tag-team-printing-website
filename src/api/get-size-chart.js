const sizeCharts = require('../../data/sizeCharts.json');

module.exports = (req, res) => {
  const { styleID } = req.query || {};
  if (!styleID) {
    res.status(400).json({ error: 'Missing styleID' });
    return;
  }
  const chart = sizeCharts.find(chart => String(chart.styleID) === String(styleID));
  if (chart) {
    res.status(200).json(chart);
  } else {
    res.status(404).json({ error: 'Size chart not found' });
  }
};