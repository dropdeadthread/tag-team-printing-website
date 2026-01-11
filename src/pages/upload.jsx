import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Seo from '../components/SEO';
import {
  validateUploadToken,
  uploadClientFiles,
  getUploadedFiles,
} from '../utils/controlHub';

const UploadContainer = styled.div`
  max-width: 900px;
  margin: 160px auto 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-top: 120px;
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
  text-align: center;

  h1 {
    color: #1f2937;
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
  }

  p {
    color: #6b7280;
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const OrderInfo = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    color: #1f2937;
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    p {
      margin: 0.25rem 0;
      color: #6b7280;

      strong {
        color: #374151;
        display: block;
        margin-bottom: 0.25rem;
      }
    }
  }
`;

const UploadZone = styled.div`
  border: 2px dashed ${(props) => (props.isDragging ? '#3b82f6' : '#d1d5db')};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${(props) => (props.isDragging ? '#eff6ff' : '#f9fafb')};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2rem;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #3b82f6;
  }

  h3 {
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  p {
    color: #6b7280;
    margin: 0 0 1rem 0;
  }

  .file-types {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  input[type='file'] {
    display: none;
  }
`;

const FileList = styled.div`
  margin-top: 1.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 1px solid #e5e7eb;

  .file-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;

    .file-icon {
      font-size: 1.5rem;
    }

    .file-details {
      h4 {
        margin: 0 0 0.25rem 0;
        color: #1f2937;
        font-size: 1rem;
      }

      p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
      }
    }
  }

  .remove-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;

    &:hover {
      background: #dc2626;
    }
  }
`;

const UploadButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const UploadedFilesList = styled.div`
  h3 {
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .upload-stats {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #eff6ff;
    border-radius: 8px;
    margin-bottom: 1rem;

    p {
      margin: 0;
      color: #1e40af;
      font-weight: 600;
    }
  }

  .no-files {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;

  &.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  &.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  &.info {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  div {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ClientUploadPage = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load token from URL and validate
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (!urlToken) {
      setError(
        'No upload token provided. Please check your email for the upload link.',
      );
      setLoading(false);
      return;
    }

    setToken(urlToken);
    validateToken(urlToken);
  }, []);

  const validateToken = async (uploadToken) => {
    try {
      setLoading(true);
      setError('');

      const result = await validateUploadToken(uploadToken);

      if (result.success) {
        setTokenData(result.data.token);
        setOrderData(result.data.order);
        loadUploadedFiles(uploadToken);
      } else {
        setError(result.error || 'Invalid or expired token');
      }
    } catch (err) {
      setError(err.message || 'Failed to validate upload token');
    } finally {
      setLoading(false);
    }
  };

  const loadUploadedFiles = async (uploadToken) => {
    try {
      const result = await getUploadedFiles(uploadToken);
      if (result.success) {
        setUploadedFiles(result.data.files || []);
      }
    } catch (err) {
      console.error('Failed to load uploaded files:', err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const result = await uploadClientFiles(token, selectedFiles);

      if (result.success) {
        setSuccess(
          `Successfully uploaded ${result.data.files.length} file(s)!`,
        );
        setSelectedFiles([]);
        loadUploadedFiles(token);

        // Update token data with new counts
        setTokenData((prev) => ({
          ...prev,
          uploadCount: result.data.uploadCount,
          uploadsRemaining: result.data.uploadsRemaining,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return '🖼️';
    if (['pdf'].includes(ext)) return '📄';
    if (['ai', 'eps', 'psd'].includes(ext)) return '🎨';
    if (['zip', 'rar'].includes(ext)) return '📦';
    return '📎';
  };

  if (loading) {
    return (
      <Layout>
        <Seo title="Upload Files" />
        <UploadContainer>
          <LoadingSpinner>
            <div />
          </LoadingSpinner>
        </UploadContainer>
      </Layout>
    );
  }

  if (error && !tokenData) {
    return (
      <Layout>
        <Seo title="Upload Files" />
        <UploadContainer>
          <Card>
            <Alert className="error">{error}</Alert>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              If you believe this is an error, please contact us at{' '}
              <a
                href="mailto:info@tagteamprints.com"
                style={{ color: '#3b82f6' }}
              >
                info@tagteamprints.com
              </a>
            </p>
          </Card>
        </UploadContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title="Upload Files - Tag Team Printing"
        description="Upload your artwork files for your Tag Team Printing order"
      />
      <UploadContainer>
        <Header>
          <h1>Upload Your Files</h1>
          <p>Upload artwork and design files for your order</p>
        </Header>

        {error && <Alert className="error">{error}</Alert>}
        {success && <Alert className="success">{success}</Alert>}

        {/* Order Information */}
        {orderData && (
          <Card>
            <OrderInfo>
              <h3>Order Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <p>
                    <strong>Order ID</strong>
                    {orderData.orderId}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Customer</strong>
                    {tokenData.customerName}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Status</strong>
                    {orderData.status}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Uploads Remaining</strong>
                    {tokenData.uploadsRemaining} of {tokenData.maxUploads}
                  </p>
                </div>
              </div>
            </OrderInfo>

            {tokenData.uploadsRemaining === 0 && (
              <Alert className="info">
                You have reached the upload limit for this order. If you need to
                upload more files, please contact us.
              </Alert>
            )}

            {/* Upload Zone */}
            {tokenData.uploadsRemaining > 0 && (
              <>
                <UploadZone
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div className="icon">📁</div>
                  <h3>Drag & Drop Files Here</h3>
                  <p>or click to browse</p>
                  <p className="file-types">
                    Supported: JPG, PNG, PDF, AI, PSD, EPS, ZIP (Max 100MB per
                    file)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.svg,.pdf,.ai,.psd,.eps,.zip"
                    onChange={handleFileSelect}
                  />
                </UploadZone>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <FileList>
                    <h3>Selected Files ({selectedFiles.length})</h3>
                    {selectedFiles.map((file, index) => (
                      <FileItem key={index}>
                        <div className="file-info">
                          <span className="file-icon">
                            {getFileIcon(file.name)}
                          </span>
                          <div className="file-details">
                            <h4>{file.name}</h4>
                            <p>{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </button>
                      </FileItem>
                    ))}

                    <UploadButton
                      onClick={handleUpload}
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      {uploading
                        ? 'Uploading...'
                        : `Upload ${selectedFiles.length} File(s)`}
                    </UploadButton>
                  </FileList>
                )}
              </>
            )}
          </Card>
        )}

        {/* Previously Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <UploadedFilesList>
              <h3>Uploaded Files</h3>
              <div className="upload-stats">
                <p>{uploadedFiles.length} file(s) uploaded</p>
                <p>
                  {formatFileSize(
                    uploadedFiles.reduce((sum, f) => sum + f.size, 0),
                  )}
                </p>
              </div>
              {uploadedFiles.map((file, index) => (
                <FileItem key={index}>
                  <div className="file-info">
                    <span className="file-icon">
                      {getFileIcon(file.filename)}
                    </span>
                    <div className="file-details">
                      <h4>{file.filename}</h4>
                      <p>
                        {formatFileSize(file.size)} • Uploaded{' '}
                        {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </FileItem>
              ))}
            </UploadedFilesList>
          </Card>
        )}
      </UploadContainer>
    </Layout>
  );
};

export default ClientUploadPage;
