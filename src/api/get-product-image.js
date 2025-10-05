// API function to proxy product images from S&S ActiveWear
// This bypasses CORS restrictions by fetching server-side

const https = require('https');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { styleId, styleImage } = req.query;

      if (!styleId && !styleImage) {
    return res.status(400).json({ error: 'Style ID or Style Image path is required' });
  }

  try {
    // Construct the S&S ActiveWear image URL
    let imageUrl;
    if (styleImage) {
      // Use the styleImage field directly (e.g., "Images/Style/39_fm.jpg")
      imageUrl = `https://images.ssactivewear.com/${styleImage}`;
    } else {
      // Fall back to styleId format
      imageUrl = `https://images.ssactivewear.com/Style/${styleId}_fm.jpg`;
    }
    
    console.log('Fetching image:', imageUrl);
    
    // Use https.get instead of fetch for better Node.js compatibility
    https.get(imageUrl, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        console.log('Image not found, status:', response.statusCode);
        return res.status(404).json({ error: 'Image not found' });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      
      // Pipe the image data directly to the response
      response.pipe(res);
      
    }).on('error', (error) => {
      console.error('Error fetching product image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    });
    
  } catch (error) {
    console.error('Error in image proxy:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
