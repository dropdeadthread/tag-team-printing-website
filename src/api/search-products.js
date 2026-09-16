const fs = require('fs');
const path = require('path');

const SELECTED_BRANDS = [
  'Gildan',
  'JERZEES', // Hanes brand
  'BELLA + CANVAS', // Note: uppercase with +
  'Next Level',
  'Hanes', // Also include in case some products use this name
  'Comfort Colors', // Popular premium cotton brand
  'Threadfast Apparel', // Quality basics brand
  'M&O', // Mills & Oliver apparel brand
  // Hat specialist brands for headwear category
  'Richardson',
  'YP Classics',
  'Valucap',
];

const EXCLUDED_BRANDS = ['American Apparel'];

module.exports = async (req, res) => {
  const { q } = req.query || {};
  if (!q) {
    res.status(400).json({ error: 'Missing search query (q)' });
    return;
  }

  try {
    console.log(`search-products API called with query: "${q}"`);

    // FIXED: Use real-time S&S API or fallback to local JSON
    let data;
    const username = process.env.SNS_API_USERNAME;
    const apiKey = process.env.SNS_API_KEY;

    if (!username || !apiKey) {
      console.warn('S&S API credentials not found, using local JSON fallback');
      // Fallback to local JSON file
      const dataPath = path.join(process.cwd(), 'data', 'all_styles_raw.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(rawData);
    } else {
      // Use real-time S&S API. Fixed 2026-09-15: this required('node-fetch'), which threw
      // "fetch is not a function" in production (confirmed live) -- node-fetch is an
      // ESM-only package in the version installed here, so require() doesn't get back a
      // callable function the way it would with a CommonJS module. Every other function in
      // this codebase (get-order.js, streamlined-order.js) already relies on Node 18+'s
      // built-in global fetch with no require at all -- this only ever needed that same
      // built-in, and never actually needed the node-fetch dependency.
      console.log('Fetching search data from real-time S&S API');
      const authHeader =
        'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');

      const response = await fetch(
        'https://api-ca.ssactivewear.com/v2/styles/',
        {
          headers: {
            Authorization: authHeader,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.warn(
          `S&S API error: ${response.status}, falling back to local data`,
        );
        // Fallback to local data if API fails
        const dataPath = path.join(
          process.cwd(),
          'data',
          'all_styles_raw.json',
        );
        const rawData = fs.readFileSync(dataPath, 'utf8');
        data = JSON.parse(rawData);
      } else {
        data = await response.json();
        console.log(
          `Loaded ${data.length} products from live S&S API for search`,
        );
      }
    }

    // Filter by selected brands, exclude unwanted brands, and exclude noeRetailing products
    const brandFiltered = data.filter(
      (item) =>
        SELECTED_BRANDS.includes(item.brandName) &&
        !EXCLUDED_BRANDS.includes(item.brandName) &&
        item.noeRetailing !== true, // Exclude closeout/discontinued items
    );

    console.log(`After brand filtering: ${brandFiltered.length} products`);

    // Search by brand name or product title
    const searchTerm = q.toLowerCase();
    const searchResults = brandFiltered.filter((item) => {
      const brandMatch =
        item.brandName && item.brandName.toLowerCase().includes(searchTerm);
      const titleMatch =
        item.title && item.title.toLowerCase().includes(searchTerm);
      return brandMatch || titleMatch;
    });

    console.log(`Found ${searchResults.length} products matching "${q}"`);

    // Transform results to match expected format
    const results = searchResults.map((item) => ({
      styleID: item.styleID,
      styleCode: item.styleName,
      styleName: item.styleName,
      title: item.title,
      name: item.title,
      description: item.description,
      brand: item.brandName,
      brandName: item.brandName,
      categories: item.categories,
      styleImage: item.styleImage,
      baseCategory: item.baseCategory,
    }));

    console.log(`Returning ${results.length} search results`);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error in search-products API:', err);
    res
      .status(500)
      .json({ error: 'Failed to search products', details: err.message });
  }
};
