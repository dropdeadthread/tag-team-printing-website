// Ensure fetch is available (Node 18+ has it built-in, Node < 18 needs polyfill)
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  // For Node < 18, use node-fetch from dependencies
  fetch = require('node-fetch');
}

// Use centralized filtering from productFilters.cjs
const filters = require('../../src/utils/productFilters.cjs');

exports.handler = async function (event) {
  try {
    const {
      category,
      limit = 20,
      page = 1,
    } = event.queryStringParameters || {};

    console.log(
      `list-products API called with query:`,
      event.queryStringParameters,
    );

    if (!category) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Category parameter is required' }),
      };
    }

    // FIXED: Use real-time S&S ActiveWear API instead of cached JSON
    let data;
    try {
      const username = process.env.SNS_API_USERNAME;
      const password = process.env.SNS_API_KEY;
      const basicAuth =
        username && password
          ? Buffer.from(`${username}:${password}`).toString('base64')
          : null;

      if (!username || !password || !basicAuth) {
        console.warn(
          'S&S API credentials not found, falling back to local cached data file',
        );
        // Fallback to local cached data file
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.resolve(
          __dirname,
          '../../public/data/all_styles_raw.json',
        );

        try {
          const rawData = fs.readFileSync(dataPath, 'utf8');
          data = JSON.parse(rawData);
          console.log(`Loaded ${data.length} products from local cache file`);
        } catch (fileError) {
          console.error('Failed to read local data file:', fileError);
          throw new Error(
            'Product data not available - API credentials missing and local cache unavailable',
          );
        }
      } else {
        // Use real-time S&S API
        console.log('Fetching real-time data from S&S ActiveWear API');

        const response = await fetch(
          'https://api-ca.ssactivewear.com/v2/styles/',
          {
            headers: {
              Authorization: `Basic ${basicAuth}`,
              Accept: 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`S&S API error: ${response.status}`);
        }

        data = await response.json();
        console.log(`Fetched ${data.length} products from live S&S API`);
      }
    } catch (fetchError) {
      console.error('Failed to fetch product data:', fetchError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to load product data',
          details: fetchError.message,
        }),
      };
    }

    console.log(`Loaded ${data.length} total styles`);

    // Use centralized filtering from productFilters.cjs
    // Step 1: Apply brand and youth filters
    const brandFiltered = filters.applyBaseFilters(data);
    console.log(
      `After brand and product filtering: ${brandFiltered.length} products`,
    );

    // Step 2: Filter by specific category
    const categoryProducts = brandFiltered.filter((item) =>
      filters.filterByCategory(item, category),
    );
    console.log(
      `Filtered to ${categoryProducts.length} products for category ${category}`,
    );

    // Step 3: Sort products
    const sortedProducts = filters.sortProducts(categoryProducts);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Step 4: Transform results for API response
    const products = sortedProducts
      .slice(startIndex, endIndex)
      .map(filters.transformForList);

    console.log(`Returning ${products.length} products`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasMore: pageNum < totalPages,
          productsPerPage: limitNum,
        },
      }),
    };
  } catch (error) {
    console.error('Error in list-products API:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch products',
        details: error.message,
      }),
    };
  }
};
