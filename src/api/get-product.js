require('dotenv').config();
const allStyles = require('../../data/all_styles_raw.json');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const username = process.env.SNS_API_USERNAME;
const password = process.env.SNS_API_KEY;
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

module.exports = async (req, res) => {
  const { styleID } = req.query || req.body || {};
  
  if (!styleID) {
    res.status(400).json({ error: 'Missing styleID' });
    return;
  }

  try {
    // Try to get from S&S ActiveWear API first
    const url = `https://api-ca.ssactivewear.com/v2/styles/?styleid=${styleID}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json(data[0]);
      return;
    }
    
    // Fallback to local data if API fails or product not found
    const localProduct = allStyles.find(style => style.styleID === styleID);
    if (localProduct) {
      res.status(200).json(localProduct);
      return;
    }
    
    res.status(404).json({ error: 'Product not found' });
  } catch (err) {
    console.error('API Error:', err);
    
    // Fallback to local data on API error
    try {
      const localProduct = allStyles.find(style => style.styleID === styleID);
      if (localProduct) {
        res.status(200).json(localProduct);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (localErr) {
      res.status(500).json({ error: 'Failed to fetch product', details: err.message });
    }
  }
};
