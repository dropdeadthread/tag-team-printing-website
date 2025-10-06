// Removed unused fs and path imports since we're using S&S API directly

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
  try {
    const { category, limit = 20, page = 1 } = req.query;

    console.log(`list-products API called with query:`, req.query);

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    // Use S&S API directly - this is reliable and works in serverless
    const username = process.env.SNS_API_USERNAME;
    const password = process.env.SNS_API_KEY;
    let data;

    if (username && password) {
      console.log('S&S API credentials available, fetching live data');

      const basicAuth = Buffer.from(`${username}:${password}`).toString(
        'base64',
      );
      const fetch = (await import('node-fetch')).default;

      try {
        const response = await fetch(
          'https://api-ca.ssactivewear.com/v2/styles/',
          {
            headers: {
              Authorization: `Basic ${basicAuth}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`S&S API error: ${response.status}`);
        }

        data = await response.json();
        console.log(`Fetched ${data.length} total products from S&S API`);

        // Use the live data
        const selectedBrands = [
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
        const selectedCategories = ['21', '36', '38', '56', '9', '64', '11'];

        const filteredData = data.filter((item) => {
          const brandMatch = selectedBrands.includes(item.brandName);
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
        data = filteredData;
      } catch (apiError) {
        console.error('S&S API failed, no fallback available:', apiError);
        return res.status(500).json({
          error: 'Unable to fetch product data from S&S API',
          details: apiError.message,
        });
      }
    } else {
      console.error('Missing S&S API credentials');
      return res.status(500).json({
        error: 'S&S API credentials not configured',
      });
    }

    console.log(`Loaded ${data.length} total styles from local file`);

    // Filter by selected brands, exclude unwanted brands, and exclude noeRetailing products
    const brandFiltered = data.filter(
      (item) =>
        SELECTED_BRANDS.includes(item.brandName) &&
        !EXCLUDED_BRANDS.includes(item.brandName) &&
        item.noeRetailing !== true, // Exclude closeout/discontinued items
    );
    console.log(`After brand filtering: ${brandFiltered.length} products`);
    console.log(
      `Brand distribution:`,
      brandFiltered.reduce((acc, item) => {
        acc[item.brandName] = (acc[item.brandName] || 0) + 1;
        return acc;
      }, {}),
    );

    // Filter by category with improved logic for proper categorization
    const categoryProducts = brandFiltered.filter((item) => {
      if (!item.categories) return false;

      const itemCategories = item.categories.split(',');

      // For t-shirts category (21), EXCLUDE tank tops and long sleeve products
      if (category.toString() === '21') {
        // Include standard T-shirt category but exclude tank tops and long sleeve
        return (
          (itemCategories.includes('21') || // Standard T-shirt category
            (item.baseCategory && item.baseCategory.includes('T-Shirts')) || // T-shirt base categories
            (item.title && item.title.toLowerCase().includes('t-shirt'))) && // Any product with "t-shirt" in title
          // BUT exclude tank tops and long sleeve products
          !itemCategories.includes('64') && // Exclude tank tops category
          !(
            item.baseCategory === 'T-Shirts - Long Sleeve' ||
            item.title.toLowerCase().includes('long sleeve') ||
            item.title.toLowerCase().includes('long-sleeve')
          ) &&
          // Exclude tank tops by title keywords
          !item.title.toLowerCase().includes('tank') &&
          !item.title.toLowerCase().includes('tank top') &&
          !(item.baseCategory && item.baseCategory.includes('Tank'))
        );
      }

      // For tank tops category (64), include only tank top products
      if (category.toString() === '64') {
        return (
          itemCategories.includes('64') || // Tank tops category
          (item.baseCategory && item.baseCategory.includes('Tank')) || // Tank base categories
          (item.title &&
            (item.title.toLowerCase().includes('tank') ||
              item.title.toLowerCase().includes('tank top')))
        );
      }

      // For long sleeve category (8), use specific approved styles for BELLA + CANVAS
      if (category.toString() === '8') {
        // BELLA + CANVAS approved long sleeve styles
        const bellaApprovedLongSleeve = [
          '3501Y',
          '3501',
          '3501CVC',
          '3501YCVC',
          '3511',
          '3512',
          '3513',
          '3513Y',
          '4651',
          '8850',
        ];

        if (item.brandName === 'BELLA + CANVAS') {
          return (
            bellaApprovedLongSleeve.includes(item.styleName) &&
            // Exclude tank tops
            !item.title.toLowerCase().includes('tank') &&
            !itemCategories.includes('64')
          );
        }

        // For other brands, use the previous logic but exclude hooded items and tank tops
        return (
          (item.baseCategory === 'T-Shirts - Long Sleeve' ||
            (item.baseCategory &&
              item.baseCategory.includes('T-Shirts') &&
              (item.title.toLowerCase().includes('long sleeve') ||
                item.title.toLowerCase().includes('long-sleeve')))) &&
          !(item.baseCategory && item.baseCategory.includes('Fleece')) &&
          !item.title.toLowerCase().includes('sweatshirt') &&
          !item.title.toLowerCase().includes('crewneck') &&
          !item.title.toLowerCase().includes('hood') &&
          !item.title.toLowerCase().includes('hooded') &&
          !item.title.toLowerCase().includes('hoodie') &&
          // Exclude tank tops
          !item.title.toLowerCase().includes('tank') &&
          !itemCategories.includes('64')
        );
      }

      // For crewnecks category (400), include crewneck sweatshirts from all selected brands
      if (category.toString() === '400') {
        return (
          (item.title.toLowerCase().includes('crewneck') ||
            item.title.toLowerCase().includes('crew neck') ||
            (item.baseCategory &&
              (item.baseCategory.includes('Fleece - Premium - Crew') ||
                item.baseCategory.includes('Fleece - Core - Crew')))) &&
          // Exclude hooded items (those go to hoodies category)
          !item.title.toLowerCase().includes('hoodie') &&
          !item.title.toLowerCase().includes('hooded') &&
          !item.title.toLowerCase().includes('hood') &&
          !(
            item.baseCategory &&
            (item.baseCategory.includes('Fleece - Premium - Hood') ||
              item.baseCategory.includes('Fleece - Core - Hood'))
          ) &&
          // Exclude tank tops
          !item.title.toLowerCase().includes('tank') &&
          !itemCategories.includes('64')
        );
      }

      // For lightweight hoodies category (401), include BELLA + CANVAS lightweight/sponge fleece hoodies
      if (category.toString() === '401') {
        return (
          item.brandName === 'BELLA + CANVAS' &&
          ((item.title.toLowerCase().includes('sponge fleece') &&
            (item.title.toLowerCase().includes('hoodie') ||
              item.title.toLowerCase().includes('hooded'))) ||
            (item.title.toLowerCase().includes('triblend') &&
              (item.title.toLowerCase().includes('hoodie') ||
                item.title.toLowerCase().includes('hooded'))) ||
            (item.title.toLowerCase().includes('lightweight') &&
              (item.title.toLowerCase().includes('hoodie') ||
                item.title.toLowerCase().includes('hooded')))) &&
          // Exclude tank tops
          !item.title.toLowerCase().includes('tank') &&
          !itemCategories.includes('64')
        );
      }

      // For sweatshirts category (9), include fleece crewnecks and sweatshirts
      if (category.toString() === '9') {
        return (
          itemCategories.includes('9') ||
          (item.baseCategory &&
            (item.baseCategory.includes('Fleece - Premium - Crew') ||
              item.baseCategory.includes('Fleece - Core - Crew'))) ||
          (item.title &&
            (item.title.toLowerCase().includes('sweatshirt') ||
              item.title.toLowerCase().includes('crewneck')) &&
            // Exclude hooded items (those go in hoodies category)
            !item.title.toLowerCase().includes('hoodie') &&
            !item.title.toLowerCase().includes('hooded') &&
            // Exclude tank tops
            !item.title.toLowerCase().includes('tank') &&
            !itemCategories.includes('64'))
        );
      }

      // For hoodies category (22 or 36), include ONLY fleece hooded sweatshirts, NOT hooded t-shirts
      if (category.toString() === '22' || category.toString() === '36') {
        return (
          (itemCategories.includes('22') ||
            itemCategories.includes('36') ||
            (item.baseCategory &&
              (item.baseCategory.includes('Fleece - Premium - Hood') ||
                item.baseCategory.includes('Fleece - Core - Hood')))) &&
          item.title &&
          (item.title.toLowerCase().includes('hoodie') ||
            item.title.toLowerCase().includes('hooded') ||
            item.title.toLowerCase().includes('hood')) &&
          // Exclude ALL long sleeve t-shirts, even if hooded (those belong in long sleeve category)
          !(item.baseCategory === 'T-Shirts - Long Sleeve') &&
          // Exclude crewneck products (those belong in crewnecks category)
          !item.title.toLowerCase().includes('crewneck') &&
          !item.title.toLowerCase().includes('crew neck') &&
          !(
            item.baseCategory &&
            (item.baseCategory.includes('Fleece - Premium - Crew') ||
              item.baseCategory.includes('Fleece - Core - Crew'))
          ) &&
          // Exclude tank tops
          !item.title.toLowerCase().includes('tank') &&
          !itemCategories.includes('64')
        );
      }

      // For polos (2), exclude items that don't belong
      if (category.toString() === '2') {
        return (
          itemCategories.includes('2') &&
          (item.baseCategory === 'Sport Shirts' ||
            item.title.toLowerCase().includes('polo')) &&
          // Exclude tank tops
          !item.title.toLowerCase().includes('tank') &&
          !itemCategories.includes('64')
        );
      }

      // For headwear category (6), include specific 5 panel hats from hat specialist brands
      if (category.toString() === '6') {
        // Approved 5 panel hat styles
        const approved5PanelHats = [
          '112FP', // Richardson Five-Panel Trucker Cap
          '5089M', // YP Classics Premium Five-Panel Snapback Cap
          '5789M', // YP Classics Premium Five-Panel Curved Bill Snapback Cap
          '6006', // YP Classics Five-Panel Classic Trucker Cap
          '6007', // YP Classics Five-Panel Cotton Twill Snapback Cap
          '8869', // Valucap Five-Panel Twill Cap
        ];

        const hatBrands = ['Richardson', 'YP Classics', 'Valucap'];

        return (
          hatBrands.includes(item.brandName) &&
          approved5PanelHats.includes(item.styleName)
        );
      }

      return itemCategories.includes(category.toString());
    });

    console.log(
      `Filtered from ${brandFiltered.length} to ${categoryProducts.length} products for category ${category}`,
    );

    // Sort products by brand name first, then by product name for consistent ordering
    const sortedProducts = categoryProducts.sort((a, b) => {
      if (a.brandName !== b.brandName) {
        return a.brandName.localeCompare(b.brandName);
      }
      return (a.title || '').localeCompare(b.title || '');
    });

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Transform and paginate results
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

    console.log(`Returning ${products.length} products to frontend`);

    // Log brand distribution in the returned products
    const returnedBrands = products.reduce((acc, item) => {
      acc[item.brand] = (acc[item.brand] || 0) + 1;
      return acc;
    }, {});
    console.log('Returned brand distribution:', returnedBrands);

    if (products.length > 0) {
      console.log('Sample product:', {
        name: products[0].name,
        brand: products[0].brand,
        categories: products[0].categories,
      });
    }

    res.status(200).json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasMore: pageNum < totalPages,
        productsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error('Error in list-products API:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch products', details: error.message });
  }
};
