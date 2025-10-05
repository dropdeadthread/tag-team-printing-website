import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StreamlinedOrderForm from "../components/StreamlinedOrderForm";
import TShirtMockup from "../components/TShirtMockup";
import FileUpload from "../components/FileUpload";
import { OrderProvider, useOrder } from "../context/OrderContext";
import styled from "styled-components";

const OrderContainer = styled.div`
  background: none;
  min-height: 100vh;
  padding: 8rem 2rem 2rem 2rem;
  position: relative;
  
  /* Remove the translucent overlay */
  &::before {
    display: none;
  }
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const PricingSection = styled.div`
  border: none;
  position: relative;
  overflow: hidden;
  transform: none;
`;

const PricingHeader = styled.div`
  background: #2563EB;
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: url('/images/torn-tape-rougher.png') repeat-x;
    background-size: auto 100%;
  }
`;

const PricingTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 3px 3px 0px #000;
  transform: scaleY(1.2);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PricingContent = styled.div`
  padding: 1.5rem;
  background: rgba(255,245,209,0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PricingImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  border: 2px solid #2563EB;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
  }
`;

// Modal overlay for enlarged image
const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

const EnlargedImage = styled.img`
  max-width: 95vw;
  max-height: 95vh;
  width: auto;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  cursor: default;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const ImageHint = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #374151;
  pointer-events: none;
`;

const FormSection = styled.div`
  border: none;
  position: relative;
  overflow: hidden;
  transform: none;
`;

const FormHeader = styled.div`
  background: #2563EB;
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: url('/images/torn-tape-rougher.png') repeat-x;
    background-size: auto 100%;
  }
`;

const FormTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 3px 3px 0px #000;
  transform: scaleY(1.2);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FormContent = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 0 0 12px 12px;
  min-height: 400px;
`;

const MockupSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255,245,209,0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 2px solid #2563EB;
`;

const MockupTitle = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  color: #2563EB;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0px #000;
`;

const MockupNote = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6B7280;
  text-align: center;
  font-style: italic;
`;

const FileUploadSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #E5E7EB;
`;

const FileUploadTitle = styled.h4`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  color: #2563EB;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0px #000;
`;

