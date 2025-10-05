// Real artwork upload endpoint using Cloudinary
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (you can also use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'tagteamprinting',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      allowEmptyFiles: false,
      multiples: false,
    });

    const [fields, files] = await form.parse(req);
    const file = files.file ? files.file[0] : null;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload JPG, PNG, GIF, WebP, PDF, or SVG files.' 
      });
    }

    // Upload to Cloudinary with customer artwork settings
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: 'customer-designs',
      resource_type: 'auto', // Handles images, PDFs, etc.
      tags: ['customer-upload', 'artwork'],
      context: {
        original_filename: file.originalFilename,
        uploaded_by: 'customer',
        upload_date: new Date().toISOString()
      },
      transformation: [
        { quality: 'auto:good' }, // Optimize quality
        { fetch_format: 'auto' }   // Auto format selection
      ]
    });

    // Return success response with Cloudinary URL
    res.status(200).json({ 
      success: true, 
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      uploadedAt: uploadResult.created_at
    });

  } catch (error) {
    console.error('Artwork upload error:', error);
    
    // Handle specific error types
    if (error.message.includes('File size too large')) {
      return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    
    if (error.message.includes('Invalid image file')) {
      return res.status(400).json({ error: 'Invalid image file. Please try a different file.' });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'Upload failed. Please try again or contact support.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};