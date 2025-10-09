const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Get the image path from query parameters
  const imagePath = event.queryStringParameters?.path || '';

  // If no path provided, return error
  if (!imagePath) {
    return {
      statusCode: 400,
      body: 'No image path provided',
    };
  }

  // Construct the SanMar image URL
  const imageUrl = `https://images.ssactivewear.com/${imagePath}`;

  try {
    console.log(`Proxying image request: ${imageUrl}`);

    // Fetch the image from SanMar
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.log(`Image not found: ${imageUrl} (${response.status})`);
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'Image not found',
      };
    }

    // Get the image data
    const imageBuffer = await response.buffer();

    // Determine content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error proxying image:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Error fetching image',
    };
  }
};
