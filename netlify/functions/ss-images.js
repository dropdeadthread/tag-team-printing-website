exports.handler = async (event) => {
  // Debug: Log the entire event to understand what we're receiving
  console.log(
    '🔍 ss-images function called with event:',
    JSON.stringify(
      {
        path: event.path,
        queryStringParameters: event.queryStringParameters,
        headers: event.headers,
        httpMethod: event.httpMethod,
      },
      null,
      2,
    ),
  );

  // Get the image path from query parameters (set by the redirect)
  const imagePath = event.queryStringParameters?.path || '';

  console.log('📂 Extracted image path:', imagePath);

  // If no path provided, return error
  if (!imagePath) {
    console.log('❌ No image path provided in query parameters');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'No image path provided',
        queryParams: event.queryStringParameters,
        path: event.path,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Construct the SSActivewear image URL (using correct domain)
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  try {
    console.log(`🌐 Proxying image request: ${imageUrl}`);

    // Fetch the image from SSActivewear
    const response = await fetch(imageUrl);

    console.log(
      `📊 Response status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      console.log(`🚫 Image not found: ${imageUrl} (${response.status})`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Image not found',
          requestedUrl: imageUrl,
          status: response.status,
          statusText: response.statusText,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Determine content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log(`✅ Successfully proxied image: ${imageUrl} (${contentType})`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
      body: imageBase64,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('💥 Error proxying image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error fetching image',
        message: error.message,
        requestedUrl: imageUrl,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
