// Real S&S API inventory function with color-specific images
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { styleID, color } = event.queryStringParameters || {};

  if (!styleID) {
    return {
      statusCode: 400,
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
        body: JSON.stringify({ error: 'API credentials not configured' }),
      };
    }

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');

    // Fetch style details from S&S API
    console.log(
      `Fetching inventory for styleID: ${styleID}, color: ${color || 'all'}`,
    );

    const response = await fetch(
      `https://api-ca.ssactivewear.com/v2/styles/${styleID}`,
      {
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.error(`S&S API error: ${response.status}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `S&S API error: ${response.status}` }),
      };
    }

    const styleData = await response.json();
    console.log(`Received style data for: ${styleData.styleName}`);

    // Extract sizes and create inventory structure
    const sizes = {};
    const colors = [];
    const colorMap = new Map();

    // Process SKUs to build inventory
    if (styleData.skus && Array.isArray(styleData.skus)) {
      styleData.skus.forEach((sku) => {
        const sizeName = sku.size;
        const colorName = sku.colorName;
        const colorHex = sku.color1 || '#CCCCCC';

        // Add size inventory
        if (!sizes[sizeName]) {
          sizes[sizeName] = {
            price: parseFloat(sku.customerPrice) || 14.61,
            wholesalePrice: parseFloat(sku.wholesalePrice) || 9.13,
            available: 0,
          };
        }

        // Add inventory count (using warehouse1Qty + warehouse2Qty + warehouse3Qty)
        const totalQty =
          (sku.warehouse1Qty || 0) +
          (sku.warehouse2Qty || 0) +
          (sku.warehouse3Qty || 0);

        // If filtering by specific color, only count that color's inventory
        if (!color || colorName === color) {
          sizes[sizeName].available += totalQty;
        }

        // Track unique colors with their images
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
          // Update availability if this SKU has stock
          const existingColor = colorMap.get(colorName);
          if (totalQty > 0) {
            existingColor.available = true;
          }
          // Prefer images from SKUs with stock
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
      colorMap.forEach((colorData) => {
        colors.push(colorData);
      });
    }

    // Sort sizes in standard order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const sortedSizes = {};
    sizeOrder.forEach((size) => {
      if (sizes[size]) {
        sortedSizes[size] = sizes[size];
      }
    });
    // Add any remaining sizes not in the standard order
    Object.keys(sizes).forEach((size) => {
      if (!sortedSizes[size]) {
        sortedSizes[size] = sizes[size];
      }
    });

    const response_data = {
      styleID: parseInt(styleID),
      styleName: styleData.styleName,
      currentColor: color || null,
      sizes: sortedSizes,
      colors: colors,
      lastUpdated: new Date().toISOString(),
    };

    console.log(
      `Returning inventory with ${colors.length} colors and ${Object.keys(sortedSizes).length} sizes`,
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response_data),
    };
  } catch (error) {
    console.error('Error fetching inventory:', error);
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
