import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [printLocation, setPrintLocation] = useState('full-front');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState('gildan5000');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Debug logging for file changes
  const setUploadedFilesWithLogging = (files) => {
    console.log('🔄 OrderContext: setUploadedFiles called with:', files);
    console.log('🔄 OrderContext: files detail:', files.map(f => ({
      name: f.name, 
      hasPreview: !!f.preview,
      previewStartsWith: f.preview ? f.preview.substring(0, 30) : 'no preview',
      id: f.id
    })));
    console.log('🔄 Stack trace for uploadedFiles update:', new Error().stack);
    setUploadedFiles(files);
  };

  // Debug logging for artwork selection
  const setSelectedArtworkWithLogging = (artworkUrl) => {
    console.log('🎨 OrderContext: selectedArtwork changed to:', artworkUrl ? `URL (${artworkUrl.substring(0, 50)}...)` : 'null');
    setSelectedArtwork(artworkUrl);
  };

  const value = {
    selectedColor,
    setSelectedColor,
    printLocation,
    setPrintLocation,
    selectedArtwork,
    setSelectedArtwork: setSelectedArtworkWithLogging,
    selectedGarment,
    setSelectedGarment,
    uploadedFiles,
    setUploadedFiles: setUploadedFilesWithLogging,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
