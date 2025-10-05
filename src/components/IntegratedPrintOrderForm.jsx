import React, { useState, useEffect, useCallback } from 'react';
import '../styles/printorderform.css';
import { calculatePrintQuote } from '../helpers/calculatePrintQuote';
import { getMinimumQuantity } from '../config/pricing';

// Helper function to determine if a garment color is dark (needs underbase)
const isDarkGarment = (colorValue) => {
  if (!colorValue) return true; // Default to dark for safety when unknown
  
  // Light colors that don't need underbase
  const lightColors = ['white', 'yellow', 'light-grey', 'light-gray', 'natural', 'cream', 'beige'];
  return !lightColors.includes(colorValue.toLowerCase());
};

const IntegratedPrintOrderForm = ({ 
  preSelectedGarment = null, // { title, price, wholesalePrice, color, size, brandName, styleID }
  isEmbedded = false // Whether this is embedded in a product page or standalone
}) => {
  const [shirtCount, setShirtCount] = useState(15);
  const [numColors, setNumColors] = useState(1);
  const [inkColors, setInkColors] = useState(['']); // Array of ink colors
  const [hasUnderbase, setHasUnderbase] = useState(true);
  const [underbaseOverride, setUnderbaseOverride] = useState(false); // Manual override flag
  const [notes, setNotes] = useState('');
  const [artFile, setArtFile] = useState(null);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState('');

  // New garment source selection
  const [garmentSource, setGarmentSource] = useState(preSelectedGarment ? 'own' : 'recommend');
  const [recommendedColor, setRecommendedColor] = useState('black');
  const [garmentType, setGarmentType] = useState('tee');
  const [warning, setWarning] = useState('');

  // Lock-in logic to prevent mixing garment types
  const checkGarmentCompatibility = useCallback((newType) => {
    if (garmentType !== 'tee' && newType === 'tee') {
      setWarning('⚠️ Cannot mix tees with other garment types in same order. Please submit separate orders.');
      return false;
    }
    if (garmentType === 'tee' && newType !== 'tee') {
      setWarning('⚠️ Cannot mix tees with other garment types in same order. Please submit separate orders.');
      return false;
    }
    setWarning('');
    return true;
  }, [garmentType]);

  // Handle garment source change
  const handleGarmentSourceChange = (source) => {
    setGarmentSource(source);
    if (source === 'recommend') {
      setGarmentType('tee');
      setWarning('');
    }
  };

  // If we have a pre-selected garment, start with notes about it
  useEffect(() => {
    if (preSelectedGarment && notes === '') {
      setNotes(`Print on: ${preSelectedGarment.title} - Size ${preSelectedGarment.size}${preSelectedGarment.color ? `, ${preSelectedGarment.color}` : ''}`);
      // Detect garment type from title
      const title = preSelectedGarment.title.toLowerCase();
      if (title.includes('hoodie')) {
        if (checkGarmentCompatibility('hoodie')) {
          setGarmentType('hoodie');
        }
      } else if (title.includes('tank')) {
        if (checkGarmentCompatibility('tank')) {
          setGarmentType('tank');
        }
      } else {
        if (checkGarmentCompatibility('tee')) {
          setGarmentType('tee');
        }
      }
    }
  }, [preSelectedGarment, notes, checkGarmentCompatibility]);

  // Auto-adjust quantity when color count changes to meet minimums
  useEffect(() => {
    const minimumRequired = getMinimumQuantity(numColors);
    if (shirtCount < minimumRequired) {
      setShirtCount(minimumRequired);
    }
  }, [numColors, shirtCount]);

  // Auto-adjust ink colors array when number of colors changes
  useEffect(() => {
    setInkColors(prev => {
      const newColors = [...prev];
      if (newColors.length < numColors) {
        // Add empty strings for new colors
        while (newColors.length < numColors) {
          newColors.push('');
        }
      } else if (newColors.length > numColors) {
        // Remove extra colors
        newColors.splice(numColors);
      }
      return newColors;
    });
  }, [numColors]);

  // Automatically calculate underbase requirement based on garment and ink colors
  useEffect(() => {
    if (!underbaseOverride) {
      const currentGarmentColor = garmentSource === 'recommend' 
        ? recommendedColor 
        : preSelectedGarment?.color || '';
      
      const isDark = isDarkGarment(currentGarmentColor);
      const validInkColors = inkColors.filter(color => color.trim() !== '');
      
      // Check if only white ink is being used
      const isOnlyWhiteInk = validInkColors.length > 0 && validInkColors.every(color => 
        color.toLowerCase().includes('white') || color.toLowerCase().includes('opaque white')
      );
      
      // Enhanced underbase logic from StreamlinedOrderForm
      let needsUnderbase;
      if (isDark) {
        if (isOnlyWhiteInk && validInkColors.length === 1) {
          // Special case: Single white ink on dark garment doesn't need separate underbase
          needsUnderbase = false;
        } else {
          // Other colors on dark garments need underbase
          needsUnderbase = true;
        }
      } else {
        // Light garments don't need underbase
        needsUnderbase = false;
      }
      
      setHasUnderbase(needsUnderbase);
    }
  }, [garmentSource, recommendedColor, preSelectedGarment?.color, inkColors, numColors, underbaseOverride]);

  // Recalculate quote anytime inputs change
  useEffect(() => {
    const garmentData = garmentSource === 'recommend' 
      ? { 
          garmentColor: recommendedColor,
          garmentWholesalePrice: 2.50 // Gildan 5000 wholesale price
        }
      : preSelectedGarment 
        ? {
            garmentColor: preSelectedGarment.color || '',
            garmentWholesalePrice: preSelectedGarment.wholesalePrice || null
          }
        : {};

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      inkColors: inkColors.filter(color => color.trim() !== ''), // Only non-empty colors
      needsUnderbase: hasUnderbase,
      garmentBrand: preSelectedGarment?.brandName || '',
      garmentStyle: preSelectedGarment?.styleID || '',
      ...garmentData
    });

    if (result.valid) {
      setQuote(result);
      setError('');
    } else {
      setQuote(null);
      setError(result.message);
    }
  }, [shirtCount, numColors, inkColors, hasUnderbase, preSelectedGarment, garmentSource, recommendedColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      garmentColor: preSelectedGarment?.color || '',
      inkColors: inkColors.filter(color => color.trim() !== ''),
      needsUnderbase: hasUnderbase,
      garmentWholesalePrice: preSelectedGarment?.wholesalePrice || null,
      garmentBrand: preSelectedGarment?.brandName || '',
      garmentStyle: preSelectedGarment?.styleID || '',
    });

    if (!result.valid) {
      setError(result.message);
      return;
    }

    setError('');
    setStatus('Submitting...');

    // Prepare form data for backend (including file)
    const formData = new FormData();
    formData.append('shirtCount', shirtCount);
    formData.append('numColors', numColors);
    formData.append('hasUnderbase', hasUnderbase);
    formData.append('notes', notes);
    formData.append('quote', JSON.stringify(result));
    
    // Add pre-selected garment info if available
    if (preSelectedGarment) {
      formData.append('preSelectedGarment', JSON.stringify(preSelectedGarment));
    }

    if (artFile) {
      formData.append('artFile', artFile);
    }

    try {
      const response = await fetch('/api/print-order', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('✅ Print order submitted successfully! We\'ll contact you within 24 hours.');
        // Reset form
        setShirtCount(15);
        setNumColors(1);
        setHasUnderbase(true);
        setNotes(preSelectedGarment ? `Print on: ${preSelectedGarment.title} - Size ${preSelectedGarment.size}${preSelectedGarment.color ? `, ${preSelectedGarment.color}` : ''}` : '');
        setArtFile(null);
      } else {
        setStatus('❌ Error submitting order. Please try again.');
      }
    } catch (error) {
      console.error('Print order submission error:', error);
      setStatus('❌ Error submitting order. Please try again.');
    }
  };

  const formClassName = isEmbedded ? 'print-order-form embedded' : 'print-order-form';

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      {!isEmbedded && (
        <h2>Tag Team Print Quote</h2>
      )}

      {/* Display brand and product info when pre-selected garment is available */}
      {preSelectedGarment && (
        <div className="selected-product-info">
          <h3 style={{ color: '#2563EB', margin: '0 0 0.5rem 0' }}>
            {preSelectedGarment.brandName} - {preSelectedGarment.title}
          </h3>
          {preSelectedGarment.styleID && (
            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              Style: {preSelectedGarment.styleID}
            </p>
          )}
        </div>
      )}

      {/* Garment Source Selection - only show if no pre-selected garment */}
      {!preSelectedGarment && (
        <div className="garment-source-section">
          <h3>Choose Your Garments</h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="recommend"
                checked={garmentSource === 'recommend'}
                onChange={() => handleGarmentSourceChange('recommend')}
              />
              <span>Recommend a standard tee (Gildan 5000)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="own"
                checked={garmentSource === 'own'}
                onChange={() => handleGarmentSourceChange('own')}
              />
              <span>I'll choose my own blanks from your catalog</span>
            </label>
          </div>

          {/* Recommended Tee Options */}
          {garmentSource === 'recommend' && (
            <div className="recommended-options">
              <h4>Gildan 5000 - Heavy Cotton T-Shirt</h4>
              <p className="garment-description">
                Pre-shrunk 100% cotton, classic fit. Perfect for most print jobs.
              </p>
              <label>
                Choose Color:
                <select 
                  value={recommendedColor} 
                  onChange={(e) => setRecommendedColor(e.target.value)}
                  className="color-selector"
                >
                  <option value="black">⚫ Black</option>
                  <option value="white">⚪ White</option>
                </select>
              </label>
              <div className="price-preview">
                Estimated garment cost: $6.25 each
              </div>
            </div>
          )}

          {/* Own Blanks Notice */}
          {garmentSource === 'own' && (
            <div className="own-blanks-notice">
              <p>✨ Browse our <a href="/categories">catalog</a> to select your garments first.</p>
              <p>Then return here to get your print quote. Garment costs will be calculated separately.</p>
            </div>
          )}
        </div>
      )}

      {warning && (
        <div className="warning-box">
          {warning}
        </div>
      )}

      {preSelectedGarment && (
        <div className="selected-garment-info">
          <h4>Selected Garment:</h4>
          <p>{preSelectedGarment.title} - Size {preSelectedGarment.size}</p>
          {preSelectedGarment.color && <p>Color: {preSelectedGarment.color}</p>}
          <p>Garment Cost: ${preSelectedGarment.price} each</p>
        </div>
      )}

      <label>
        Total items to be printed
        <span className="info-tooltip" title={`MINIMUM ORDER REQUIREMENTS: We require higher minimums for complex prints to justify screen setup costs. 1 color = 15 shirts minimum, 2 colors = 20 shirts, 3 colors = 30 shirts, 4 colors = 40 shirts, 5 colors = 50 shirts, 6 colors = 60 shirts. Each additional color requires more time, materials, and screen preparation.`}>❓</span>
        <input
          type="number"
          min={getMinimumQuantity(numColors)}
          value={shirtCount}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            const minimum = getMinimumQuantity(numColors);
            setShirtCount(Math.max(minimum, newValue || minimum));
          }}
        />
        <small style={{ display: 'block', marginTop: '4px', color: '#666', fontSize: '0.9rem' }}>
          Minimum: {getMinimumQuantity(numColors)} shirts for {numColors} color{numColors > 1 ? 's' : ''}
        </small>
      </label>

      <label>
        How many print colors?
        <span className="info-tooltip" title={`SCREEN PRINTING COLORS: Each ink color requires a separate screen ($30 each). Our 6-color press can handle up to 6 different inks. Higher color counts mean more complex registration, longer setup times, and higher minimums to cover equipment costs. Underbase may add +1 screen if printing on dark garments.`}>❓</span>
        <select value={numColors} onChange={(e) => setNumColors(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} color{n > 1 ? 's' : ''} (min: {getMinimumQuantity(n)} shirts)
            </option>
          ))}
        </select>
      </label>

      {/* Ink Colors Section */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="ink-colors-section" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Ink Colors
          <span className="info-tooltip" title={`INK COLOR SPECIFICATIONS: List each ink color for accurate pricing. WHITE INK ON DARK GARMENTS: White ink has excellent opacity and doesn't require an underbase screen, saving you $30. COLORED INKS ON DARK GARMENTS: Colors like red, yellow, blue need a white underbase to show properly, adding 1 screen. LIGHT GARMENTS: No underbase needed regardless of ink color.`}>❓</span>
        </label>
        <div id="ink-colors-section">
        {inkColors.map((color, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder={`Color ${index + 1} (e.g., White, Yellow, Red)`}
              value={color}
              onChange={(e) => {
                const newColors = [...inkColors];
                newColors[index] = e.target.value;
                setInkColors(newColors);
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        ))}
        </div>
      </div>

      <label className="toggle-option">
        <input
          type="checkbox"
          checked={hasUnderbase}
          onChange={() => {
            setHasUnderbase(!hasUnderbase);
            setUnderbaseOverride(true); // User is manually overriding
          }}
        />
        Include White Underbase 
        {!underbaseOverride && (
          <span className="auto-calculated">(Auto-calculated)</span>
        )}
        {underbaseOverride && (
          <span className="manual-override">(Manual override)</span>
        )}
        <span className="info-tooltip" title={`ENHANCED UNDERBASE LOGIC: Automatically calculated based on garment and ink colors. Dark garments (black, navy, etc.) with colored inks need white underbase for proper color vibrancy. Single white ink on dark garments doesn't need separate underbase. Light garments never need underbase. You can override our calculation if needed.`}>❓</span>
      </label>

      {underbaseOverride && (
        <button 
          type="button" 
          className="reset-auto"
          onClick={() => {
            setUnderbaseOverride(false);
            // Auto-calculation will trigger via useEffect
          }}
        >
          Reset to Auto-Calculate
        </button>
      )}

      <label>
        Upload Artwork (.png, .ai, .psd, .pdf)
        <input
          type="file"
          accept=".png,.ai,.psd,.pdf"
          onChange={(e) => setArtFile(e.target.files[0])}
        />
      </label>

      <label>
        Additional Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Mention color swaps, print location, or garment color breakdown."
        />
      </label>

      {error && <p className="error">{error}</p>}

      {quote && (
        <div className="quote-box">
          <h3>Estimated Quote</h3>
          <div className="quote-breakdown">
            <p>Garments ({quote.garmentQty} × ${quote.garmentCostPerShirt}): ${(quote.garmentQty * quote.garmentCostPerShirt).toFixed(2)}</p>
            <p>Printing ({quote.garmentQty} × ${(quote.printingCostPerShirt - quote.garmentCostPerShirt).toFixed(2)}): ${(quote.garmentQty * (quote.printingCostPerShirt - quote.garmentCostPerShirt)).toFixed(2)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Set-up Fees ({quote.screenBreakdown})</span>
              <span className="info-tooltip" title="First setup fee is waived—first one is on us!">6c8</span>
            </div>
            <div style={{ marginLeft: 16, color: '#059669' }}>
              Waived: $0 (first one is on us!)
            </div>
            <div style={{ marginLeft: 16 }}>
              Remaining setup fees: ${quote.setupTotal - 30 > 0 ? (quote.setupTotal - 30).toFixed(2) : '0.00'}
            </div>
            <p>Subtotal: ${quote.subtotal}</p>
            <p>Tax (HST): ${(quote.totalWithTax - quote.subtotal).toFixed(2)}</p>
            <p className="grand-total">Total: ${quote.totalWithTax}</p>
          </div>
        </div>
      )}

      <label className="confirm-box">
        <input type="checkbox" required />
        I confirm the above details and understand minimums apply.
      </label>

      <button type="submit" disabled={!quote}>
        Submit Print Order
      </button>
      
      {status && <p className="status">{status}</p>}
    </form>
  );
};

export default IntegratedPrintOrderForm;
