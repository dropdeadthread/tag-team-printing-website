exports.handler = async (event) => {
  // Get the image path from query parameters (set by the redirect)
  const imagePath = event.queryStringParameters?.path || '';

  // TEMPORARY DEBUG: Log what we received and return debug info
  console.log('🔍 ss-images function called with:');
  console.log('📂 Image path:', imagePath);
  console.log('🔍 Query params:', event.queryStringParameters);
  console.log('🔍 Event path:', event.path);

  return {
    statusCode: 200,
    body: JSON.stringify({
      debug: 'ss-images debug mode',
      imagePath: imagePath,
      hasPath: !!imagePath,
      queryParams: event.queryStringParameters,
      eventPath: event.path,
      message: imagePath
        ? `Would fetch: https://www.ssactivewear.com/${imagePath}`
        : 'No path provided',
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };

  /* COMMENTED OUT FOR DEBUG
  // Construct the SSActivewear image URL (using correct domain)
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  try {
    console.log(`Proxying image request: ${imageUrl}`);

    // Fetch the image from SanMar
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.log(`Image not found: ${imageUrl} (${response.status})`);
      return {
        statusCode: 404,
        body: 'Image not found',
      };
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Determine content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

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
    console.error('Error proxying image:', error);
    return {
      statusCode: 500,
      body: 'Error fetching image',
    };
  }
  */
};
