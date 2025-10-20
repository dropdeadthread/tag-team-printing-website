// Professional S&S API inventory function - mirrors gatsby-node.js pattern
// Using built-in fetch (Node.js 18+)

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
    const password = process.env.SNS_API_KEY;
    const basicAuth =
      username && password
        ? Buffer.from(`${username}:${password}`).toString('base64')
        : null;

    if (!username || !password || !basicAuth) {
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

    const BASE_URL = 'https://api-ca.ssactivewear.com/v2/styles/';

    console.log(
      `[get-inventory] Fetching inventory for styleID: ${styleID}, color: ${color || 'all'}`,
    );

    // Fetch ALL styles (same as gatsby-node.js does)
    const response = await fetch(BASE_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
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

    const allStyles = await response.json();

    if (!Array.isArray(allStyles)) {
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

    // Find the specific style we want
    const style = allStyles.find((s) => s.styleID === parseInt(styleID));

    if (!style) {
      console.error(`[get-inventory] Style ${styleID} not found`);
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Style not found' }),
      };
    }

    console.log(`[get-inventory] Found style: ${style.styleName}`);

    // Check if style has SKUs
    if (!style.skus || !Array.isArray(style.skus)) {
      console.warn(
        `[get-inventory] Style ${styleID} has no SKUs, using basic structure`,
      );

      // Return basic structure without real inventory data
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          styleID: parseInt(styleID),
          styleName: style.styleName || styleID,
          currentColor: color || null,
          sizes: {
            S: { price: 14.61, wholesalePrice: 9.13, available: 0 },
            M: { price: 14.61, wholesalePrice: 9.13, available: 0 },
            L: { price: 14.61, wholesalePrice: 9.13, available: 0 },
            XL: { price: 14.61, wholesalePrice: 9.13, available: 0 },
          },
          colors: [],
          lastUpdated: new Date().toISOString(),
        }),
      };
    }

    // Process SKUs to build inventory
    const sizes = {};
    const colorMap = new Map();

    style.skus.forEach((sku) => {
      const sizeName = sku.size;
      const colorName = sku.colorName;
      const colorHex = sku.color1 || '#CCCCCC';

      // Calculate total inventory across warehouses
      const totalQty =
        (parseInt(sku.warehouse1Qty) || 0) +
        (parseInt(sku.warehouse2Qty) || 0) +
        (parseInt(sku.warehouse3Qty) || 0);

      // If filtering by specific color, only process that color's SKUs
      if (color && colorName !== color) {
        return; // Skip this SKU
      }

      // Build sizes inventory
      if (!sizes[sizeName]) {
        sizes[sizeName] = {
          price: parseFloat(sku.customerPrice) || 14.61,
          wholesalePrice: parseFloat(sku.wholesalePrice) || 9.13,
          available: 0,
        };
      }
      sizes[sizeName].available += totalQty;

      // Build colors array with images
      if (!colorMap.has(colorName)) {
        colorMap.set(colorName, {
          name: colorName,
          hex: colorHex,
          available: totalQty > 0,
          colorFrontImage: sku.colorFrontImage || null,
          colorSideImage: sku.colorSideImage || null,
          colorBackImage: sku.colorBackImage || null,
        });
      } else {
        // Update existing color data
        const existingColor = colorMap.get(colorName);
        if (totalQty > 0) {
          existingColor.available = true;
        }
        // Prefer images from SKUs that have stock
        if (
          totalQty > 0 &&
          !existingColor.colorFrontImage &&
          sku.colorFrontImage
        ) {
          existingColor.colorFrontImage = sku.colorFrontImage;
          existingColor.colorSideImage = sku.colorSideImage;
          existingColor.colorBackImage = sku.colorBackImage;
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
      styleName: style.styleName || styleID,
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
