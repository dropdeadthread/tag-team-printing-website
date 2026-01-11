import React, { useState, useEffect, useCallback } from 'react';
import '../styles/printorderform.css';
import { calculatePrintQuote } from '../helpers/calculatePrintQuote';

// Inline pricing function to avoid ES module SSR issues
const getMinimumQuantity = (colorCount) => {
  switch (colorCount) {
    case 1:
      return 15;
    case 2:
      return 20;
    case 3:
      return 30;
    case 4:
      return 40;
    case 5:
      return 50;
    case 6:
      return 60;
    default:
      return 15;
  }
};

// Helper function to determine if a garment color is dark (needs underbase)
const isDarkGarment = (colorValue) => {
  if (!colorValue) return true; // Default to dark for safety when unknown

  // Light colors that don't need underbase
  const lightColors = [
    'white',
    'yellow',
    'light-grey',
    'light-gray',
    'natural',
    'cream',
    'beige',
  ];
  return !lightColors.includes(colorValue.toLowerCase());
};

const IntegratedPrintOrderForm = ({
  preSelectedGarment = null, // { title, price, wholesalePrice, color, size, brandName, styleID, baseCategory }
  isEmbedded = false, // Whether this is embedded in a product page or standalone
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
  const [garmentSource, setGarmentSource] = useState(
    preSelectedGarment ? 'own' : 'recommend',
  );
  const [recommendedColor, setRecommendedColor] = useState('black');
  const [garmentType, setGarmentType] = useState('tee');
  const [warning, setWarning] = useState('');

  // Add-ons state
  const [addOns, setAddOns] = useState({
    backPrint: false,
    neckTag: false,
    sleeve: false,
    other: false,
  });

  const [addOnInkColors, setAddOnInkColors] = useState({
    backPrint: [],
    neckTag: [],
    sleeve: [],
    other: [],
  });

  const [addOnColorCounts, setAddOnColorCounts] = useState({
    backPrint: 1,
    neckTag: 1,
    sleeve: 1,
    other: 1,
  });

  // Check if current product is headwear (exclude add-ons for headwear)
  const isHeadwear =
    preSelectedGarment?.baseCategory?.toLowerCase().includes('headwear') ||
    preSelectedGarment?.baseCategory?.toLowerCase().includes('hat') ||
    false;

  // Add-on color limits (max colors per location)
  const ADD_ON_COLOR_LIMITS = {
    backPrint: 6,
    neckTag: 1,
    sleeve: 1,
    other: 2,
  };

  // Track which add-ons are expanded
  const [expandedAddOns, setExpandedAddOns] = useState({
    backPrint: false,
    neckTag: false,
    sleeve: false,
    other: false,
  });

  // Lock-in logic to prevent mixing garment types
  const checkGarmentCompatibility = useCallback(
    (newType) => {
      if (garmentType !== 'tee' && newType === 'tee') {
        setWarning(
          '⚠️ Cannot mix tees with other garment types in same order. Please submit separate orders.',
        );
        return false;
      }
      if (garmentType === 'tee' && newType !== 'tee') {
        setWarning(
          '⚠️ Cannot mix tees with other garment types in same order. Please submit separate orders.',
        );
        return false;
      }
      setWarning('');
      return true;
    },
    [garmentType],
  );

  // Handle add-on toggle
  const handleAddOnToggle = (addOnKey) => {
    const newValue = !addOns[addOnKey];
    setAddOns({
      ...addOns,
      [addOnKey]: newValue,
    });

    // If enabling, expand the add-on; if disabling, collapse and clear colors
    if (newValue) {
      setExpandedAddOns({
        ...expandedAddOns,
        [addOnKey]: true,
      });
    } else {
      setExpandedAddOns({
        ...expandedAddOns,
        [addOnKey]: false,
      });
      setAddOnInkColors({
        ...addOnInkColors,
        [addOnKey]: [],
      });
      // Reset color count to 1
      setAddOnColorCounts({
        ...addOnColorCounts,
        [addOnKey]: 1,
      });
    }
  };

  // Handle add-on color count change
  const handleAddOnColorCountChange = (addOnKey, newCount) => {
    setAddOnColorCounts({
      ...addOnColorCounts,
      [addOnKey]: newCount,
    });

    // Clear selected colors if new count is less than currently selected
    if (addOnInkColors[addOnKey].length > newCount) {
      setAddOnInkColors({
        ...addOnInkColors,
        [addOnKey]: addOnInkColors[addOnKey].slice(0, newCount),
      });
    }
  };

  // Handle add-on ink color selection
  const handleAddOnColorChange = (addOnKey, index, value) => {
    const currentColors = addOnInkColors[addOnKey] || [];
    const newColors = [...currentColors];
    newColors[index] = value;
    setAddOnInkColors({
      ...addOnInkColors,
      [addOnKey]: newColors,
    });
  };

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
      setNotes(
        `Print on: ${preSelectedGarment.title} - Size ${preSelectedGarment.size}${preSelectedGarment.color ? `, ${preSelectedGarment.color}` : ''}`,
      );
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
    setInkColors((prev) => {
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
      const currentGarmentColor =
        garmentSource === 'recommend'
          ? recommendedColor
          : preSelectedGarment?.color || '';

      const isDark = isDarkGarment(currentGarmentColor);
      const validInkColors = inkColors.filter((color) => color.trim() !== '');

      // Check if only white ink is being used
      const isOnlyWhiteInk =
        validInkColors.length > 0 &&
        validInkColors.every(
          (color) =>
            color.toLowerCase().includes('white') ||
            color.toLowerCase().includes('opaque white'),
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
  }, [
    garmentSource,
    recommendedColor,
    preSelectedGarment?.color,
    inkColors,
    numColors,
    underbaseOverride,
  ]);

  // Recalculate quote anytime inputs change
  useEffect(() => {
    const garmentData =
      garmentSource === 'recommend'
        ? {
            garmentColor: recommendedColor,
            garmentWholesalePrice: 2.5, // Gildan 5000 wholesale price
          }
        : preSelectedGarment
          ? {
              garmentColor: preSelectedGarment.color || '',
              garmentWholesalePrice: preSelectedGarment.wholesalePrice || null,
            }
          : {};

    // Calculate total setup fees: main print + all active add-ons
    let totalSetupFees = numColors * 30; // Main print setup
    if (hasUnderbase) {
      totalSetupFees += 30; // Underbase screen
    }

    // Add setup fees for each active add-on location (only if not headwear)
    if (!isHeadwear) {
      Object.keys(addOns).forEach((addOnKey) => {
        if (addOns[addOnKey]) {
          totalSetupFees += addOnColorCounts[addOnKey] * 30;
        }
      });
    }

    // Count active add-ons as additional locations (only if not headwear)
    const activeAddOns =
      !isHeadwear && Object.values(addOns).filter(Boolean).length;
    const totalLocations = 1 + (activeAddOns || 0);

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      locationCount: totalLocations,
      inkColors: inkColors.filter((color) => color.trim() !== ''), // Only non-empty colors
      needsUnderbase: hasUnderbase,
      garmentBrand: preSelectedGarment?.brandName || '',
      garmentStyle: preSelectedGarment?.styleID || '',
      ...garmentData,
    });

    if (result.valid) {
      // Override the setup total with our correctly calculated value
      result.setupTotal = totalSetupFees;

      // Recalculate subtotal and total with correct setup fees
      const garmentTotal = shirtCount * result.garmentCostPerShirt;
      const printingTotal = result.printingTotal || 0;
      const subtotal = garmentTotal + totalSetupFees + printingTotal;
      const tax = subtotal * 0.13;
      const totalWithTax = subtotal + tax;

      result.subtotal = subtotal.toFixed(2);
      result.totalWithTax = totalWithTax.toFixed(2);

      setQuote(result);
      setError('');
    } else {
      setQuote(null);
      setError(result.message);
    }
  }, [
    shirtCount,
    numColors,
    inkColors,
    hasUnderbase,
    preSelectedGarment,
    garmentSource,
    recommendedColor,
    addOns,
    addOnColorCounts,
    isHeadwear,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate total setup fees: main print + all active add-ons
    let totalSetupFees = numColors * 30; // Main print setup
    if (hasUnderbase) {
      totalSetupFees += 30; // Underbase screen
    }

    // Add setup fees for each active add-on location (only if not headwear)
    if (!isHeadwear) {
      Object.keys(addOns).forEach((addOnKey) => {
        if (addOns[addOnKey]) {
          totalSetupFees += addOnColorCounts[addOnKey] * 30;
        }
      });
    }

    // Count active add-ons as additional locations
    const activeAddOns =
      !isHeadwear && Object.values(addOns).filter(Boolean).length;
    const totalLocations = 1 + (activeAddOns || 0);

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      locationCount: totalLocations,
      garmentColor: preSelectedGarment?.color || '',
      inkColors: inkColors.filter((color) => color.trim() !== ''),
      needsUnderbase: hasUnderbase,
      garmentWholesalePrice: preSelectedGarment?.wholesalePrice || null,
      garmentBrand: preSelectedGarment?.brandName || '',
      garmentStyle: preSelectedGarment?.styleID || '',
    });

    if (!result.valid) {
      setError(result.message);
      return;
    }

    // Override setup total
    result.setupTotal = totalSetupFees;

    setError('');
    setStatus('Submitting...');

    // Prepare form data for backend (including file)
    const formData = new FormData();
    formData.append('shirtCount', shirtCount);
    formData.append('numColors', numColors);
    formData.append('hasUnderbase', hasUnderbase);
    formData.append('notes', notes);
    formData.append('quote', JSON.stringify(result));

    // Add add-ons data if not headwear
    if (!isHeadwear) {
      formData.append('addOns', JSON.stringify(addOns));
      formData.append('addOnInkColors', JSON.stringify(addOnInkColors));
      formData.append('addOnColorCounts', JSON.stringify(addOnColorCounts));
    }

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
        setStatus(
          "✅ Print order submitted successfully! We'll contact you within 24 hours.",
        );
        // Reset form
        setShirtCount(15);
        setNumColors(1);
        setHasUnderbase(true);
        setNotes(
          preSelectedGarment
            ? `Print on: ${preSelectedGarment.title} - Size ${preSelectedGarment.size}${preSelectedGarment.color ? `, ${preSelectedGarment.color}` : ''}`
            : '',
        );
        setArtFile(null);

        // Reset add-ons
        setAddOns({
          backPrint: false,
          neckTag: false,
          sleeve: false,
          other: false,
        });
        setAddOnInkColors({
          backPrint: [],
          neckTag: [],
          sleeve: [],
          other: [],
        });
        setAddOnColorCounts({
          backPrint: 1,
          neckTag: 1,
          sleeve: 1,
          other: 1,
        });
        setExpandedAddOns({
          backPrint: false,
          neckTag: false,
          sleeve: false,
          other: false,
        });
      } else {
        setStatus('❌ Error submitting order. Please try again.');
      }
    } catch (error) {
      console.error('Print order submission error:', error);
      setStatus('❌ Error submitting order. Please try again.');
    }
  };

  const formClassName = isEmbedded
    ? 'print-order-form embedded'
    : 'print-order-form';

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      {!isEmbedded && <h2>Tag Team Print Quote</h2>}

      {/* Display brand and product info when pre-selected garment is available */}
      {preSelectedGarment && (
        <div className="selected-product-info">
          <h3 style={{ color: '#2563EB', margin: '0 0 0.5rem 0' }}>
            {preSelectedGarment.brandName} - {preSelectedGarment.title}
          </h3>
          {preSelectedGarment.styleID && (
            <p
              style={{
                color: '#6B7280',
                fontSize: '0.9rem',
                margin: '0 0 1rem 0',
              }}
            >
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
              <span>I&apos;ll choose my own blanks from your catalog</span>
            </label>
          </div>

          {/* Recommended Tee Options */}
          {garmentSource === 'recommend' && (
            <div className="recommended-options">
              <h4>Gildan 5000 - Heavy Cotton T-Shirt</h4>
              <p className="garment-description">
                Pre-shrunk 100% cotton, classic fit. Perfect for most print
                jobs.
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
              <p>
                ✨ Browse our <a href="/categories">catalog</a> to select your
                garments first.
              </p>
              <p>
                Then return here to get your print quote. Garment costs will be
                calculated separately.
              </p>
            </div>
          )}
        </div>
      )}

      {warning && <div className="warning-box">{warning}</div>}

      {preSelectedGarment && (
        <div className="selected-garment-info">
          <h4>Selected Garment:</h4>
          <p>
            {preSelectedGarment.title} - Size {preSelectedGarment.size}
          </p>
          {preSelectedGarment.color && <p>Color: {preSelectedGarment.color}</p>}
          <p>Garment Cost: ${preSelectedGarment.price} each</p>
        </div>
      )}

      <label>
        Total items to be printed
        <span
          className="info-tooltip"
          title={`MINIMUM ORDER REQUIREMENTS: We require higher minimums for complex prints to justify screen setup costs. 1 color = 15 shirts minimum, 2 colors = 20 shirts, 3 colors = 30 shirts, 4 colors = 40 shirts, 5 colors = 50 shirts, 6 colors = 60 shirts. Each additional color requires more time, materials, and screen preparation.`}
        >
          ❓
        </span>
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
        <small
          style={{
            display: 'block',
            marginTop: '4px',
            color: '#666',
            fontSize: '0.9rem',
          }}
        >
          Minimum: {getMinimumQuantity(numColors)} shirts for {numColors} color
          {numColors > 1 ? 's' : ''}
        </small>
      </label>

      <label>
        How many print colors?
        <span
          className="info-tooltip"
          title={`SCREEN PRINTING COLORS: Each ink color requires a separate screen ($30 each). Our 6-color press can handle up to 6 different inks. Higher color counts mean more complex registration, longer setup times, and higher minimums to cover equipment costs. Underbase may add +1 screen if printing on dark garments.`}
        >
          ❓
        </span>
        <select
          value={numColors}
          onChange={(e) => setNumColors(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} color{n > 1 ? 's' : ''} (min: {getMinimumQuantity(n)} shirts)
            </option>
          ))}
        </select>
      </label>

      {/* Ink Colors Section */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="ink-colors-section"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          Ink Colors
          <span
            className="info-tooltip"
            title={`INK COLOR SPECIFICATIONS: List each ink color for accurate pricing. WHITE INK ON DARK GARMENTS: White ink has excellent opacity and doesn't require an underbase screen, saving you $30. COLORED INKS ON DARK GARMENTS: Colors like red, yellow, blue need a white underbase to show properly, adding 1 screen. LIGHT GARMENTS: No underbase needed regardless of ink color.`}
          >
            ❓
          </span>
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
                  borderRadius: '4px',
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
        <span
          className="info-tooltip"
          title={`ENHANCED UNDERBASE LOGIC: Automatically calculated based on garment and ink colors. Dark garments (black, navy, etc.) with colored inks need white underbase for proper color vibrancy. Single white ink on dark garments doesn't need separate underbase. Light garments never need underbase. You can override our calculation if needed.`}
        >
          ❓
        </span>
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

      {/* Add-ons Section - Only show if not headwear */}
      {!isHeadwear && (
        <div className="addons-section" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#2563EB' }}>
            Additional Print Locations (Optional)
          </h3>

          {/* Back Print */}
          <div
            className={`addon-card ${addOns.backPrint ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handleAddOnToggle('backPrint')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddOnToggle('backPrint');
              }
            }}
            style={{
              border: addOns.backPrint
                ? '2px solid #2563EB'
                : '2px solid #E5E7EB',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: addOns.backPrint ? '#EFF6FF' : 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong
                  style={{ color: addOns.backPrint ? '#2563EB' : '#374151' }}
                >
                  🔙 Back Print (Full Color Options)
                </strong>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    marginTop: '0.25rem',
                  }}
                >
                  Add a full-color design to the back (up to 6 colors)
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: '600',
                }}
              >
                +${addOnColorCounts.backPrint * 30} setup
              </div>
            </div>

            {addOns.backPrint && expandedAddOns.backPrint && (
              <div
                role="presentation"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <label htmlFor="backPrint-color-count">
                  How many colors for back print?
                  <select
                    id="backPrint-color-count"
                    value={addOnColorCounts.backPrint}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleAddOnColorCountChange(
                        'backPrint',
                        parseInt(e.target.value),
                      );
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    {Array.from(
                      { length: ADD_ON_COLOR_LIMITS.backPrint },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} Color{num > 1 ? 's' : ''} (${num * 30} setup)
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ marginTop: '1rem' }}>
                  <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Ink Colors:
                  </span>
                  {Array.from(
                    { length: addOnColorCounts.backPrint },
                    (_, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={`Color ${i + 1}`}
                        value={addOnInkColors.backPrint?.[i] || ''}
                        onChange={(e) =>
                          handleAddOnColorChange('backPrint', i, e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Neck Tag */}
          <div
            className={`addon-card ${addOns.neckTag ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handleAddOnToggle('neckTag')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddOnToggle('neckTag');
              }
            }}
            style={{
              border: addOns.neckTag
                ? '2px solid #2563EB'
                : '2px solid #E5E7EB',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: addOns.neckTag ? '#EFF6FF' : 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong
                  style={{ color: addOns.neckTag ? '#2563EB' : '#374151' }}
                >
                  🏷️ Neck Tag Printing
                </strong>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    marginTop: '0.25rem',
                  }}
                >
                  Replace neck tag with your custom print (1 color only)
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: '600',
                }}
              >
                +$30 setup
              </div>
            </div>

            {addOns.neckTag && expandedAddOns.neckTag && (
              <div
                role="presentation"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <label
                  htmlFor="neckTag-color"
                  style={{ display: 'block', marginBottom: '0.5rem' }}
                >
                  Ink Color:
                </label>
                <input
                  id="neckTag-color"
                  type="text"
                  placeholder="Color (e.g., Black, White)"
                  value={addOnInkColors.neckTag?.[0] || ''}
                  onChange={(e) =>
                    handleAddOnColorChange('neckTag', 0, e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Sleeve */}
          <div
            className={`addon-card ${addOns.sleeve ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handleAddOnToggle('sleeve')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddOnToggle('sleeve');
              }
            }}
            style={{
              border: addOns.sleeve ? '2px solid #2563EB' : '2px solid #E5E7EB',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: addOns.sleeve ? '#EFF6FF' : 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong
                  style={{ color: addOns.sleeve ? '#2563EB' : '#374151' }}
                >
                  💪 Sleeve Printing
                </strong>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    marginTop: '0.25rem',
                  }}
                >
                  Add a design to the sleeve (1 color only)
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: '600',
                }}
              >
                +$30 setup
              </div>
            </div>

            {addOns.sleeve && expandedAddOns.sleeve && (
              <div
                role="presentation"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <label
                  htmlFor="sleeve-color"
                  style={{ display: 'block', marginBottom: '0.5rem' }}
                >
                  Ink Color:
                </label>
                <input
                  id="sleeve-color"
                  type="text"
                  placeholder="Color (e.g., Black, White)"
                  value={addOnInkColors.sleeve?.[0] || ''}
                  onChange={(e) =>
                    handleAddOnColorChange('sleeve', 0, e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Other Location */}
          <div
            className={`addon-card ${addOns.other ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handleAddOnToggle('other')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddOnToggle('other');
              }
            }}
            style={{
              border: addOns.other ? '2px solid #2563EB' : '2px solid #E5E7EB',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: addOns.other ? '#EFF6FF' : 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ color: addOns.other ? '#2563EB' : '#374151' }}>
                  📍 Other Location
                </strong>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6B7280',
                    marginTop: '0.25rem',
                  }}
                >
                  Custom location print (up to 2 colors)
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: '600',
                }}
              >
                +${addOnColorCounts.other * 30} setup
              </div>
            </div>

            {addOns.other && expandedAddOns.other && (
              <div
                role="presentation"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <label htmlFor="other-color-count">
                  How many colors for other location?
                  <select
                    id="other-color-count"
                    value={addOnColorCounts.other}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleAddOnColorCountChange(
                        'other',
                        parseInt(e.target.value),
                      );
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    {Array.from(
                      { length: ADD_ON_COLOR_LIMITS.other },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} Color{num > 1 ? 's' : ''} (${num * 30} setup)
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ marginTop: '1rem' }}>
                  <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Ink Colors:
                  </span>
                  {Array.from({ length: addOnColorCounts.other }, (_, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Color ${i + 1}`}
                      value={addOnInkColors.other?.[i] || ''}
                      onChange={(e) =>
                        handleAddOnColorChange('other', i, e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
            <p>
              Garments ({quote.garmentQty} × ${quote.garmentCostPerShirt}): $
              {(quote.garmentQty * quote.garmentCostPerShirt).toFixed(2)}
            </p>
            <p>
              Printing ({quote.garmentQty} × $
              {(quote.printingCostPerShirt - quote.garmentCostPerShirt).toFixed(
                2,
              )}
              ): $
              {(
                quote.garmentQty *
                (quote.printingCostPerShirt - quote.garmentCostPerShirt)
              ).toFixed(2)}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Set-up Fees ({quote.screenBreakdown})</span>
              <span
                className="info-tooltip"
                title="First setup fee is waived—first one is on us!"
              >
                
              </span>
            </div>
            <div style={{ marginLeft: 16, color: '#059669' }}>
              Waived: $0 (first one is on us!)
            </div>
            <div style={{ marginLeft: 16 }}>
              Remaining setup fees: $
              {quote.setupTotal - 30 > 0
                ? (quote.setupTotal - 30).toFixed(2)
                : '0.00'}
            </div>
            <p>Subtotal: ${quote.subtotal}</p>
            <p>
              Tax (HST): ${(quote.totalWithTax - quote.subtotal).toFixed(2)}
            </p>
            <p className="grand-total">Total: ${quote.totalWithTax}</p>
          </div>
        </div>
      )}

      <label className="confirm-box">
        <input type="checkbox" required />I confirm the above details and
        understand minimums apply.
      </label>

      <button type="submit" disabled={!quote}>
        Submit Print Order
      </button>

      {status && <p className="status">{status}</p>}
    </form>
  );
};

export default IntegratedPrintOrderForm;
