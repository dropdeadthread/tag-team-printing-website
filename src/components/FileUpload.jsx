import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin: 1rem 0;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragActive ? '#2563EB' : '#D1D5DB'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDragActive ? '#EFF6FF' : '#F9FAFB'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2563EB;
    background: #EFF6FF;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.$isDragActive ? '#2563EB' : '#6B7280'};
`;

const UploadText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$isDragActive ? '#2563EB' : '#374151'};
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.9rem;
  color: #6B7280;
  margin-bottom: 1rem;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: white;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const FilePreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6B7280;
`;

const FilePreviewImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 0.75rem;
  
  /* Support for transparent PNG backgrounds */
  background: transparent;
  
  /* Add a subtle checkerboard pattern for file previews to show transparency */
  background-image: 
    linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.1) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.1) 75%);
  background-size: 4px 4px;
  background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #F9FAFB;
  }
  
  &.remove {
    color: #DC2626;
    border-color: #FCA5A5;
    
    &:hover {
      background: #FEF2F2;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #10B981;
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ErrorMessage = styled.div`
  color: #DC2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 4px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSizeMB = 10,
  acceptedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.ai', '.eps', '.svg', '.psd'],
  label = "Upload Design Files"
}) => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Prevent default drag behaviors on document to stop browser from opening files in new tab
  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners to document
    ['dragenter', 'dragover', 'dragleave'].forEach(eventName => {
      document.addEventListener(eventName, preventDefaults, false);
    });
    document.addEventListener('drop', handleDocumentDrop, false);

    // Cleanup
    return () => {
      ['dragenter', 'dragover', 'dragleave'].forEach(eventName => {
        document.removeEventListener(eventName, preventDefaults, false);
      });
      document.removeEventListener('drop', handleDocumentDrop, false);
    };
  }, []);

  const validateFile = useCallback((file) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`File type "${fileExtension}" is not supported.`);
    }
    
    return errors;
  }, [maxSizeMB, acceptedTypes]);

  const simulateUpload = useCallback((fileId) => {
    // This would be replaced with actual cloud upload logic
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, uploadProgress: 100, uploaded: true }
            : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, uploadProgress: progress }
            : f
        ));
      }
    }, 200);
  }, [setFiles]);

  const processFiles = useCallback((fileList) => {
    console.log('📁 processFiles called with:', fileList);
    console.log('📁 Files array length:', fileList.length);
    console.log('📁 Current state files:', files.length);
    
    const newFiles = Array.from(fileList);
    const allErrors = [];
    const validFiles = [];

    // Check total file count
    if (files.length + newFiles.length > maxFiles) {
      allErrors.push(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
      setErrors(allErrors);
      return;
    }

    newFiles.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        allErrors.push(...fileErrors);
      } else {
        const fileWithMetadata = {
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null,
          uploadProgress: 0,
          uploaded: false,
          error: null
        };

        // Create preview for images
        if (file.type.startsWith('image/')) {
          console.log('📷 Creating preview for image:', file.name, file.type);
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log('✅ Preview created for:', file.name, 'Preview URL length:', e.target.result?.length);
            setFiles(prev => {
              const updated = prev.map(f => 
                f.id === fileWithMetadata.id 
                  ? { ...f, preview: e.target.result }
                  : f
              );
              console.log('📂 Updated files with preview:', updated.map(f => ({ name: f.name, hasPreview: !!f.preview })));
              
              // IMPORTANT: Call onFilesChange with the updated files that include previews
              console.log('🔄 Calling onFilesChange with updated files (including previews)');
              onFilesChange?.(updated);
              
              return updated;
            });
          };
          reader.onerror = (error) => {
            console.error('❌ FileReader error for:', file.name, error);
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(fileWithMetadata);
      }
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
    } else {
      setErrors([]);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      console.log('📁 Files updated:', updatedFiles.map(f => ({name: f.name, hasPreview: !!f.preview})));
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      
      // Simulate upload progress for now
      validFiles.forEach((fileWithMetadata) => {
        simulateUpload(fileWithMetadata.id);
      });
    }
  }, [files, maxFiles, validateFile, onFilesChange, simulateUpload]);

  const removeFile = useCallback((fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  }, [files, onFilesChange]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = useCallback((file) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.name.toLowerCase().includes('.ai')) return '🎨';
    if (file.name.toLowerCase().includes('.psd')) return '🎨';
    return '📎';
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔥 Drag enter detected');
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log('🔥 Drag leave detected');
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Ensure drag effect is correct
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔥 Drop detected, files:', e.dataTransfer.files.length);
    setIsDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e) => {
    console.log('📂 File input changed:', e.target.files.length, 'files');
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow re-selecting same file
    e.target.value = '';
  }, [processFiles]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <UploadContainer>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
        {label}
      </label>
      
      <DropZone
        $isDragActive={isDragActive}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon $isDragActive={isDragActive}>
          📁
        </UploadIcon>
        <UploadText $isDragActive={isDragActive}>
          {isDragActive ? 'Drop files here' : 'Drag & drop your design files here'}
        </UploadText>
        <UploadSubtext>
          or click to browse files
        </UploadSubtext>
        <UploadSubtext>
          Supports: {acceptedTypes.join(', ')} • Max {maxSizeMB}MB each • Up to {maxFiles} files
        </UploadSubtext>
      </DropZone>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
      />

      {errors.length > 0 && (
        <ErrorMessage>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </ErrorMessage>
      )}

      {files.length > 0 && (
        <FileList>
          {files.map((fileData) => (
            <FileItem key={fileData.id}>
              <FileInfo>
                {fileData.preview ? (
                  <FilePreviewImage src={fileData.preview} alt={fileData.name} />
                ) : (
                  <FilePreview>
                    {getFileIcon(fileData)}
                  </FilePreview>
                )}
                <FileDetails>
                  <FileName>{fileData.name}</FileName>
                  <FileSize>{formatFileSize(fileData.size)}</FileSize>
                  {!fileData.uploaded && fileData.uploadProgress > 0 && (
                    <ProgressBar>
                      <ProgressFill $progress={fileData.uploadProgress} />
                    </ProgressBar>
                  )}
                  {fileData.uploaded && (
                    <div style={{ color: '#10B981', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      ✅ Uploaded
                    </div>
                  )}
                </FileDetails>
              </FileInfo>
              <FileActions>
                <ActionButton className="remove" onClick={() => removeFile(fileData.id)}>
                  Remove
                </ActionButton>
              </FileActions>
            </FileItem>
          ))}
        </FileList>
      )}
    </UploadContainer>
  );
};

export default FileUpload;
