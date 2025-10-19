exports.handler = async (event) => {
  // Get the image path from query parameters (set by the redirect)
  const imagePath = event.queryStringParameters?.path || '';

  console.log('🔍 ss-images function called with:');
  console.log('📂 Image path:', imagePath);
  console.log('🔍 Query params:', event.queryStringParameters);
  console.log('🔍 Event path:', event.path);

  // If no path provided, return error
  if (!imagePath) {
    console.log('❌ No image path provided');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'No image path provided',
        received: event.queryStringParameters,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Construct the SSActivewear image URL
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  try {
    console.log(`🌐 Fetching image from: ${imageUrl}`);

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
          ssStatus: response.status,
          ssStatusText: response.statusText,
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

    console.log(
      `✅ Successfully proxied image: ${imageUrl} (${contentType}, ${imageBuffer.byteLength} bytes)`,
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
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
