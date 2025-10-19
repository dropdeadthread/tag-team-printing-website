// Mock inventory API that provides color-specific stock numbers (Production version)
// TEMPORARY: Reverting to mock while we debug the real S&S API integration
exports.handler = async (event) => {
  const { styleID, color } = event.queryStringParameters || {};

  if (!styleID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'styleID is required' }),
    };
  }

  // Base sizes with mock inventory numbers
  const baseSizes = {
    XS: { price: 14.61, wholesalePrice: 9.13 },
    S: { price: 14.61, wholesalePrice: 9.13 },
    M: { price: 14.61, wholesalePrice: 9.13 },
    L: { price: 14.61, wholesalePrice: 9.13 },
    XL: { price: 14.61, wholesalePrice: 9.13 },
    '2XL': { price: 17.57, wholesalePrice: 10.98 },
    '3XL': { price: 20.61, wholesalePrice: 12.88 },
  };

  // Generate different stock numbers based on color to simulate real inventory
  const getStockForColor = (baseStock, colorName) => {
    if (!colorName) return baseStock;

    // Use color name to create consistent but different numbers
    const colorSeed = colorName.toLowerCase().charCodeAt(0) + colorName.length;
    const multiplier = 0.3 + (colorSeed % 100) / 100; // Between 0.3 and 1.3

    return Math.floor(baseStock * multiplier);
  };

  // Base stock numbers
  const baseStocks = {
    XS: 1413,
    S: 866,
    M: 731,
    L: 933,
    XL: 850,
    '2XL': 1269,
    '3XL': 1445,
  };

  // Create color-specific inventory
  const sizes = {};
  Object.keys(baseSizes).forEach((size) => {
    const baseStock = baseStocks[size] || 100;
    const colorStock = getStockForColor(baseStock, color);

    sizes[size] = {
      ...baseSizes[size],
      available: Math.max(0, colorStock), // Ensure no negative stock
    };
  });

  // Mock color data with PLACEHOLDER image URLs
  // NOTE: These are FAKE URLs - we need to get real ones from S&S API
  const availableColors = [
    {
      name: 'Black',
      hex: '#000000',
      available: true,
      colorFrontImage: 'Images/Color/64000_Black_front.jpg', // MOCK
      colorSideImage: 'Images/Color/64000_Black_side.jpg', // MOCK
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      available: true,
      colorFrontImage: 'Images/Color/64000_White_front.jpg',
      colorSideImage: 'Images/Color/64000_White_side.jpg',
    },
    {
      name: 'Navy',
      hex: '#000080',
      available: true,
      colorFrontImage: 'Images/Color/64000_Navy_front.jpg',
      colorSideImage: 'Images/Color/64000_Navy_side.jpg',
    },
    {
      name: 'Red',
      hex: '#FF0000',
      available: true,
      colorFrontImage: 'Images/Color/64000_Red_front.jpg',
      colorSideImage: 'Images/Color/64000_Red_side.jpg',
    },
    {
      name: 'Royal Blue',
      hex: '#4169E1',
      available: true,
      colorFrontImage: 'Images/Color/64000_RoyalBlue_front.jpg',
      colorSideImage: 'Images/Color/64000_RoyalBlue_side.jpg',
    },
    {
      name: 'Forest Green',
      hex: '#228B22',
      available: true,
      colorFrontImage: 'Images/Color/64000_ForestGreen_front.jpg',
      colorSideImage: 'Images/Color/64000_ForestGreen_side.jpg',
    },
    {
      name: 'Maroon',
      hex: '#800000',
      available: true,
      colorFrontImage: 'Images/Color/64000_Maroon_front.jpg',
      colorSideImage: 'Images/Color/64000_Maroon_side.jpg',
    },
    {
      name: 'Purple',
      hex: '#800080',
      available: true,
      colorFrontImage: 'Images/Color/64000_Purple_front.jpg',
      colorSideImage: 'Images/Color/64000_Purple_side.jpg',
    },
  ];

  const response = {
    styleID: parseInt(styleID),
    currentColor: color || null,
    sizes,
    colors: availableColors,
    lastUpdated: new Date().toISOString(),
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response),
  };
};
