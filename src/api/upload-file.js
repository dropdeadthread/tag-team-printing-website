// Local file upload endpoint as fallback for Cloudinary
// This handles file uploads when Cloudinary is unavailable
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB limit
      allowEmptyFiles: false,
      multiples: false,
      uploadDir: path.join(process.cwd(), 'static', 'uploads'),
      keepExtensions: true,
    });

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    const file = files.file ? files.file[0] : null;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Clean up uploaded file
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload JPG, PNG, GIF, WebP, PDF, or SVG files.' 
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.originalFilename || '');
    const filename = `artwork_${timestamp}${extension}`;
    const finalPath = path.join(uploadsDir, filename);

    // Move file to final location
    fs.renameSync(file.filepath, finalPath);

    // Return success response with local URL
    const publicUrl = `/uploads/${filename}`;
    
    res.status(200).json({ 
      success: true, 
      url: publicUrl,
      publicId: filename,
      resourceType: file.mimetype.startsWith('image/') ? 'image' : 'raw',
      format: extension.replace('.', ''),
      bytes: file.size,
      uploadedAt: new Date().toISOString(),
      message: 'File uploaded to local server (Cloudinary fallback)'
    });

  } catch (error) {
    console.error('Local file upload error:', error);
    
    // Handle specific error types
    if (error.message.includes('maxFileSize exceeded')) {
      return res.status(413).json({ error: 'File too large. Maximum size is 25MB.' });
    }
    
    // Generic error response
    res.status(500).json({ 
      error: 'Upload failed. Please try again or contact support.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};