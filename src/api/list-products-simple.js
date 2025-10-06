// Simplified list-products API without dynamic imports
// Using built-in fetch (available in Node 18+)

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

module.exports = async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    console.log(`list-products API called with query:`, req.query);

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    // Use S&S API directly - simplified version
    const username = process.env.SNS_API_USERNAME;
    const password = process.env.SNS_API_KEY;

    console.log('Environment check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      nodeVersion: process.version,
    });

    if (!username || !password) {
      console.error('Missing S&S API credentials');
      return res.status(500).json({
        error: 'S&S API credentials not configured',
        envCheck: { hasUsername: !!username, hasPassword: !!password },
      });
    }

    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    console.log('Making S&S API call...');

    // Use built-in fetch (Node 18+) instead of dynamic import
    const response = await fetch('https://api-ca.ssactivewear.com/v2/styles/', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `S&S API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.length} total products from S&S API`);

    // Filter to selected brands
    const selectedCategories = ['21', '36', '38', '56', '9', '64', '11'];
    const filteredData = data.filter((item) => {
      const brandMatch = SELECTED_BRANDS.includes(item.brandName);
      const categoryMatch =
        item.categories &&
        selectedCategories.some((catId) =>
          item.categories
            .split(',')
            .map((id) => id.trim())
            .includes(catId),
        );
      return brandMatch && categoryMatch && item.noeRetailing !== true;
    });

    console.log(
      `Filtered to ${filteredData.length} products from selected brands`,
    );

    // Apply category-specific filtering (simplified)
    let categoryProducts = filteredData;

    if (category === 't-shirts') {
      categoryProducts = filteredData.filter(
        (item) =>
          item.categories &&
          item.categories.includes('21') &&
          (!item.baseCategory || !item.baseCategory.includes('Tank')),
      );
    } else if (category === 'hoodies') {
      categoryProducts = filteredData.filter(
        (item) =>
          item.categories &&
          (item.categories.includes('22') || item.categories.includes('36')),
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);

    console.log(
      `Returning ${paginatedProducts.length} products for category ${category}`,
    );

    return res.status(200).json({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalProducts: categoryProducts.length,
        totalPages: Math.ceil(categoryProducts.length / limit),
        hasNextPage: endIndex < categoryProducts.length,
        hasPreviousPage: page > 1,
      },
      category: category,
      success: true,
    });
  } catch (error) {
    console.error('Error in list-products API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
