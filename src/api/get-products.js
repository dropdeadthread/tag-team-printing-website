require('dotenv').config();
const path = require('path');
const allStyles = require('../../data/all_styles_raw.json');
const fetch = require('node-fetch');
const username = process.env.SNS_API_USERNAME;
const password = process.env.SNS_API_KEY;
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

module.exports = async (req, res) => {
  const { slug, styleID, partNumber } = req.query || req.body || {};
  if (!slug && !styleID && !partNumber) {
    res.status(400).json({ error: 'Missing identifier' });
    return;
  }
  let url = '';
  if (styleID) {
    url = `https://api-ca.ssactivewear.com/v2/styles/?styleid=${styleID}`;
  } else if (partNumber) {
    url = `https://api-ca.ssactivewear.com/v2/styles/?partnumber=${partNumber}`;
  } else {
    url = `https://api-ca.ssactivewear.com/v2/styles?search=${encodeURIComponent(slug)}`;
  }
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'TagTeamPrinting/1.0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`S&S API error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json(data[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch product', details: err.message });
  }
};
