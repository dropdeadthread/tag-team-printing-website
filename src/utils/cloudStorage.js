// Cloud storage utility for handling file uploads
// Using Cloudinary as the cloud storage provider

const CLOUDINARY_UPLOAD_PRESET = 'tag_team_uploads'; // This needs to be configured in Cloudinary
const CLOUDINARY_CLOUD_NAME = 'tagteamprinting'; // Replace with your Cloudinary cloud name

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<Object>} - Upload result with secure_url, public_id, etc.
 */
export const uploadToCloudinary = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'customer-designs'); // Organize files in folders
  
  // Add tags for better organization
  formData.append('tags', `customer-upload,${file.type.split('/')[0]}`);
  
  // Add context for file metadata
  formData.append('context', `filename=${file.name}|original_size=${file.size}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });
    }
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: response.secure_url,
          publicId: response.public_id,
          resourceType: response.resource_type,
          format: response.format,
          bytes: response.bytes,
          width: response.width,
          height: response.height,
          uploadedAt: response.created_at
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed: Network error'));
    });
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
    xhr.send(formData);
  });
};

/**
 * Alternative: Upload to local server (fallback if Cloudinary is not configured)
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise<Object>} - Upload result
 */
export const uploadToLocalServer = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'design-file');
  formData.append('timestamp', Date.now().toString());

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });
    }
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: response.url,
          filename: response.filename,
          size: response.size,
          uploadedAt: response.uploadedAt
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed: Network error'));
    });
    
    xhr.open('POST', '/api/upload-file');
    xhr.send(formData);
  });
};

/**
 * Main upload function that tries Cloudinary first, falls back to local server
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise<Object>} - Upload result
 */
export const uploadFile = async (file, onProgress = null) => {
  try {
    // Try Cloudinary first
    return await uploadToCloudinary(file, onProgress);
  } catch (cloudinaryError) {
    console.warn('Cloudinary upload failed, falling back to local server:', cloudinaryError);
    
    try {
      // Fallback to local server
      return await uploadToLocalServer(file, onProgress);
    } catch (localError) {
      console.error('All upload methods failed:', localError);
      throw new Error('File upload failed. Please try again or contact support.');
    }
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/delete-cloudinary-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to delete file from Cloudinary:', error);
    return false;
  }
};

/**
 * Get optimized image URL from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options (width, height, format, etc.)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fit',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`
  ].join(',');
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

export default {
  uploadFile,
  uploadToCloudinary,
  uploadToLocalServer,
  deleteFromCloudinary,
  getOptimizedImageUrl
};
