import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { calculatePrintQuote } from '../helpers/calculatePrintQuote';

// Reuse the same styled components and logic from StreamlinedOrderForm
// but without garment/color selection

const SectionHeader = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  color: #2563eb;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input,
  select {
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: border-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #2563eb;
    }
  }
`;

const QuoteDisplay = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
`;

const SelectedGarmentInfo = styled.div`
  background: rgba(255, 245, 209, 0.95);
  border: 2px solid #2563eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h4 {
    color: #2563eb;
    font-family: 'HawlersEightRough', 'Impact', sans-serif;
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
  }

  p {
    color: #374151;
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  strong {
    color: #2563eb;
  }
`;

const ColorPickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ColorButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.$selected ? '#2563eb' : '#e5e7eb')};
  border-radius: 8px;
  background: ${(props) => (props.$selected ? '#EBF8FF' : 'white')};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$selected ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none'};

  &:hover {
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      border-color: #e5e7eb;
    }
  }
`;

const ColorSwatch = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.$hex};
  border: 3px solid ${(props) => (props.$selected ? '#2563EB' : '#E5E7EB')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColorLabel = styled.span`
  font-size: 0.75rem;
  font-weight: ${(props) => (props.$selected ? '600' : '500')};
  color: ${(props) => (props.$selected ? '#2563eb' : '#374151')};
  text-align: center;
`;

const AddOnsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
`;

const AddOnCard = styled.div`
  background: ${(props) =>
    props.$active ? 'rgba(37, 99, 235, 0.05)' : '#F9FAFB'};
  border: 2px solid ${(props) => (props.$active ? '#2563eb' : '#E5E7EB')};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  }
`;

const AddOnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddOnTitle = styled.h5`
  margin: 0;
  font-size: 1rem;
  color: ${(props) => (props.$active ? '#2563eb' : '#374151')};
  font-weight: 600;
`;

const AddOnPrice = styled.span`
  font-size: 0.9rem;
  color: #059669;
  font-weight: 600;
`;

const AddOnDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
`;

const ExpandedContent = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const DTFGuidance = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #92400e;
`;

const ValidationMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #991b1b;
`;

// Ink color options
const INK_COLORS = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#DC2626' },
  { name: 'Blue', value: 'blue', hex: '#2563EB' },
  { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
  { name: 'Green', value: 'green', hex: '#059669' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Purple', value: 'purple', hex: '#9333EA' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Brown', value: 'brown', hex: '#92400E' },
  { name: 'Grey', value: 'grey', hex: '#6B7280' },
  { name: 'Navy', value: 'navy', hex: '#1E3A8A' },
];

// Determine if garment is dark
const isDarkGarment = (color) => {
  const darkColors = [
    'black',
    'navy',
    'forest-green',
    'military-green',
    'burgundy',
    'maroon',
    'charcoal',
    'brown',
    'dark green',
  ];
  return darkColors.some((dark) => color?.toLowerCase().includes(dark));
};

// Add-on color limits
const ADD_ON_COLOR_LIMITS = {
  backPrint: 6,
  neckTag: 1,
  sleeve: 1,
  other: 2,
};

/**
 * Simplified quote calculator for shop page
 * Accepts pre-selected garment and color from product browsing
 */
const ShopQuoteCalculator = ({ selectedGarment, selectedColor }) => {
  const [quantity, setQuantity] = useState(24);
  const [printColors, setPrintColors] = useState(1);
  const [printLocation, setPrintLocation] = useState('left-chest');
  const [inkColors, setInkColors] = useState([]);
  const [rushOrder, setRushOrder] = useState(null);
  const [quote, setQuote] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

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

  const [expandedAddOns, setExpandedAddOns] = useState({
    backPrint: false,
    neckTag: false,
    sleeve: false,
    other: false,
  });

  // Auto-select white ink for dark garments
  useEffect(() => {
    if (selectedColor && isDarkGarment(selectedColor)) {
      if (!inkColors.includes('white')) {
        setInkColors(['white']);
      }
    }
  }, [selectedColor, inkColors]);

  // Validate ink colors
  useEffect(() => {
    const errors = [];

    // Main print colors validation
    if (inkColors.length < printColors) {
      errors.push(
        `Please select ${printColors} ink color(s) for your main print`,
      );
    }

    // Add-on validation
    Object.keys(addOns).forEach((addOnKey) => {
      if (addOns[addOnKey]) {
        const requiredColors = addOnColorCounts[addOnKey];
        const selectedColors = addOnInkColors[addOnKey]?.length || 0;

        if (selectedColors < requiredColors) {
          const addOnName =
            addOnKey === 'backPrint'
              ? 'Back Print'
              : addOnKey === 'neckTag'
                ? 'Neck Tag'
                : addOnKey === 'sleeve'
                  ? 'Sleeve'
                  : 'Other Location';
          errors.push(
            `Please select ${requiredColors} ink color(s) for ${addOnName}`,
          );
        }
      }
    });

    setValidationErrors(errors);
  }, [inkColors, printColors, addOns, addOnInkColors, addOnColorCounts]);

  // Calculate quote whenever selections change
  useEffect(() => {
    if (!selectedGarment || validationErrors.length > 0) return;

    // Calculate total setup fees: main print + all active add-ons
    let totalSetupFees = printColors * 30; // Main print setup

    // Add setup fees for each active add-on location
    Object.keys(addOns).forEach((addOnKey) => {
      if (addOns[addOnKey]) {
        totalSetupFees += addOnColorCounts[addOnKey] * 30;
      }
    });

    // Count active add-ons as additional locations
    const activeAddOns = Object.values(addOns).filter(Boolean).length;
    const totalLocations = 1 + activeAddOns;

    const result = calculatePrintQuote({
      garmentQty: quantity,
      colorCount: printColors,
      locationCount: totalLocations,
      garmentColor: selectedColor || 'white',
      inkColors: inkColors,
      garmentWholesalePrice: selectedGarment.wholesalePrice || 2.5,
      rushOrder: rushOrder,
      garmentBrand: selectedGarment.brand || '',
      garmentStyle: selectedGarment.styleName || '',
    });

    if (result.valid) {
      // Override the setup total with our correctly calculated value
      result.setupTotal = totalSetupFees;

      // Recalculate subtotal and total with correct setup fees
      const garmentTotal = quantity * result.garmentCostPerShirt;
      const printingTotal = result.printingTotal || 0;
      const subtotal = garmentTotal + totalSetupFees + printingTotal;

      // Apply rush order multiplier if applicable
      let finalSubtotal = subtotal;
      if (rushOrder) {
        const rushMultiplier =
          rushOrder === '3-day' ? 1.25 : rushOrder === '2-day' ? 1.5 : 2.0;
        finalSubtotal = subtotal * rushMultiplier;
      }

      const tax = finalSubtotal * 0.13;
      const totalWithTax = finalSubtotal + tax;

      result.subtotal = finalSubtotal.toFixed(2);
      result.totalWithTax = totalWithTax.toFixed(2);

      setQuote(result);
    }
  }, [
    selectedGarment,
    selectedColor,
    quantity,
    printColors,
    printLocation,
    inkColors,
    rushOrder,
    addOns,
    addOnColorCounts,
    validationErrors,
  ]);

  // Handle ink color toggle
  const handleInkColorToggle = (colorValue) => {
    if (inkColors.includes(colorValue)) {
      // Don't allow deselecting white on dark garments
      if (colorValue === 'white' && isDarkGarment(selectedColor)) {
        return;
      }
      setInkColors(inkColors.filter((c) => c !== colorValue));
    } else {
      if (inkColors.length < printColors) {
        setInkColors([...inkColors, colorValue]);
      }
    }
  };

  // Handle add-on ink color toggle
  const handleAddOnColorToggle = (addOnKey, colorValue) => {
    const currentColors = addOnInkColors[addOnKey] || [];
    const limit = ADD_ON_COLOR_LIMITS[addOnKey];

    if (currentColors.includes(colorValue)) {
      setAddOnInkColors({
        ...addOnInkColors,
        [addOnKey]: currentColors.filter((c) => c !== colorValue),
      });
    } else {
      if (currentColors.length < limit) {
        setAddOnInkColors({
          ...addOnInkColors,
          [addOnKey]: [...currentColors, colorValue],
        });
      }
    }
  };

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

  // Render add-on color selection
  const renderAddOnColorSelection = (addOnKey, limit) => {
    const selectedColors = addOnInkColors[addOnKey] || [];
    const colorCount = addOnColorCounts[addOnKey];

    return (
      <ExpandedContent>
        {/* Color Count Dropdown */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={`color-count-${addOnKey}`}
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
            }}
          >
            How many colors? *
          </label>
          <select
            id={`color-count-${addOnKey}`}
            value={colorCount}
            onChange={(e) => {
              e.stopPropagation();
              handleAddOnColorCountChange(addOnKey, parseInt(e.target.value));
            }}
            style={{
              padding: '0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.9rem',
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {Array.from({ length: limit }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} Color{num > 1 ? 's' : ''} (${num * 30} setup)
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            color: '#374151',
          }}
        >
          <strong>Select Ink Colors</strong> ({colorCount} required)
          {selectedColors.length > 0 && (
            <span
              style={{
                marginLeft: '0.5rem',
                color: '#059669',
                fontWeight: '600',
              }}
            >
              {selectedColors.length} of {colorCount} selected
            </span>
          )}
        </div>

        <ColorPickerGrid>
          {INK_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.value);
            const isDisabled =
              !isSelected && selectedColors.length >= colorCount;

            return (
              <ColorButton
                key={color.value}
                $selected={isSelected}
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddOnColorToggle(addOnKey, color.value);
                }}
              >
                <ColorSwatch $hex={color.hex} $selected={isSelected} />
                <ColorLabel $selected={isSelected}>{color.name}</ColorLabel>
              </ColorButton>
            );
          })}
        </ColorPickerGrid>

        {limit < 6 && colorCount < limit && (
          <DTFGuidance>
            💡 Need more than {limit} color{limit > 1 ? 's' : ''}? Consider DTF
            (Direct-to-Film) printing for unlimited colors and photo-quality
            prints!
          </DTFGuidance>
        )}
      </ExpandedContent>
    );
  };

  if (!selectedGarment) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
        Please select a garment and color to get a quote
      </div>
    );
  }

  return (
    <div>
      <SelectedGarmentInfo>
        <h4>Selected Product</h4>
        <p>
          <strong>Garment:</strong> {selectedGarment.brand}{' '}
          {selectedGarment.styleName}
        </p>
        <p>
          <strong>Color:</strong> {selectedColor || 'Not selected'}
        </p>
        <p>
          <strong>Base Price:</strong> $
          {selectedGarment.wholesalePrice?.toFixed(2) || '2.50'} per shirt
        </p>
        {isDarkGarment(selectedColor) && (
          <p
            style={{
              color: '#F59E0B',
              fontSize: '0.85rem',
              marginTop: '0.5rem',
            }}
          >
            ⚠️ Dark garment - white underbase will be automatically included
          </p>
        )}
      </SelectedGarmentInfo>

      <SectionHeader>Order Details</SectionHeader>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <InputGroup>
          <label htmlFor="quantity-input">Quantity *</label>
          <input
            id="quantity-input"
            type="number"
            min="15"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(15, parseInt(e.target.value) || 15))
            }
          />
        </InputGroup>

        <InputGroup>
          <label htmlFor="print-colors-select">Print Colors</label>
          <select
            id="print-colors-select"
            value={printColors}
            onChange={(e) => {
              setPrintColors(parseInt(e.target.value));
              // Reset ink colors when changing number
              setInkColors([]);
            }}
          >
            <option value={1}>1 Color ($30 setup)</option>
            <option value={2}>2 Colors ($60 setup)</option>
            <option value={3}>3 Colors ($90 setup)</option>
            <option value={4}>4 Colors ($120 setup)</option>
            <option value={5}>5 Colors ($150 setup)</option>
            <option value={6}>6 Colors ($180 setup)</option>
          </select>
        </InputGroup>

        <InputGroup>
          <label htmlFor="print-location-select">Print Location</label>
          <select
            id="print-location-select"
            value={printLocation}
            onChange={(e) => setPrintLocation(e.target.value)}
          >
            <option value="left-chest">Left Chest</option>
            <option value="full-front">Full Front (Standard Print Area)</option>
            <option value="full-back">Full Back</option>
          </select>
        </InputGroup>
      </div>

      {/* Ink Color Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionHeader style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Select Ink Colors *
        </SectionHeader>
        <div
          style={{
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            color: '#374151',
          }}
        >
          Choose {printColors} color{printColors > 1 ? 's' : ''} for your print
          {inkColors.length > 0 && (
            <span
              style={{
                marginLeft: '0.5rem',
                color: '#059669',
                fontWeight: '600',
              }}
            >
              {inkColors.length} of {printColors} selected
            </span>
          )}
        </div>

        <ColorPickerGrid>
          {INK_COLORS.map((color) => {
            const isSelected = inkColors.includes(color.value);
            const isDisabled = !isSelected && inkColors.length >= printColors;
            const isLocked =
              color.value === 'white' &&
              isDarkGarment(selectedColor) &&
              isSelected;

            return (
              <ColorButton
                key={color.value}
                $selected={isSelected}
                disabled={isDisabled || isLocked}
                onClick={() => !isLocked && handleInkColorToggle(color.value)}
                title={isLocked ? 'White is required for dark garments' : ''}
              >
                <ColorSwatch $hex={color.hex} $selected={isSelected} />
                <ColorLabel $selected={isSelected}>
                  {color.name}
                  {isLocked && ' 🔒'}
                </ColorLabel>
              </ColorButton>
            );
          })}
        </ColorPickerGrid>
      </div>

      {/* Add-ons Section */}
      <AddOnsSection>
        <SectionHeader style={{ fontSize: '1.2rem' }}>
          Additional Print Locations (Optional)
        </SectionHeader>

        {/* Back Print */}
        <AddOnCard
          $active={addOns.backPrint}
          onClick={() => handleAddOnToggle('backPrint')}
        >
          <AddOnHeader>
            <AddOnTitle $active={addOns.backPrint}>
              🔙 Back Print (Full Color Options)
            </AddOnTitle>
            <AddOnPrice>+$30 setup + printing costs</AddOnPrice>
          </AddOnHeader>
          <AddOnDescription>
            Add a full-color design to the back (up to 6 colors)
          </AddOnDescription>
          {addOns.backPrint &&
            expandedAddOns.backPrint &&
            renderAddOnColorSelection('backPrint', 6, 'Back Print')}
        </AddOnCard>

        {/* Neck Tag */}
        <AddOnCard
          $active={addOns.neckTag}
          onClick={() => handleAddOnToggle('neckTag')}
        >
          <AddOnHeader>
            <AddOnTitle $active={addOns.neckTag}>
              🏷️ Neck Tag Printing
            </AddOnTitle>
            <AddOnPrice>+$30 setup + printing costs</AddOnPrice>
          </AddOnHeader>
          <AddOnDescription>
            Replace neck tag with your custom print (1 color only)
          </AddOnDescription>
          {addOns.neckTag &&
            expandedAddOns.neckTag &&
            renderAddOnColorSelection('neckTag', 1, 'Neck Tag')}
        </AddOnCard>

        {/* Sleeve Print */}
        <AddOnCard
          $active={addOns.sleeve}
          onClick={() => handleAddOnToggle('sleeve')}
        >
          <AddOnHeader>
            <AddOnTitle $active={addOns.sleeve}>💪 Sleeve Printing</AddOnTitle>
            <AddOnPrice>+$30 setup + printing costs</AddOnPrice>
          </AddOnHeader>
          <AddOnDescription>
            Add a design to the sleeve (1 color only)
          </AddOnDescription>
          {addOns.sleeve &&
            expandedAddOns.sleeve &&
            renderAddOnColorSelection('sleeve', 1, 'Sleeve')}
        </AddOnCard>

        {/* Other Location */}
        <AddOnCard
          $active={addOns.other}
          onClick={() => handleAddOnToggle('other')}
        >
          <AddOnHeader>
            <AddOnTitle $active={addOns.other}>📍 Other Location</AddOnTitle>
            <AddOnPrice>+$30 setup + printing costs</AddOnPrice>
          </AddOnHeader>
          <AddOnDescription>
            Custom location print (up to 2 colors)
          </AddOnDescription>
          {addOns.other &&
            expandedAddOns.other &&
            renderAddOnColorSelection('other', 2, 'Other Location')}
        </AddOnCard>
      </AddOnsSection>

      {/* Rush Order */}
      <div style={{ marginTop: '2rem' }}>
        <SectionHeader style={{ fontSize: '1.2rem' }}>
          Rush Order (Optional)
        </SectionHeader>
        <InputGroup>
          <select
            value={rushOrder || ''}
            onChange={(e) => setRushOrder(e.target.value || null)}
          >
            <option value="">Standard Turnaround (5-7 business days)</option>
            <option value="3-day">3-Day Rush (+25% fee)</option>
            <option value="2-day">2-Day Rush (+50% fee)</option>
            <option value="1-day">1-Day Rush (+100% fee)</option>
          </select>
        </InputGroup>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <ValidationMessage>
          <strong>Please complete the following:</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </ValidationMessage>
      )}

      {/* Quote Display */}
      {quote && validationErrors.length === 0 && (
        <QuoteDisplay>
          <div
            style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              Quote for {quantity} shirts
            </div>
            <div style={{ fontSize: '1rem', opacity: '0.9' }}>
              ${(parseFloat(quote.totalWithTax) / quantity).toFixed(2)} per
              shirt
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
              }}
            >
              <span>
                Garments ({quantity} × ${quote.garmentCostPerShirt?.toFixed(2)})
              </span>
              <span style={{ fontWeight: '600' }}>
                ${(quantity * (quote.garmentCostPerShirt || 0)).toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
              }}
            >
              <span>
                Setup Fees ({1 + Object.values(addOns).filter(Boolean).length}{' '}
                location
                {1 + Object.values(addOns).filter(Boolean).length > 1
                  ? 's'
                  : ''}
                )
              </span>
              <span style={{ fontWeight: '600' }}>
                ${quote.setupTotal?.toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
              }}
            >
              <span>Printing ({quantity} shirts)</span>
              <span style={{ fontWeight: '600' }}>
                ${(quote.printingTotal || 0).toFixed(2)}
              </span>
            </div>

            {rushOrder && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  color: '#F59E0B',
                }}
              >
                <span>Rush Order ({rushOrder})</span>
                <span style={{ fontWeight: '600' }}>
                  {rushOrder === '3-day' && '+25%'}
                  {rushOrder === '2-day' && '+50%'}
                  {rushOrder === '1-day' && '+100%'}
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(229, 231, 235, 0.8)',
                fontWeight: '500',
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${quote.subtotal}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '8px',
              }}
            >
              <span>HST (13%)</span>
              <span style={{ fontWeight: '600' }}>
                $
                {(
                  parseFloat(quote.totalWithTax) - parseFloat(quote.subtotal)
                ).toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '2px solid rgba(37, 99, 235, 0.8)',
                fontSize: '1.3rem',
                fontWeight: '700',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '12px 8px',
                borderRadius: '6px',
              }}
            >
              <span>Total</span>
              <span>${quote.totalWithTax}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '0.9rem',
                opacity: '0.9',
                marginBottom: '1rem',
              }}
            >
              Ready to place your order? Visit our Quick Order page to complete
              your purchase
            </p>
            <a
              href="/order/"
              style={{
                display: 'inline-block',
                background: '#059669',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
              }}
            >
              Go to Quick Order Page →
            </a>
          </div>
        </QuoteDisplay>
      )}
    </div>
  );
};

export default ShopQuoteCalculator;