const ConnectedMockup = () => {
  const { selectedColor, printLocation, selectedArtwork, uploadedFiles, setSelectedArtwork, setUploadedFiles } = useOrder();
  
  // Debug logging for uploaded files
  useEffect(() => {
    console.log('🖼️ ConnectedMockup: uploadedFiles changed:', uploadedFiles.map(f => ({
      name: f.name,
      hasPreview: !!f.preview,
      previewLength: f.preview?.length || 0
    })));
  }, [uploadedFiles]);

  // Debug logging for selected artwork
  useEffect(() => {
    console.log('🎨 ConnectedMockup: selectedArtwork changed to:', selectedArtwork ? `URL (${selectedArtwork.substring(0, 50)}...)` : 'null');
  }, [selectedArtwork]);

  // Auto-select first uploaded file with preview for testing
  useEffect(() => {
    console.log('🚀 Auto-selection check: uploadedFiles.length =', uploadedFiles.length, 'selectedArtwork =', selectedArtwork ? 'has artwork' : 'null');
    console.log('🚀 All files:', uploadedFiles.map(f => ({ name: f.name, hasPreview: !!f.preview, previewLength: f.preview?.length })));
    
    if (uploadedFiles.length > 0) {
      const filesWithPreviews = uploadedFiles.filter(f => f.preview);
      console.log('🚀 Files with previews:', filesWithPreviews.length);
      
      if (filesWithPreviews.length > 0 && !selectedArtwork) {
        const firstFile = filesWithPreviews[0];
        console.log('🚀 Auto-selecting first uploaded file for testing:', firstFile.name);
        console.log('🚀 Preview URL starts with:', firstFile.preview.substring(0, 50));
        console.log('🚀 About to call setSelectedArtwork...');
        setSelectedArtwork(firstFile.preview);
      }
    }
  }, [uploadedFiles, selectedArtwork, setSelectedArtwork]);
  
  return (
    <MockupSection>
      <MockupTitle>Live Preview</MockupTitle>
      <TShirtMockup 
        garmentColor={selectedColor}
        printLocation={printLocation}
        artworkUrl={selectedArtwork}
        garmentStyle="basic-tee"
      />
      
      {uploadedFiles.length > 0 && uploadedFiles.some(f => f.preview) && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
            📂 Click to Select Artwork
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            Click any file below to preview it on the t-shirt:
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
            {uploadedFiles.filter(f => f.preview).map((file, index) => {
              return (
                <button 
                  key={file.id || index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    border: selectedArtwork === file.preview ? '2px solid #2563EB' : '1px solid #E5E7EB',
                    background: selectedArtwork === file.preview ? '#EBF8FF' : '#F9FAFB',
                    padding: '0.75rem',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedArtwork === file.preview ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedArtwork !== file.preview) {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.backgroundColor = '#F3F4F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedArtwork !== file.preview) {
                      e.target.style.borderColor = '#E5E7EB';
                      e.target.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onClick={() => {
                    console.log('🖱️ Clicked artwork file:', file.name);
                    console.log('🖱️ File preview URL:', file.preview ? `URL (${file.preview.substring(0, 50)}...)` : 'no preview');
                    console.log('🖱️ Setting selectedArtwork to:', file.preview);
                    setSelectedArtwork(file.preview);
                  }}
                >
                  <span style={{ 
                    marginRight: '0.75rem',
                    color: selectedArtwork === file.preview ? '#2563EB' : '#6B7280',
                    fontSize: '1.2rem'
                  }}>
                    {selectedArtwork === file.preview ? '✓' : 'Select'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: selectedArtwork === file.preview ? '#2563EB' : '#374151',
                      fontSize: '0.85rem',
                      fontWeight: selectedArtwork === file.preview ? '600' : '500'
                    }}>
                      {file.name}
                    </div>
                    <div style={{
                      color: selectedArtwork === file.preview ? '#60A5FA' : '#6B7280',
                      fontSize: '0.7rem',
                      marginTop: '0.25rem'
                    }}>
                      {selectedArtwork === file.preview ? 'Selected for preview' : 'Click to preview on t-shirt'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* File Upload Section */}
      <FileUploadSection>
        <FileUploadTitle>📁 Upload Artwork</FileUploadTitle>
        <FileUpload
          maxFiles={10}
          maxSizeMB={25}
          acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf', '.ai', '.eps', '.svg', '.psd']}
          onFilesChange={setUploadedFiles}
        />
      </FileUploadSection>
      
      <MockupNote>
        {uploadedFiles.some(f => f.preview) 
          ? "Click artwork files above to preview on t-shirt" 
          : "Upload artwork files to see them on the t-shirt!"
        }
      </MockupNote>
    </MockupSection>
  );
};

const OrderPage = () => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const handleImageClick = () => {
    setIsImageEnlarged(true);
  };

  const handleModalClose = () => {
    setIsImageEnlarged(false);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsImageEnlarged(false);
      }
    };

    if (isImageEnlarged) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageEnlarged]);

  return (
    <Layout>
      <OrderProvider>
        <OrderContainer>
          <OrderGrid>
            <PricingSection>
              <PricingHeader>
                <PricingTitle>Pricing Guide</PricingTitle>
              </PricingHeader>
              <PricingContent>
                {/* T-Shirt Mockup Section */}
                <ConnectedMockup />

                <PricingImage 
                  src="/images/Screen Printing Price Sales Sheet TAG TEAM PRINTING.png"
                  alt="Screen Printing Price Sheet - Tag Team Printing"
                  onClick={handleImageClick}
                  title="Click to enlarge pricing guide"
                />
              </PricingContent>
            </PricingSection>
            
            <FormSection>
              <FormHeader>
                <FormTitle>Quick Order</FormTitle>
              </FormHeader>
              <FormContent>
                <StreamlinedOrderForm />
              </FormContent>
            </FormSection>
          </OrderGrid>
        </OrderContainer>

        {/* Image Modal */}
        <ImageModal $isOpen={isImageEnlarged} onClick={handleModalClose}>
          <CloseButton onClick={handleModalClose} title="Close (ESC)">
            ×
          </CloseButton>
          <EnlargedImage 
            src="/images/Screen Printing Price Sales Sheet TAG TEAM PRINTING.png"
            alt="Screen Printing Price Sheet - Tag Team Printing (Enlarged)"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          />
          <ImageHint>Click outside image or press ESC to close</ImageHint>
        </ImageModal>
      </OrderProvider>
    </Layout>
  );
};

export default OrderPage;