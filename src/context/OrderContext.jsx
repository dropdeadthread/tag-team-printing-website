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

  const setUploadedFilesWithLogging = (files) => {
    setUploadedFiles(files);
  };

  const setSelectedArtworkWithLogging = (artworkUrl) => {
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
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
