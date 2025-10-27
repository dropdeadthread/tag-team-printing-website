// Ensure fetch is available (Node 18+ has it built-in, Node < 18 needs polyfill)
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  // For Node < 18, use node-fetch from dependencies
  fetch = require('node-fetch');
}

exports.handler = async function (event) {
  try {
    const { styleID, styleName } = event.queryStringParameters || {};

    if (!styleID && !styleName) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'styleID or styleName parameter is required',
        }),
      };
    }

    console.log(
      `get-product API called with styleID: ${styleID}, styleName: ${styleName}`,
    );

    const username = process.env.SNS_API_USERNAME;
    const password = process.env.SNS_API_KEY;
    const basicAuth =
      username && password
        ? Buffer.from(`${username}:${password}`).toString('base64')
        : null;

    if (!basicAuth) {
      console.error('S&S API credentials not available');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'API credentials not configured',
        }),
      };
    }

    // Use S&S API v2/styles endpoint - can search by styleID or styleName
    const filter = styleID || styleName;
    const styleUrl = `https://api-ca.ssactivewear.com/v2/styles/${encodeURIComponent(filter)}`;

    console.log(`Fetching style from S&S API: ${styleUrl}`);
    console.log(`Filter value: "${filter}"`);

    const styleResponse = await fetch(styleUrl, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        Accept: 'application/json',
        'User-Agent': 'TagTeamPrinting/1.0',
      },
    });

    console.log(`S&S API response status: ${styleResponse.status}`);

    if (!styleResponse.ok) {
      console.error(`S&S API style fetch failed: ${styleResponse.status}`);

      // Try to get error details
      let errorBody = '';
      try {
        errorBody = await styleResponse.text();
        console.error(`S&S API error response: ${errorBody}`);
      } catch (e) {
        console.error('Could not read error response body');
      }

      return {
        statusCode: styleResponse.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Product not found in S&S catalog',
          details: `HTTP ${styleResponse.status}`,
          filter: filter,
          url: styleUrl,
          errorBody: errorBody || 'No error body',
        }),
      };
    }

    const styleData = await styleResponse.json();
    console.log(`Received ${styleData.length} style(s) from S&S`);
    console.log(
      `First style:`,
      styleData[0] ? JSON.stringify(styleData[0]).substring(0, 200) : 'none',
    );

    if (!styleData || styleData.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Product not found',
          styleID,
          styleName,
        }),
      };
    }

    const product = styleData[0]; // API returns array
    console.log(`Found product: ${product.title || product.styleName}`);

    // Transform product data to match expected format
    const productData = {
      styleID: product.styleID,
      styleCode: product.styleName,
      styleName: product.styleName,
      partNumber: product.partNumber,
      title: product.title,
      name: product.title,
      description: product.description,
      brand: product.brandName,
      brandName: product.brandName,
      categories: product.categories,
      styleImage: product.styleImage,
      baseCategory: product.baseCategory,
      catalogPageNumber: product.catalogPageNumber,
      newStyle: product.newStyle,
      brandImage: product.brandImage,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
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
