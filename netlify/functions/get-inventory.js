// Tag Team Printing - get-inventory.js
// Pulls real-time S&S inventory, applies Tag Team's markup logic, and returns retail-ready data.

import {
  getSizeAdjustedRetailPrice,
  sortSizesByOrder,
} from '../../src/config/pricing.js'; // ✅ corrected path

export const handler = async (event) => {
  const { styleCode, styleID, color } = event.queryStringParameters || {};
  const productStyleID = styleCode || styleID;

  if (!productStyleID) {
    return errorResponse(400, 'styleCode or styleID is required');
  }

  try {
    const username = process.env.SNS_API_USERNAME;
    const apiKey = process.env.SNS_API_KEY;

    if (!username || !apiKey) {
      console.error('[get-inventory] Missing API credentials');
      return errorResponse(500, 'API credentials not configured');
    }

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
    const headers = {
      Accept: 'application/json',
      Authorization: authHeader,
      'User-Agent': 'TagTeamPrinting/1.0',
    };

    console.log(`[get-inventory] Fetching styleID: ${productStyleID}`);

    // ⚡ Fetch both datasets in parallel for efficiency
    const [productRes, inventoryRes] = await Promise.all([
      fetch(
        `https://api-ca.ssactivewear.com/v2/products/?styleid=${productStyleID}`,
        { headers },
      ),
      fetch(
        `https://api-ca.ssactivewear.com/v2/inventory/?styleid=${productStyleID}`,
        { headers },
      ),
    ]);

    if (!productRes.ok || !inventoryRes.ok) {
      console.error(
        '[get-inventory] S&S API error:',
        productRes.status,
        inventoryRes.status,
      );
      return errorResponse(
        productRes.status || inventoryRes.status,
        'S&S API request failed',
      );
    }

    const [products, inventory] = await Promise.all([
      productRes.json(),
      inventoryRes.json(),
    ]);

    // ✅ Validate responses
    if (!Array.isArray(products) || products.length === 0) {
      console.error(
        `[get-inventory] No products found for styleID ${productStyleID}`,
      );
      return errorResponse(404, 'Style not found');
    }

    if (!Array.isArray(inventory)) {
      console.error('[get-inventory] Unexpected inventory response format');
      return errorResponse(500, 'Unexpected inventory format');
    }

    const styleName = products[0]?.styleName || `Style ${productStyleID}`;
    console.log(
      `[get-inventory] Found ${products.length} variants for ${styleName}`,
    );

    // 🧮 Map SKU → total quantity from the inventory API
    const inventoryMap = {};
    inventory.forEach((item) => {
      if (Array.isArray(item.warehouses)) {
        const totalQty = item.warehouses.reduce(
          (sum, w) => sum + (parseInt(w.qty) || 0),
          0,
        );
        inventoryMap[item.sku] = totalQty;
      }
    });

    // 🧱 Build structured data
    const sizes = {};
    const colorMap = new Map();

    for (const product of products) {
      const {
        sizeName,
        colorName,
        brandName,
        wholesalePrice,
        sku,
        color1,
        colorSwatchImage,
        colorFrontImage,
      } = product;

      if (color && colorName !== color) continue;

      const totalQty = inventoryMap[sku] || 0;
      const retailPrice = getSizeAdjustedRetailPrice(
        wholesalePrice,
        sizeName,
        1,
        brandName,
      );

      // Aggregate inventory per size
      if (!sizes[sizeName]) {
        sizes[sizeName] = { price: retailPrice, available: 0 };
      }
      sizes[sizeName].available += totalQty;

      // Build color info
      if (!colorMap.has(colorName)) {
        colorMap.set(colorName, {
          name: colorName,
          hex: color1 || '#CCCCCC',
          swatch: colorSwatchImage
            ? `https://www.ssactivewear.com/${colorSwatchImage}`
            : null,
          image: colorFrontImage
            ? `https://www.ssactivewear.com/${colorFrontImage}`
            : null,
          available: totalQty > 0,
        });
      } else if (totalQty > 0) {
        colorMap.get(colorName).available = true;
      }
    }

    // 🧩 Sort sizes using your predefined order
    const sortedSizes = sortSizesByOrder(sizes);
    const colors = Array.from(colorMap.values());

    console.log(
      `[get-inventory] Returning ${colors.length} colors, ${Object.keys(sortedSizes).length} sizes for ${styleName}`,
    );

    return successResponse({
      styleID: parseInt(productStyleID),
      styleName,
      sizes: sortedSizes,
      colors,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[get-inventory] Error:', err);
    return errorResponse(500, err.message || 'Failed to fetch inventory');
  }
};

// ✅ Helper utilities
function successResponse(body) {
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}

function errorResponse(code, message) {
  return {
    statusCode: code,
    headers: corsHeaders(),
    body: JSON.stringify({ error: message }),
  };
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
}
