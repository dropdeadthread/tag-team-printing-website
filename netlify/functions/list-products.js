// Fixed version - CommonJS syntax for Netlify Functions
const fetch = require('node-fetch');

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

exports.handler = async function (event, context) {
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

    // Fetch product data
    let data;
    try {
      const dataUrl = 'https://tagteamprints.com/data/all_styles_raw.json';
      console.log(`Fetching data from: ${dataUrl}`);

      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      data = await response.json();
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

    // Filter by selected brands
    const brandFiltered = data.filter(
      (item) =>
        SELECTED_BRANDS.includes(item.brandName) &&
        !EXCLUDED_BRANDS.includes(item.brandName) &&
        item.noeRetailing !== true,
    );
    console.log(`After brand filtering: ${brandFiltered.length} products`);

    // Filter by category
    const categoryProducts = brandFiltered.filter((item) => {
      if (!item.categories) return false;
      const itemCategories = item.categories.split(',');

      // Category-specific filtering logic (preserved from original)
      if (category.toString() === '21') {
        return (
          (itemCategories.includes('21') ||
            (item.baseCategory && item.baseCategory.includes('T-Shirts')) ||
            (item.title && item.title.toLowerCase().includes('t-shirt'))) &&
          !itemCategories.includes('64') &&
          !(
            item.baseCategory === 'T-Shirts - Long Sleeve' ||
            item.title.toLowerCase().includes('long sleeve')
          ) &&
          !item.title.toLowerCase().includes('tank')
        );
      }

      if (category.toString() === '64') {
        return (
          itemCategories.includes('64') ||
          (item.baseCategory && item.baseCategory.includes('Tank')) ||
          (item.title && item.title.toLowerCase().includes('tank'))
        );
      }

      // Add other category filters as needed...
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
