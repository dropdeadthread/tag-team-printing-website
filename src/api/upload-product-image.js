// This is a mock endpoint. In production, use a service like AWS S3, Cloudinary, or similar.
module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // In a real implementation, you'd handle multipart/form-data and save the file.
  res.status(200).json({ success: true, url: '/mock/path/to/image.jpg' });
};