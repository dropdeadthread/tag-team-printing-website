// Minimal test to isolate S&S API issues
exports.handler = async (event) => {
  try {
    const { styleID = '4502' } = event.queryStringParameters || {};

    // Test environment variables
    const username = process.env.SNS_API_USERNAME;
    const apiKey = process.env.SNS_API_KEY;

    if (!username || !apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'S&S API credentials not configured',
          debug: {
            hasUsername: !!username,
            hasApiKey: !!apiKey,
            usernameLength: username ? username.length : 0,
          },
        }),
      };
    }

    // Test S&S API call
    const authHeader =
      'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
    const headers = {
      Accept: 'application/json',
      Authorization: authHeader,
      'User-Agent': 'TagTeamPrinting/1.0',
    };

    const response = await fetch(
      `https://api-ca.ssactivewear.com/v2/products/?styleid=${styleID}`,
      { headers },
    );

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'S&S API request failed',
          debug: {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          },
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        styleID: styleID,
        productsFound: Array.isArray(data) ? data.length : 0,
        firstProduct:
          Array.isArray(data) && data[0]
            ? {
                styleName: data[0].styleName,
                brandName: data[0].brandName,
                wholesalePrice: data[0].wholesalePrice,
                sizeName: data[0].sizeName,
              }
            : null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
