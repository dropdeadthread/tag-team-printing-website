// Tag Team Printing: get-inventory.js
// Live S&S inventory + retail markup logic + in-memory cache

// Pricing functions directly embedded to avoid require path issues
const sizeOrder = {
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
  '2XL': 6,
  '3XL': 7,
  '4XL': 8,
  '5XL': 9,
};

function sortSizesByOrder(sizesObj) {
  const entries = Object.entries(sizesObj);
  entries.sort((a, b) => (sizeOrder[a[0]] || 99) - (sizeOrder[b[0]] || 99));
  return Object.fromEntries(entries);
}

function getSizeAdjustedWholesalePrice(wholesalePrice, sizeName) {
  const price = parseFloat(wholesalePrice);
  if (sizeName === '2XL') return price + 2;
  if (['3XL', '4XL', '5XL'].includes(sizeName)) return price + 3;
  return price;
}

function calculateRetailPrice(adjustedWholesale) {
  const price = parseFloat(adjustedWholesale);
  let multiplier;
  if (price < 4.25) multiplier = 2.5;
  else if (price <= 6.99) multiplier = 2.0;
  else multiplier = 1.6;
  return (price * multiplier).toFixed(2);
}

// 🧠 Simple in-memory cache (clears on cold start)
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached(styleID) {
  const entry = cache.get(styleID);
  if (entry && Date.now() < entry.expires) {
    console.log(`[get-inventory] Serving cached data for styleID: ${styleID}`);
    return entry.data;
  }
  return null;
}

function setCache(styleID, data) {
  cache.set(styleID, { data, expires: Date.now() + CACHE_TTL });
}

exports.handler = async (event) => {
  const { styleCode, styleID, color, clearCache } =
    event.queryStringParameters || {};
  const productStyleID = styleCode || styleID;

  if (!productStyleID)
    return errorResponse(400, 'styleCode or styleID is required');

  // 🧹 Clear cache if requested
  if (clearCache === 'true') {
    cache.delete(productStyleID);
    console.log(`[get-inventory] Cache cleared for styleID: ${productStyleID}`);
  }

  // 🪣 Check cache first
  const cached = getCached(productStyleID);
  if (cached) return successResponse(cached);

  try {
    const username = process.env.SNS_API_USERNAME;
    const apiKey = process.env.SNS_API_KEY;
    if (!username || !apiKey)
      return errorResponse(500, 'S&S API credentials not configured');

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
    const headers = {
      Accept: 'application/json',
      Authorization: authHeader,
      'User-Agent': 'TagTeamPrinting/1.0',
    };

    console.log(`[get-inventory] Fetching styleID: ${productStyleID}`);

    const [prodRes, invRes] = await Promise.all([
      fetch(
        `https://api-ca.ssactivewear.com/v2/products/?styleid=${productStyleID}`,
        { headers },
      ),
      fetch(
        `https://api-ca.ssactivewear.com/v2/inventory/?styleid=${productStyleID}`,
        { headers },
      ),
    ]);

    if (!prodRes.ok || !invRes.ok)
      return errorResponse(502, 'S&S API request failed');

    const [products, inventory] = await Promise.all([
      prodRes.json(),
      invRes.json(),
    ]);

    if (!Array.isArray(products) || products.length === 0)
      return errorResponse(404, 'Style not found');

    const styleName = products[0]?.styleName || `Style ${productStyleID}`;
    const brandName = products[0]?.brandName || 'Unknown Brand';
    console.log(
      `[get-inventory] Found ${products.length} variants for ${brandName} ${styleName}`,
    );

    // 🧮 Map SKU → totalQty
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

    // 🧱 Build color structure
    const colorMap = new Map();

    for (const product of products) {
      const {
        sku,
        sizeName,
        colorName,
        brandName,
        wholesalePrice,
        color1,
        colorSwatchImage,
        colorFrontImage,
      } = product;

      if (color && colorName !== color) continue;

      const totalQty = inventoryMap[sku] || 0;
      // Use markup pricing for individual product display instead of quantity tiers
      const adjustedWholesale = getSizeAdjustedWholesalePrice(
        wholesalePrice,
        sizeName,
      );
      const retailPrice = calculateRetailPrice(adjustedWholesale);

      if (!colorMap.has(colorName)) {
        colorMap.set(colorName, {
          name: colorName,
          hex: color1 || '#CCCCCC',
          swatchImg: colorSwatchImage
            ? `https://www.ssactivewear.com/${colorSwatchImage}`
            : null,
          colorFrontImage: colorFrontImage
            ? `https://www.ssactivewear.com/${colorFrontImage}`
            : null,
          sizes: {},
        });
      }

      const entry = colorMap.get(colorName);
      entry.sizes[sizeName] = {
        available: totalQty,
        price: parseFloat(retailPrice) || 25.0,
      };
    }

    const colors = Array.from(colorMap.values());
    colors.forEach((c) => (c.sizes = sortSizesByOrder(c.sizes)));

    const responseData = {
      styleID: parseInt(productStyleID),
      styleName,
      brandName,
      colors,
      lastUpdated: new Date().toISOString(),
    };

    // 🧠 Cache result
    setCache(productStyleID, responseData);

    console.log(
      `[get-inventory] Returning ${colors.length} colors for ${brandName} ${styleName}`,
    );
    return successResponse(responseData);
  } catch (err) {
    console.error('[get-inventory] Error:', err);
    return errorResponse(500, err.message || 'Failed to fetch inventory');
  }
};

// 🌐 Utility helpers
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
