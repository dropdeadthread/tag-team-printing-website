// API route for local development - proxies SSActivewear images
export default async function handler(req, res) {
  // Get the image path from query parameters
  const imagePath = req.query.path || '';

  // If no path provided, return error
  if (!imagePath) {
    return res.status(400).json({ error: 'No image path provided' });
  }

  // Construct the SSActivewear image URL (using correct domain)
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  try {
    console.log(`[LOCAL PROXY] Fetching image: ${imageUrl}`);

    // Fetch the image from SSActivewear
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.log(
        `[LOCAL PROXY] Image not found: ${imageUrl} (${response.status})`,
      );
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Determine content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send the image buffer
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('[LOCAL PROXY] Error fetching image:', error);
    return res.status(500).json({ error: 'Error fetching image' });
  }
}

// Also export Netlify function format for production
exports.handler = async (event) => {
  // Get the image path from query parameters (set by the redirect)
  const imagePath = event.queryStringParameters?.path || '';

  // If no path provided, return error
  if (!imagePath) {
    return {
      statusCode: 400,
      body: 'No image path provided',
    };
  }

  // Construct the SSActivewear image URL (using correct domain)
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  try {
    console.log(`[NETLIFY PROXY] Fetching image: ${imageUrl}`);

    // Fetch the image from SSActivewear
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.log(
        `[NETLIFY PROXY] Image not found: ${imageUrl} (${response.status})`,
      );
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
    console.error('[NETLIFY PROXY] Error proxying image:', error);
    return {
      statusCode: 500,
      body: 'Error fetching image',
    };
  }
};
