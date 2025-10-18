require('dotenv').config();
const fetch = require('node-fetch');
const username = process.env.SNS_API_USERNAME;
const password = process.env.SNS_API_KEY;
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

module.exports = async (req, res) => {
  try {
    const response = await fetch(
      'https://api-ca.ssactivewear.com/v2/categories/',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
          'User-Agent': 'TagTeamPrinting/1.0',
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.error(`S&S API error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const categories = await response.json();
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch categories', details: err.message });
  }
};
