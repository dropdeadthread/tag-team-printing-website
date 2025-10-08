// Fixed version - CommonJS syntax for Netlify Functions
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    const { styleID } = event.queryStringParameters || {};

    if (!styleID) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'styleID parameter is required' }),
      };
    }

    console.log(`get-product API called with styleID: ${styleID}`);

    // Fetch product data
    const dataUrl = 'https://tagteamprints.com/data/all_styles_raw.json';
    console.log(`Fetching data from: ${dataUrl}`);

    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Loaded ${data.length} total styles`);

    // Find the specific product by styleID
    const product = data.find(
      (item) => item.styleID && item.styleID.toString() === styleID.toString(),
    );

    if (!product) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Product not found',
          styleID: styleID,
        }),
      };
    }

    console.log(`Found product: ${product.title || product.styleName}`);

    // Transform product data
    const productData = {
      styleID: product.styleID,
      styleCode: product.styleName,
      styleName: product.styleName,
      title: product.title,
      name: product.title,
      description: product.description,
      brand: product.brandName,
      brandName: product.brandName,
      categories: product.categories,
      styleImage: product.styleImage,
      baseCategory: product.baseCategory,
      mill: product.mill || null,
      piecesPerCase: product.piecesPerCase || null,
      colors: [], // S&S data doesn't include color variations in simple format
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    };
  } catch (error) {
    console.error('Error in get-product API:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch product',
        details: error.message,
      }),
    };
  }
};
