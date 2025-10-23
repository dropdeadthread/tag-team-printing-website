// Image proxy for S&S Activewear images
// Node 18+ has built-in fetch, but we'll be explicit for clarity

exports.handler = async (event) => {
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
  // If imagePath already has protocol, use it as-is, otherwise prepend domain
  let ssUrl;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    ssUrl = imagePath;
  } else {
    ssUrl = `https://www.ssactivewear.com/${imagePath}`;
  }
  console.log('Fetching from SSActivewear URL:', ssUrl);

  try {
    // Fetch the image from SSActivewear (using Node 18+ built-in fetch)
    // Add headers to appear as a legitimate browser request
    const response = await fetch(ssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.ssactivewear.com/',
        Accept:
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
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
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: ssUrl,
        imagePath: imagePath,
      }),
    };
  }
};
