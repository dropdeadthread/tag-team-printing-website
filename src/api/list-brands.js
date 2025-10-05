require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const username = process.env.SNS_API_USERNAME;
const password = process.env.SNS_API_KEY;
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

console.log('USERNAME:', process.env.SNS_API_USERNAME);
console.log('API KEY:', process.env.SNS_API_KEY);
console.log('BASIC AUTH:', basicAuth);

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://api-ca.ssactivewear.com/v2/Brands/', {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`
      },
    });
    const brands = await response.json();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands', details: err.message });
  }
};