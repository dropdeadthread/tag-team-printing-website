import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const MockupContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
`;

const MockupHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #374151;
`;

const TShirtContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #F9FAFB;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TShirtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

const ArtOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: ${props => props.$hasArtwork ? 'auto' : 'none'};
  z-index: 2;
  cursor: ${props => props.$hasArtwork ? 'move' : 'default'};
  user-select: none;
`;

const ArtImage = styled.img`
  max-width: ${props => {
    switch(props.$printLocation) {
      case 'left-chest': return '60px';
      case 'full-front': return '160px';
      case 'full-back': return '160px';
      default: return '100px';
    }
  }};
  max-height: ${props => {
    switch(props.$printLocation) {
      case 'left-chest': return '60px';
      case 'full-front': return '200px';
      case 'full-back': return '200px';
      default: return '120px';
    }
  }};
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  border-radius: 4px;
  
  /* Support for transparent PNG backgrounds */
  background: transparent;
`;

const PlaceholderArt = styled.div`
  width: ${props => {
    switch(props.$printLocation) {
      case 'left-chest': return '60px';
      case 'full-front': return '160px';
      case 'full-back': return '160px';
      default: return '100px';
    }
  }};
  height: ${props => {
    switch(props.$printLocation) {
      case 'left-chest': return '60px';
      case 'full-front': return '120px';
      case 'full-back': return '120px';
      default: return '80px';
    }
  }};
  border: 2px dashed #9CA3AF;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: #6B7280;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.5rem;
`;

const LocationIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1F2937;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

// T-shirt mockup image mapping
const TSHIRT_MOCKUPS = {
  'white': '/images/white tshirt mockup.png',
  'black': '/images/black tshirt mockup.png',
  'navy': '/images/Navy blue tshirt mockup.png',
  'navy-blue': '/images/Navy blue tshirt mockup.png',
  'red': '/images/red tshirt mockup.png',
  'cardinal-red': '/images/red tshirt mockup.png',
  'royal': '/images/royal blue tshirt mockup.png',
  'royal-blue': '/images/royal blue tshirt mockup.png',
  'forest': '/images/green tshirt mockup.png',
  'forest-green': '/images/green tshirt mockup.png',
  'military-green': '/images/green tshirt mockup.png',
  'yellow': '/images/yellow tshirt mockup.png',
  'gold': '/images/yellow tshirt mockup.png',
  // Fallback colors that will use closest match
  'maroon': '/images/red tshirt mockup.png',
  'burgundy': '/images/red tshirt mockup.png',
  'purple': '/images/royal blue tshirt mockup.png',
  'charcoal': '/images/black tshirt mockup.png',
  'brown': '/images/black tshirt mockup.png',
  'dark green': '/images/green tshirt mockup.png',
  'heather grey': '/images/white tshirt mockup.png'
};

const TShirtMockup = ({ 
  garmentColor = 'white', 
  printLocation = 'full-front',
  artworkUrl = null,
  garmentStyle = 'basic-tee'
}) => {
  const [artPosition, setArtPosition] = useState({ x: '50%', y: '50%' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Debug logging for artwork URL changes
  useEffect(() => {
    console.log('👕 TShirtMockup: artworkUrl changed to:', artworkUrl ? `URL (${artworkUrl.substring(0, 50)}...)` : 'null');
    console.log('👕 TShirtMockup: artworkUrl type:', typeof artworkUrl);
    console.log('👕 TShirtMockup: artworkUrl length:', artworkUrl?.length || 0);
    console.log('👕 TShirtMockup: Will show artwork?', !!artworkUrl);
  }, [artworkUrl]);

  useEffect(() => {
    // Adjust art position based on print location
    switch(printLocation) {
      case 'left-chest':
        setArtPosition({ x: '38%', y: '42%' });
        break;
      case 'full-front':
        setArtPosition({ x: '50%', y: '52%' });
        break;
      case 'full-back':
        setArtPosition({ x: '50%', y: '52%' });
        break;
      default:
        setArtPosition({ x: '50%', y: '50%' });
    }
  }, [printLocation]);

  // Drag handlers for artwork positioning
  const handleMouseDown = useCallback((e) => {
    if (!artworkUrl) return;
    
    setIsDragging(true);
    const artRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - artRect.left - artRect.width / 2,
      y: e.clientY - artRect.top - artRect.height / 2
    });
    e.preventDefault();
  }, [artworkUrl]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - dragOffset.x - rect.left) / rect.width) * 100;
    const y = ((e.clientY - dragOffset.y - rect.top) / rect.height) * 100;
    
    // Keep artwork within bounds
    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(15, Math.min(85, y));
    
    setArtPosition({ x: `${clampedX}%`, y: `${clampedY}%` });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const tshirtMockupSrc = TSHIRT_MOCKUPS[garmentColor?.toLowerCase()] || TSHIRT_MOCKUPS['white'];

  const getLocationLabel = () => {
    switch(printLocation) {
      case 'left-chest': return 'Left Chest';
      case 'full-front': return 'Full Front';
      case 'full-back': return 'Full Back';
      default: return 'Print Location';
    }
  };

  return (
    <MockupContainer>
      <MockupHeader>
        Design Preview
      </MockupHeader>
      
      <TShirtContainer ref={containerRef}>
        {/* Real T-Shirt Mockup Image */}
        <TShirtImage 
          src={tshirtMockupSrc} 
          alt={`${garmentColor} t-shirt mockup`}
        />

        {/* Art Overlay */}
        <ArtOverlay 
          $hasArtwork={!!artworkUrl}
          style={{ 
            left: artPosition.x, 
            top: artPosition.y,
            transform: `translate(-50%, -50%)`,
            opacity: isDragging ? 0.8 : 1
          }}
          onMouseDown={handleMouseDown}
        >
          {artworkUrl ? (
            <ArtImage 
              src={artworkUrl} 
              alt="Design preview" 
              $printLocation={printLocation}
              onLoad={() => console.log('✅ TShirtMockup: Artwork image loaded successfully')}
              onError={(e) => console.error('❌ TShirtMockup: Artwork image failed to load:', e)}
            />
          ) : (
            <PlaceholderArt $printLocation={printLocation}>
              {printLocation === 'left-chest' ? (
                <>📋<br/>Logo</>
              ) : (
                <>🎨<br/>Your Design</>
              )}
            </PlaceholderArt>
          )}
        </ArtOverlay>

        <LocationIndicator>
          {getLocationLabel()}
          {artworkUrl && (
            <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.25rem' }}>
              💡 Drag artwork to reposition
            </div>
          )}
        </LocationIndicator>
      </TShirtContainer>
    </MockupContainer>
  );
};

export default TShirtMockup;
