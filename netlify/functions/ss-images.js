exports.handler = async (event, context) => {
  console.log(
    'ss-images function called with event:',
    JSON.stringify(event, null, 2),
  );

  // Extract image path from multiple sources
  let imagePath = event.queryStringParameters?.path;

  // If not in query params, try to extract from the URL path
  if (!imagePath && event.path) {
    // Remove /ss-images/ prefix to get the actual path
    const pathMatch = event.path.match(/\/ss-images\/(.+)/);
    if (pathMatch) {
      imagePath = pathMatch[1];
    }
  }

  // If still no path, try rawUrl parsing
  if (!imagePath && event.rawUrl) {
    const urlMatch = event.rawUrl.match(/\/ss-images\/([^?]+)/);
    if (urlMatch) {
      imagePath = urlMatch[1];
    }
  }

  if (!imagePath) {
    console.log('No image path found in any location');
    console.log('Query params:', event.queryStringParameters);
    console.log('Path:', event.path);
    console.log('Raw URL:', event.rawUrl);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'No image path provided',
        queryParams: event.queryStringParameters || {},
        path: event.path || '',
        rawUrl: event.rawUrl || '',
      }),
    };
  }

  console.log('Extracted image path:', imagePath);

  // Construct the SSActivewear URL
  const ssUrl = `https://www.ssactivewear.com/${imagePath}`;
  console.log('Fetching from SSActivewear URL:', ssUrl);

  try {
    // Fetch the image from SSActivewear
    const response = await fetch(ssUrl);
    console.log('SSActivewear response status:', response.status);
    console.log(
      'SSActivewear response headers:',
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      console.error(
        'SSActivewear fetch failed:',
        response.status,
        response.statusText,
      );

      // Try to get error details
      const errorText = await response.text();
      console.error('SSActivewear error response:', errorText);

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Failed to fetch image from SSActivewear',
          status: response.status,
          statusText: response.statusText,
          url: ssUrl,
          imagePath: imagePath,
          errorDetails: errorText,
        }),
      };
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log(
      'Successfully fetched image, size:',
      imageBuffer.byteLength,
      'bytes',
    );
    console.log('Content-Type:', contentType);

    // Return the image
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
      body: Buffer.from(imageBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error fetching image:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        url: ssUrl,
        imagePath: imagePath,
      }),
    };
  }
};
