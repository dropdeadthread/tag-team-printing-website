// Ensure fetch is available (Node 18+ has it built-in, Node < 18 needs polyfill)
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  // For Node < 18, use node-fetch from dependencies
  fetch = require('node-fetch');
}

const SELECTED_BRANDS = [
  'Gildan',
  'JERZEES',
  'BELLA + CANVAS',
  'Next Level',
  'Hanes',
  'Comfort Colors',
  'Threadfast Apparel',
  'M&O',
  'Richardson',
  'YP Classics',
  'Valucap',
];

const EXCLUDED_BRANDS = ['American Apparel'];

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

    // Filter by selected brands and exclude baby/youth products
    const brandFiltered = data.filter((item) => {
      // Brand filtering
      const brandMatch =
        SELECTED_BRANDS.includes(item.brandName) &&
        !EXCLUDED_BRANDS.includes(item.brandName) &&
        item.noeRetailing !== true;

      if (!brandMatch) return false;

      // Filter out youth/baby products by title
      const title = (item.title || '').toLowerCase();
      const isYouthOrBaby =
        title.includes('youth') ||
        title.includes('toddler') ||
        title.includes('infant') ||
        title.includes('baby') ||
        title.includes('onesie');

      if (isYouthOrBaby) return false;

      // Category-based filtering
      const itemCategories = item.categories
        ? item.categories.split(',').map((id) => id.trim())
        : [];

      // REMOVED: Aggressive category 9 filter was excluding adult products that are also available in youth sizes
      // Now relying only on title-based filtering above

      // REMOVED: 5-panel only filter was too restrictive - now allowing all headwear from category 11

      return true;
    });
    console.log(
      `After brand and product filtering: ${brandFiltered.length} products`,
    );

    // Filter by category
    const categoryProducts = brandFiltered.filter((item) => {
      if (!item.categories) return false;
      const itemCategories = item.categories.split(',').map((id) => id.trim());

      // Category-specific filtering logic
      const title = (item.title || '').toLowerCase();
      const baseCategory = (item.baseCategory || '').toLowerCase();

      if (category.toString() === '21') {
        // T-Shirts
        return (
          (itemCategories.includes('21') ||
            baseCategory.includes('t-shirts') ||
            title.includes('t-shirt')) &&
          !itemCategories.includes('64') &&
          !baseCategory.includes('long sleeve') &&
          !title.includes('long sleeve') &&
          !title.includes('tank')
        );
      }

      if (category.toString() === '64') {
        // Tank Tops
        return (
          itemCategories.includes('64') ||
          baseCategory.includes('tank') ||
          title.includes('tank')
        );
      }

      if (category.toString() === '400') {
        // Crewnecks - category 400 doesn't exist in S&S API, use title/baseCategory
        return (
          title.includes('crewneck') ||
          title.includes('crew neck') ||
          baseCategory.includes('crew')
        );
      }

      if (category.toString() === '36') {
        // Hoodies
        return (
          itemCategories.includes('36') ||
          title.includes('hoodie') ||
          baseCategory.includes('hoodie')
        );
      }

      if (category.toString() === '38') {
        // Full-Zip / Zip-Ups
        return (
          itemCategories.includes('38') ||
          title.includes('full-zip') ||
          title.includes('full zip') ||
          baseCategory.includes('full-zip')
        );
      }

      if (category.toString() === '56') {
        // Long Sleeves
        return (
          itemCategories.includes('56') ||
          title.includes('long sleeve') ||
          baseCategory.includes('long sleeve')
        );
      }

      if (category.toString() === '11') {
        // Headwear - already filtered to category 11 products only
        return itemCategories.includes('11');
      }

      // Default: match by category ID
      return itemCategories.includes(category.toString());
    });

    console.log(
      `Filtered to ${categoryProducts.length} products for category ${category}`,
    );

    // Sort products
    const sortedProducts = categoryProducts.sort((a, b) => {
      if (a.brandName !== b.brandName) {
        return a.brandName.localeCompare(b.brandName);
      }
      return (a.title || '').localeCompare(b.title || '');
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Transform results
    const products = sortedProducts.slice(startIndex, endIndex).map((item) => ({
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
