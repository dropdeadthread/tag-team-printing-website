// Professional S&S API inventory function - optimized for performance
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { styleID, color } = event.queryStringParameters || {};

  if (!styleID) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'styleID is required' }),
    };
  }

  try {
    const username = process.env.SNS_API_USERNAME;
    const apiKey = process.env.SNS_API_KEY;

    if (!username || !apiKey) {
      console.error('S&S API credentials not found');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'API credentials not configured' }),
      };
    }

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');

    // Use products endpoint for specific style - much faster than fetching all styles
    const PRODUCTS_URL = `https://api-ca.ssactivewear.com/v2/products/?styleid=${styleID}`;

    console.log(
      `[get-inventory] Fetching inventory for styleID: ${styleID}, color: ${color || 'all'}`,
    );

    // Fetch specific style products (faster than all styles)
    const response = await fetch(PRODUCTS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
        'User-Agent': 'TagTeamPrinting/1.0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `[get-inventory] S&S API error: ${response.status} ${response.statusText}`,
      );
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `S&S API error: ${response.status}`,
          details: response.statusText,
        }),
      };
    }

    const allProducts = await response.json();

    if (!Array.isArray(allProducts)) {
      console.error('[get-inventory] Unexpected API response format');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Unexpected API response format' }),
      };
    }

    if (allProducts.length === 0) {
      console.error(`[get-inventory] No products found for styleID ${styleID}`);
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Style not found' }),
      };
    }

    // Get style info from first product
    const firstProduct = allProducts[0];
    const styleName = firstProduct.styleName || styleID;

    console.log(
      `[get-inventory] Found ${allProducts.length} products for style: ${styleName}`,
    );

    // Process products to build inventory
    const sizes = {};
    const colorMap = new Map();

    allProducts.forEach((product) => {
      // Extract size and color info
      const sizeName = product.size;
      const colorName = product.colorName;
      const colorHex = product.color1 || '#CCCCCC';

      // Calculate total inventory across warehouses
      const totalQty =
        (parseInt(product.warehouse1Qty) || 0) +
        (parseInt(product.warehouse2Qty) || 0) +
        (parseInt(product.warehouse3Qty) || 0);

      // If filtering by specific color, only process that color''s products
      if (color && colorName !== color) {
        return; // Skip this product
      }

      // Build sizes inventory
      if (!sizes[sizeName]) {
        sizes[sizeName] = {
          price: parseFloat(product.customerPrice) || 14.61,
          wholesalePrice: parseFloat(product.wholesalePrice) || 9.13,
          available: 0,
        };
      }
      sizes[sizeName].available += totalQty;

      // Build colors array with images - THIS IS THE KEY PART!
      if (!colorMap.has(colorName)) {
        colorMap.set(colorName, {
          name: colorName,
          hex: colorHex,
          available: totalQty > 0,
          colorFrontImage: product.colorFrontImage || null,
          colorSideImage: product.colorSideImage || null,
          colorBackImage: product.colorBackImage || null,
        });
      } else {
        // Update existing color data
        const existingColor = colorMap.get(colorName);
        if (totalQty > 0) {
          existingColor.available = true;
        }
        // Prefer images from products that have stock
        if (
          totalQty > 0 &&
          !existingColor.colorFrontImage &&
          product.colorFrontImage
        ) {
          existingColor.colorFrontImage = product.colorFrontImage;
          existingColor.colorSideImage = product.colorSideImage;
          existingColor.colorBackImage = product.colorBackImage;
        }
      }
    });

    // Convert color map to array
    const colors = Array.from(colorMap.values());

    // Sort sizes in standard order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const sortedSizes = {};

    sizeOrder.forEach((size) => {
      if (sizes[size]) {
        sortedSizes[size] = sizes[size];
      }
    });

    // Add any remaining sizes not in standard order
    Object.keys(sizes).forEach((size) => {
      if (!sortedSizes[size]) {
        sortedSizes[size] = sizes[size];
      }
    });

    const responseData = {
      styleID: parseInt(styleID),
      styleName: styleName,
      currentColor: color || null,
      sizes: sortedSizes,
      colors: colors,
      lastUpdated: new Date().toISOString(),
    };

    console.log(
      `[get-inventory] Returning ${colors.length} colors, ${Object.keys(sortedSizes).length} sizes`,
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error('[get-inventory] Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to fetch inventory',
        details: error.message,
      }),
    };
  }
};
