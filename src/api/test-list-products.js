// Simple test API function to debug the 500 error
module.exports = async (req, res) => {
  try {
    const { category } = req.query;

    console.log('Test API called with category:', category);

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    // Test if environment variables are available
    const username = process.env.SNS_API_USERNAME;
    const password = process.env.SNS_API_KEY;

    console.log('Environment check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      username: username ? username.substring(0, 3) + '***' : 'none',
    });

    // Return a simple test response
    return res.status(200).json({
      success: true,
      category: category,
      message: 'Test API working',
      envCheck: { hasUsername: !!username, hasPassword: !!password },
    });
  } catch (error) {
    console.error('Test API error:', error);
    return res.status(500).json({
      error: 'Test API error',
      details: error.message,
      stack: error.stack,
    });
  }
};
