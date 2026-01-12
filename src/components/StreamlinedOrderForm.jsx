import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { calculatePrintQuote } from '../helpers/calculatePrintQuote';
import { useOrder } from '../context/OrderContext';
import { trackOrderSubmission } from '../utils/analytics';
import FileUpload from './FileUpload';

// Preset garment options for streamlined ordering
const PRESET_GARMENTS = {
  gildan5000: {
    id: 'gildan5000',
    brand: 'Gildan',
    styleName: '5000',
    title: 'Heavy Cotton™ T-Shirt',
    description:
      '5.3 oz./yd², 100% cotton classic fit tee. The most popular choice for screen printing.',
    wholesalePrice: 2.5, // This will be converted to retail pricing using markup tiers
    image: '/images/garments/gildan-5000.jpg',
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Navy', value: 'navy', hex: '#1F2937' },
      { name: 'Forest Green', value: 'forest-green', hex: '#065F46' },
      { name: 'Cardinal Red', value: 'cardinal-red', hex: '#B91C1C' },
      { name: 'Royal Blue', value: 'royal-blue', hex: '#1D4ED8' },
      { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
    ],
  },
  moGold: {
    id: 'moGold',
    brand: 'M&O',
    styleName: '4800',
    title: 'Gold Soft Touch T-Shirt',
    description:
      '5 oz./yd², 100% preshrunk cotton jersey. Ultra-soft feel with excellent printability.',
    wholesalePrice: 3.25, // This will be converted to retail pricing
    image: '/images/garments/mo-4800.jpg',
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Navy', value: 'navy', hex: '#1F2937' },
      { name: 'Heather Grey', value: 'heather-grey', hex: '#6B7280' },
      { name: 'Military Green', value: 'military-green', hex: '#059669' },
      { name: 'Burgundy', value: 'burgundy', hex: '#7C2D12' },
      { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
    ],
  },
};

// Common ink colors for quick selection
const INK_COLORS = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#DC2626' },
  { name: 'Navy Blue', value: 'navy-blue', hex: '#1E3A8A' },
  { name: 'Royal Blue', value: 'royal-blue', hex: '#2563EB' },
  { name: 'Forest Green', value: 'forest-green', hex: '#059669' },
  { name: 'Gold/Yellow', value: 'gold', hex: '#FBBF24' },
  { name: 'Orange', value: 'orange', hex: '#EA580C' },
  { name: 'Purple', value: 'purple', hex: '#7C3AED' },
  { name: 'Silver/Grey', value: 'silver', hex: '#6B7280' },
  { name: 'Brown', value: 'brown', hex: '#92400E' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Pantone/Custom', value: 'custom', hex: '#8B5CF6' },
];

// Helper function to determine if a garment color is dark (needs underbase)
const isDarkGarment = (colorValue) => {
  // White and yellow are light garments that don't need underbase
  return colorValue !== 'white' && colorValue !== 'yellow';
};

// Rush order options with turnaround times and premiums
const RUSH_ORDER_OPTIONS = [
  {
    value: '5day',
    label: '5 Day Turnaround',
    premium: 0.2,
    description: '+20% total',
  },
  {
    value: '4day',
    label: '4 Day Turnaround',
    premium: 0.3,
    description: '+30% total',
  },
  {
    value: '3day',
    label: '3 Day Turnaround',
    premium: 0.4,
    description: '+40% total',
  },
  {
    value: '2day',
    label: '2 Day Turnaround',
    premium: 0.5,
    description: '+50% total',
  },
];

// Inline pricing function to avoid ES module SSR issues
const getQuantityBasedPrice = (wholesalePrice, quantity, brandName = '') => {
  const price = parseFloat(wholesalePrice);
  const qty = parseInt(quantity) || 1;

  const isPremiumBlank =
    price >= 7.0 ||
    brandName.toLowerCase().includes('bella') ||
    brandName.toLowerCase().includes('canvas') ||
    brandName.toLowerCase().includes('as colour') ||
    brandName.toLowerCase().includes('next level');

  const isQualityBlank = price >= 4.3 && price < 7.0;

  let tiers;
  if (isPremiumBlank) {
    tiers = [
      { minQty: 1, maxQty: 11, price: 20.95 },
      { minQty: 12, maxQty: 23, price: 16.95 },
      { minQty: 24, maxQty: 47, price: 15.33 },
      { minQty: 48, maxQty: 71, price: 14.45 },
      { minQty: 72, maxQty: 143, price: 13.58 },
      { minQty: 144, maxQty: 287, price: 12.95 },
      { minQty: 288, maxQty: Infinity, price: 12.33 },
    ];
  } else if (isQualityBlank) {
    tiers = [
      { minQty: 1, maxQty: 11, price: 16.95 },
      { minQty: 12, maxQty: 23, price: 14.95 },
      { minQty: 24, maxQty: 47, price: 13.33 },
      { minQty: 48, maxQty: 71, price: 12.45 },
      { minQty: 72, maxQty: 143, price: 11.58 },
      { minQty: 144, maxQty: 287, price: 10.95 },
      { minQty: 288, maxQty: Infinity, price: 10.33 },
    ];
  } else {
    // Legacy markup for basic blanks
    const multiplier = price <= 4.25 ? 2.5 : price <= 6.99 ? 2.0 : 1.6;
    return (price * multiplier).toFixed(2);
  }

  const tier = tiers.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier ? tier.price.toFixed(2) : (price * 1.6).toFixed(2);
};

const SectionHeader = styled.h3`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  color: #2563eb;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GarmentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GarmentCard = styled.div`
  border: 3px solid ${(props) => (props.selected ? '#2563EB' : '#E5E7EB')};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.selected ? '#F0F7FF' : 'white')};
  position: relative;
  min-height: 120px;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 100px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    min-height: 80px;
  }

  ${(props) =>
    props.selected &&
    `
    &::before {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #2563EB;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.8rem;
    }
  `}
`;

const GarmentTitle = styled.h4`
  font-family: 'HawlersEightRough', sans-serif;
  color: #1f2937;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
`;

const GarmentSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const ColorSwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ColorSwatch = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => props.$hex};
  border: 3px solid ${(props) => (props.$selected ? '#2563EB' : '#E5E7EB')};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    border-color: #2563eb;
  }

  ${(props) =>
    props.$selected &&
    `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${props.$hex === '#FFFFFF' ? '#000' : '#fff'};
      font-weight: bold;
      font-size: 0.7rem;
    }
  `}
`;

const QuantitySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;

    & > div:last-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }
  }

  input,
  select {
    padding: 0.75rem;

    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 16px; /* Prevents zoom on iOS */
      min-height: 44px;
    }
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

  select {
    font-size: 0.85rem;
    line-height: 1.2;
  }
`;

const AddOnSection = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const AddOnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddOnCard = styled.div`
  background: white;
  border: 2px solid ${(props) => (props.selected ? '#2563EB' : '#E5E7EB')};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  display: block;

  &:hover {
    border-color: #2563eb;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 52px;
    font-size: 16px;
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

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin: 1rem 0;
  }
`;

const _QuoteTotal = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  font-family: 'HawlersEightRough', sans-serif;
  margin-bottom: 1rem;
`;

const _QuoteBreakdown = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 4px;
  overflow: hidden;
`;

const DropdownOption = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  background: ${(props) => (props.selected ? '#EFF6FF' : 'white')};
  border-bottom: 1px solid #f3f4f6;
  min-height: 44px;
  display: flex;
  align-items: center;

  &:hover {
    background: #f9fafb;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    min-height: 52px;
    font-size: 16px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const DropdownNote = styled.div`
  padding: 8px 16px;
  font-size: 0.8rem;
  color: #9ca3af;
  background: #f9fafb;
  font-style: italic;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'HawlersEightRough', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StreamlinedOrderForm = () => {
  // Use shared state from context for mockup synchronization
  const {
    selectedColor,
    setSelectedColor,
    printLocation,
    setPrintLocation,
    selectedArtwork,
    setSelectedArtwork,
    selectedGarment,
    setSelectedGarment,
    uploadedFiles,
    setUploadedFiles,
  } = useOrder();

  // Local form state
  const [quantity, setQuantity] = useState(24);
  const [printColors, setPrintColors] = useState(1);
  const [addOns, setAddOns] = useState({
    extraColors: 0, // Keep for now, will remove from UI
    extraLocations: {
      neckTag: false,
      sleeve: false,
      backPrint: false,
      other: false,
    },
    rushOrder: null, // Will store the selected rush option: 5day, 4day, 3day, 2day, or null
  });
  const [quote, setQuote] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [selectedInkColors, setSelectedInkColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false); // New state for ink colors
  const [showRushOptions, setShowRushOptions] = useState(false); // New state for rush order options
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  // Add-on ink colors state - separate colors per add-on location
  const [addOnInkColors, setAddOnInkColors] = useState({
    backPrint: [],
    neckTag: [],
    sleeve: [],
    other: [],
  });
  const [showAddOnColorPickers, setShowAddOnColorPickers] = useState({
    backPrint: false,
    neckTag: false,
    sleeve: false,
    other: false,
  });

  // Color limits for each add-on location
  const ADD_ON_COLOR_LIMITS = {
    backPrint: 6,
    neckTag: 1,
    sleeve: 1,
    other: 2,
  };

  // Add-on color counts state - tracks number of colors/screens per add-on location
  const [addOnColorCounts, setAddOnColorCounts] = useState({
    backPrint: 1,
    neckTag: 1,
    sleeve: 1,
    other: 1,
  });

  // Computed values
  const isCurrentGarmentDark = isDarkGarment(selectedColor);
  const extraLocationCount = Object.values(addOns.extraLocations).filter(
    Boolean,
  ).length;
  const totalLocations = 1 + extraLocationCount;

  // Auto-select white as first color on dark garments, remove white on light garments
  useEffect(() => {
    if (
      isCurrentGarmentDark &&
      selectedInkColors.length === 0 &&
      printColors >= 1
    ) {
      // Automatically add white as the first color for dark garments
      const whiteColor = INK_COLORS.find((color) => color.value === 'white');
      if (whiteColor) {
        setSelectedInkColors([whiteColor]);
      }
    } else if (
      !isCurrentGarmentDark &&
      selectedInkColors.some((color) => color.value === 'white')
    ) {
      // Remove white ink when switching to light garments (white ink isn't visible on white shirts)
      setSelectedInkColors((prev) =>
        prev.filter((color) => color.value !== 'white'),
      );
    }
  }, [isCurrentGarmentDark, selectedInkColors, printColors]);

  // Calculate quote whenever selections change
  useEffect(() => {
    const garment = PRESET_GARMENTS[selectedGarment];

    // Calculate total setup fees: main print + all active add-ons
    let totalSetupFees = printColors * 30; // Main print setup

    // Add setup fees for each active add-on location based on their color counts
    Object.keys(addOns.extraLocations).forEach((location) => {
      if (addOns.extraLocations[location]) {
        totalSetupFees += addOnColorCounts[location] * 30;
      }
    });

    // Count how many add-on locations are active
    const activeAddOnCount = Object.values(addOns.extraLocations).filter(
      Boolean,
    ).length;
    const totalLocationsForCalc = 1 + activeAddOnCount;

    // Calculate total color count for printing costs (main print + add-on colors)
    let totalColors = printColors;
    Object.keys(addOns.extraLocations).forEach((location) => {
      if (addOns.extraLocations[location]) {
        totalColors += addOnColorCounts[location];
      }
    });

    // Use the garment's actual wholesale price
    const baseWholesalePrice = garment.wholesalePrice;

    // Apply quantity-based markup pricing to get proper retail price
    const retailPricePerShirt = getQuantityBasedPrice(
      baseWholesalePrice,
      quantity,
      garment.brand,
    );

    const result = calculatePrintQuote({
      garmentQty: quantity,
      colorCount: totalColors,
      locationCount: totalLocationsForCalc,
      needsUnderbase: isCurrentGarmentDark,
      garmentColor: selectedColor,
      inkColors: selectedInkColors.map((color) => color.value), // Pass the selected ink colors
      garmentWholesalePrice: retailPricePerShirt, // Use retail price, not wholesale
      rushOrder: addOns.rushOrder,
      garmentBrand: garment.brand,
      garmentStyle: garment.styleName,
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
      if (addOns.rushOrder) {
        const rushMultiplier =
          addOns.rushOrder === '3-day'
            ? 1.25
            : addOns.rushOrder === '2-day'
              ? 1.5
              : 2.0;
        finalSubtotal = subtotal * rushMultiplier;
      }

      const tax = finalSubtotal * 0.13;
      const totalWithTax = finalSubtotal + tax;

      result.subtotal = finalSubtotal.toFixed(2);
      result.totalPrice = totalWithTax.toFixed(2);
      result.totalWithTax = totalWithTax.toFixed(2);

      setQuote(result);
    } else {
      setQuote(null);
    }
  }, [
    selectedGarment,
    selectedColor,
    quantity,
    printColors,
    printLocation,
    addOns,
    isCurrentGarmentDark,
    totalLocations,
    selectedInkColors,
    addOnInkColors,
    addOnColorCounts,
  ]);

  const handleExtraLocationChange = (location) => {
    const isCurrentlySelected = addOns.extraLocations[location];

    setAddOns((prev) => ({
      ...prev,
      extraLocations: {
        ...prev.extraLocations,
        [location]: !prev.extraLocations[location],
      },
    }));

    // Clear colors, hide picker, and reset color count when toggling off
    if (isCurrentlySelected) {
      setAddOnInkColors((prev) => ({
        ...prev,
        [location]: [],
      }));
      setShowAddOnColorPickers((prev) => ({
        ...prev,
        [location]: false,
      }));
      setAddOnColorCounts((prev) => ({
        ...prev,
        [location]: 1,
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!customerInfo.name.trim()) {
      errors.push('Name is required');
    }

    if (!customerInfo.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push('Please enter a valid email address');
    }

    if (quantity < 15) {
      errors.push('Minimum order quantity is 15 shirts');
    }

    if (selectedInkColors.length === 0) {
      errors.push(
        'Please select at least one ink color for the main print location',
      );
    }

    // Validate add-on locations have correct number of colors selected
    Object.keys(addOns.extraLocations).forEach((location) => {
      if (addOns.extraLocations[location]) {
        const requiredColors = addOnColorCounts[location];
        const selectedColors = addOnInkColors[location].length;
        const locationNames = {
          backPrint: 'Back Print',
          neckTag: 'Neck Tag',
          sleeve: 'Sleeve',
          other: 'Other Location',
        };

        if (selectedColors < requiredColors) {
          errors.push(
            `Please select ${requiredColors} ink color${requiredColors > 1 ? 's' : ''} for ${locationNames[location]}`,
          );
        }
      }
    });

    if (!quote || !quote.valid) {
      errors.push('Please wait for pricing calculation to complete');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(
        'Please fix the following issues:\n\n• ' +
          validationErrors.join('\n• '),
      );
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      garment: PRESET_GARMENTS[selectedGarment],
      color: selectedColor,
      quantity,
      printColors: printColors + addOns.extraColors,
      printLocation: printLocation, // Use current printLocation value
      selectedInkColors: selectedInkColors.map((color) => ({
        name: color.name,
        value: color.value,
        hex: color.hex,
      })),
      addOns,
      addOnInkColors: Object.keys(addOns.extraLocations).reduce(
        (acc, location) => {
          if (addOns.extraLocations[location]) {
            acc[location] = addOnInkColors[location].map((color) => ({
              name: color.name,
              value: color.value,
              hex: color.hex,
            }));
          }
          return acc;
        },
        {},
      ),
      quote,
      customer: customerInfo,
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: file.uploaded,
        id: file.id,
      })),
      selectedArtwork,
      orderType: 'streamlined',
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/.netlify/functions/streamlined-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        const orderId = result.orderId;

        // Track order submission for analytics
        trackOrderSubmission({
          orderId: orderId,
          total: quote.totalPrice,
          items: [
            {
              id: PRESET_GARMENTS[selectedGarment].id,
              brand: PRESET_GARMENTS[selectedGarment].brand,
              styleName: PRESET_GARMENTS[selectedGarment].styleName,
              category: 'Custom Apparel',
              quantity: quantity,
              unitPrice: quote.totalPrice / quantity,
            },
          ],
          customerInfo: {
            accountType: 'individual',
          },
        });

        // Store order ID for confirmation page
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('lastOrderId', orderId);
        }

        // Show success message with tracking info
        alert(`🎉 Order submitted successfully! 
        
📧 Check your email for confirmation details
📞 We'll contact you within 24 hours to finalize your order
🏷️  Your Order ID: ${orderId}

Redirecting to confirmation page...`);

        // Redirect to confirmation page with order ID
        if (typeof window !== 'undefined') {
          window.location.href = `/order-confirmed?orderId=${orderId}`;
        }

        // Reset form
        setQuantity(24);
        setPrintColors(1);
        setPrintLocation('full-front'); // Reset to default location
        setAddOns({
          extraColors: 0,
          extraLocations: {
            neckTag: false,
            sleeve: false,
            backPrint: false,
            other: false,
          },
          rushOrder: null,
        });
        setShowRushOptions(false);
        setSelectedInkColors([]);
        setShowColorPicker(false);
        setAddOnInkColors({
          backPrint: [],
          neckTag: [],
          sleeve: [],
          other: [],
        });
        setShowAddOnColorPickers({
          backPrint: false,
          neckTag: false,
          sleeve: false,
          other: false,
        });
        setAddOnColorCounts({
          backPrint: 1,
          neckTag: 1,
          sleeve: 1,
          other: 1,
        });
        setUploadedFiles([]);
        setSelectedArtwork(null);
        setCustomerInfo({
          name: '',
          email: '',
          phone: '',
          notes: '',
        });
      } else {
        const errorData = await response.text();
        alert(`❌ Order submission failed. 

Please try again or contact us directly:
📞 Call: (Your phone number)
📧 Email: info@tagteamprinting.com

Error details: ${errorData || 'Server error'}`);
      }
    } catch (error) {
      alert(`❌ Order submission failed due to network error.

Please check your internet connection and try again, or contact us directly:
📞 Call: (Your phone number) 
📧 Email: info@tagteamprinting.com

Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render add-on color selection UI
  const renderAddOnColorSelection = (location) => {
    const colorLimit = ADD_ON_COLOR_LIMITS[location];
    const selectedColors = addOnInkColors[location];
    const showPicker = showAddOnColorPickers[location];
    const colorCount = addOnColorCounts[location];

    // DTF guidance messages per location
    const dtfGuidance = {
      backPrint: 'Full color options available (up to 6 colors)',
      neckTag: 'Single color only • Need more colors? Ask about DTF printing',
      sleeve: 'Single color only • Need more colors? Ask about DTF printing',
      other: '2 colors maximum • Need more colors? Ask about DTF printing',
    };

    return (
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        {/* Color Count Dropdown */}
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor={`addon-color-count-${location}`}
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px',
              fontSize: '12px',
            }}
          >
            How many colors/screens needed? *
          </label>
          <select
            id={`addon-color-count-${location}`}
            value={colorCount}
            onChange={(e) => {
              e.stopPropagation();
              const newCount = parseInt(e.target.value);
              setAddOnColorCounts((prev) => ({
                ...prev,
                [location]: newCount,
              }));
              // Clear selected colors if new count is less than currently selected
              if (addOnInkColors[location].length > newCount) {
                setAddOnInkColors((prev) => ({
                  ...prev,
                  [location]: prev[location].slice(0, newCount),
                }));
              }
            }}
            style={{
              padding: '8px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {Array.from({ length: colorLimit }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} Color{num > 1 ? 's' : ''} / {num} Screen
                {num > 1 ? 's' : ''} (${num * 30} setup)
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
              Select Ink Colors ({colorCount} required): *
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddOnColorPickers((prev) => ({
                  ...prev,
                  [location]: !prev[location],
                }));
              }}
              style={{
                padding: '4px 8px',
                border: '1px solid #007cba',
                backgroundColor: showPicker ? '#007cba' : 'white',
                color: showPicker ? 'white' : '#007cba',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              {showPicker ? 'Hide' : 'Choose'}
            </button>
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#6B7280',
              marginBottom: '6px',
            }}
          >
            {dtfGuidance[location]}
          </div>

          {/* Validation: Show warning if colors don't match count */}
          {selectedColors.length < colorCount && (
            <div
              style={{
                color: '#EF4444',
                fontSize: '0.75rem',
                marginBottom: '4px',
              }}
            >
              ⚠️ Please select {colorCount} ink color{colorCount > 1 ? 's' : ''}{' '}
              for this location ({selectedColors.length} of {colorCount}{' '}
              selected)
            </div>
          )}

          {/* Selected Colors Display */}
          {selectedColors.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}
            >
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                    fontSize: '10px',
                    border: '1px solid #ddd',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border:
                        color.value === 'white' ? '1px solid #ccc' : 'none',
                    }}
                  />
                  <span>{color.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddOnInkColors((prev) => ({
                        ...prev,
                        [location]: prev[location].filter(
                          (_, i) => i !== index,
                        ),
                      }));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      marginLeft: '2px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Color Picker */}
          {showPicker && (
            <div
              role="button"
              tabIndex={0}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: '#f9f9f9',
                maxHeight: '150px',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '4px',
                }}
              >
                {INK_COLORS.map((color) => {
                  const isSelected = selectedColors.find(
                    (c) => c.value === color.value,
                  );
                  const isDisabled =
                    selectedColors.length >= colorCount && !isSelected;

                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          // Deselect the color
                          setAddOnInkColors((prev) => ({
                            ...prev,
                            [location]: prev[location].filter(
                              (c) => c.value !== color.value,
                            ),
                          }));
                        } else if (!isDisabled) {
                          // Add the color
                          setAddOnInkColors((prev) => ({
                            ...prev,
                            [location]: [...prev[location], color],
                          }));
                        }
                      }}
                      disabled={isDisabled}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 6px',
                        border: isSelected
                          ? '2px solid #007cba'
                          : '1px solid #ddd',
                        backgroundColor: isSelected ? '#e6f3ff' : 'white',
                        borderRadius: '3px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        fontSize: '9px',
                        opacity: isDisabled ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border:
                            color.value === 'white' ? '1px solid #ccc' : 'none',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '9px' }}>{color.name}</span>
                    </button>
                  );
                })}
              </div>

              <p
                style={{
                  fontSize: '9px',
                  color: '#666',
                  margin: '6px 0 0',
                  fontStyle: 'italic',
                }}
              >
                Select &quot;Pantone/Custom&quot; for special colors
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentGarment = PRESET_GARMENTS[selectedGarment];

  return (
    <form onSubmit={handleSubmit}>
      <SectionHeader>Choose Your Garment</SectionHeader>
      <GarmentGrid>
        {Object.values(PRESET_GARMENTS).map((garment) => (
          <GarmentCard
            key={garment.id}
            selected={selectedGarment === garment.id}
            onClick={() => setSelectedGarment(garment.id)}
          >
            <GarmentTitle>
              {garment.brand} {garment.styleName}
            </GarmentTitle>
            <GarmentSubtitle>{garment.description}</GarmentSubtitle>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#059669',
                fontWeight: '600',
              }}
            >
              From $
              {getQuantityBasedPrice(garment.wholesalePrice, 24, garment.brand)}{' '}
              each + printing
            </div>
          </GarmentCard>
        ))}
      </GarmentGrid>

      <SectionHeader>Choose Color</SectionHeader>
      <ColorSwatchGrid>
        {currentGarment.colors.map((color) => (
          <ColorSwatch
            key={color.value}
            $hex={color.hex}
            $selected={selectedColor === color.value}
            onClick={() => setSelectedColor(color.value)}
            title={color.name}
          />
        ))}
      </ColorSwatchGrid>

      <SectionHeader>Order Details</SectionHeader>
      <QuantitySection>
        <InputGroup>
          <label htmlFor="quantity-input">
            Quantity *
            <span
              style={{
                fontSize: '0.8rem',
                color: '#6B7280',
                fontWeight: 'normal',
                display: 'block',
                marginTop: '4px',
              }}
            >
              Minimum 15 shirts • Better pricing at 24+, 48+, 72+
            </span>
          </label>
          <input
            id="quantity-input"
            type="number"
            min="15"
            step="1"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 15;
              setQuantity(Math.max(15, value));
            }}
            required
            style={{
              border: quantity < 15 ? '2px solid #EF4444' : '2px solid #E5E7EB',
            }}
          />
          {quantity < 15 && (
            <div
              style={{
                color: '#EF4444',
                fontSize: '0.8rem',
                marginTop: '4px',
              }}
            >
              ⚠️ Minimum quantity is 15 shirts
            </div>
          )}
        </InputGroup>
        <InputGroup>
          <label htmlFor="print-colors-select">Print Colors</label>
          <div style={{ marginBottom: '10px' }}>
            <select
              id="print-colors-select"
              value={printColors}
              onChange={(e) => setPrintColors(parseInt(e.target.value))}
              style={{ marginBottom: '10px' }}
            >
              <option value={1}>1 Color ($30 setup)</option>
              <option value={2}>2 Colors ($60 setup)</option>
              <option value={3}>3 Colors ($90 setup)</option>
              <option value={4}>4 Colors ($120 setup)</option>
              <option value={5}>5 Colors ($150 setup)</option>
              <option value={6}>6 Colors ($180 setup)</option>
            </select>

            {/* Ink Color Selection */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}
                  >
                    Ink Colors: *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #007cba',
                      backgroundColor: showColorPicker ? '#007cba' : 'white',
                      color: showColorPicker ? 'white' : '#007cba',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    {showColorPicker ? 'Hide' : 'Choose'}
                  </button>
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '6px',
                  }}
                >
                  Select {printColors} ink color{printColors > 1 ? 's' : ''} for
                  your design
                  {isCurrentGarmentDark &&
                    ' • White auto-selected for dark garments (click any color to select/deselect)'}
                </div>
                {isCurrentGarmentDark &&
                  selectedInkColors.some(
                    (color) => color.value === 'white',
                  ) && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        border: '1px solid #D1FAE5',
                      }}
                    >
                      ✅ White base selected - great for vibrant colors on dark
                      garments
                    </div>
                  )}
                {isCurrentGarmentDark &&
                  !selectedInkColors.some((color) => color.value === 'white') &&
                  selectedInkColors.length > 0 && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#B45309',
                        backgroundColor: '#FFFBEB',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        border: '1px solid #FED7AA',
                      }}
                    >
                      ℹ️ Non-white ink selected - works well for simple
                      single-color designs
                    </div>
                  )}
                {selectedInkColors.length === 0 && (
                  <div
                    style={{
                      color: '#EF4444',
                      fontSize: '0.75rem',
                      marginBottom: '4px',
                    }}
                  >
                    ⚠️ Please select at least one ink color
                  </div>
                )}
              </div>

              {/* Selected Colors Display */}
              {selectedInkColors.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {selectedInkColors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '3px',
                        fontSize: '10px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border:
                            color.value === 'white' ? '1px solid #ccc' : 'none',
                        }}
                      />
                      <span>{color.name}</span>
                      <button
                        onClick={() => {
                          setSelectedInkColors((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '0',
                          marginLeft: '2px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Color Picker */}
              {showColorPicker && (
                <div
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px',
                    backgroundColor: '#f9f9f9',
                    maxHeight: '150px',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(80px, 1fr))',
                      gap: '4px',
                    }}
                  >
                    {INK_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          const alreadySelected = selectedInkColors.find(
                            (c) => c.value === color.value,
                          );
                          if (alreadySelected) {
                            // Deselect the color
                            setSelectedInkColors((prev) =>
                              prev.filter((c) => c.value !== color.value),
                            );
                          } else if (selectedInkColors.length < printColors) {
                            // Add the color
                            setSelectedInkColors((prev) => [...prev, color]);
                          }
                        }}
                        disabled={
                          selectedInkColors.length >= printColors &&
                          !selectedInkColors.find(
                            (c) => c.value === color.value,
                          )
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 6px',
                          border: selectedInkColors.find(
                            (c) => c.value === color.value,
                          )
                            ? '2px solid #007cba'
                            : '1px solid #ddd',
                          backgroundColor: selectedInkColors.find(
                            (c) => c.value === color.value,
                          )
                            ? '#e6f3ff'
                            : 'white',
                          borderRadius: '3px',
                          cursor:
                            selectedInkColors.length >= printColors &&
                            !selectedInkColors.find(
                              (c) => c.value === color.value,
                            )
                              ? 'not-allowed'
                              : 'pointer',
                          fontSize: '9px',
                          opacity:
                            selectedInkColors.length >= printColors &&
                            !selectedInkColors.find(
                              (c) => c.value === color.value,
                            )
                              ? 0.6
                              : 1,
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            border:
                              color.value === 'white'
                                ? '1px solid #ccc'
                                : 'none',
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: '9px' }}>{color.name}</span>
                      </button>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: '9px',
                      color: '#666',
                      margin: '6px 0 0',
                      fontStyle: 'italic',
                    }}
                  >
                    Select &quot;Pantone/Custom&quot; for special colors
                  </p>
                </div>
              )}
            </div>
          </div>
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
      </QuantitySection>

      <SectionHeader>⚡ Add-Ons</SectionHeader>
      <AddOnSection>
        <AddOnGrid>
          {/* Back Print Add-On */}
          <div
            style={{
              gridColumn: addOns.extraLocations.backPrint ? '1 / -1' : 'auto',
            }}
          >
            <AddOnCard
              selected={addOns.extraLocations.backPrint}
              onClick={() => handleExtraLocationChange('backPrint')}
            >
              <div style={{ width: '100%' }}>
                <strong>Back Print</strong>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  Additional back design (+$30 setup per color + print costs)
                </div>
                {addOns.extraLocations.backPrint &&
                  renderAddOnColorSelection('backPrint', 'Back Print')}
              </div>
            </AddOnCard>
          </div>

          {/* Neck Tag Add-On */}
          <div
            style={{
              gridColumn: addOns.extraLocations.neckTag ? '1 / -1' : 'auto',
            }}
          >
            <AddOnCard
              selected={addOns.extraLocations.neckTag}
              onClick={() => handleExtraLocationChange('neckTag')}
            >
              <div style={{ width: '100%' }}>
                <strong>Neck Tag Printing</strong>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  Custom label inside neck (+$30 setup + print costs)
                </div>
                {addOns.extraLocations.neckTag &&
                  renderAddOnColorSelection('neckTag', 'Neck Tag')}
              </div>
            </AddOnCard>
          </div>

          {/* Sleeve Print Add-On */}
          <div
            style={{
              gridColumn: addOns.extraLocations.sleeve ? '1 / -1' : 'auto',
            }}
          >
            <AddOnCard
              selected={addOns.extraLocations.sleeve}
              onClick={() => handleExtraLocationChange('sleeve')}
            >
              <div style={{ width: '100%' }}>
                <strong>Sleeve Print</strong>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  Left or right sleeve design (+$30 setup + print costs)
                </div>
                {addOns.extraLocations.sleeve &&
                  renderAddOnColorSelection('sleeve', 'Sleeve')}
              </div>
            </AddOnCard>
          </div>

          {/* Other Location Add-On */}
          <div
            style={{
              gridColumn: addOns.extraLocations.other ? '1 / -1' : 'auto',
            }}
          >
            <AddOnCard
              selected={addOns.extraLocations.other}
              onClick={() => handleExtraLocationChange('other')}
            >
              <div style={{ width: '100%' }}>
                <strong>Other Location</strong>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  Pocket, hem, etc. (+$30 setup per color + print costs)
                </div>
                {addOns.extraLocations.other &&
                  renderAddOnColorSelection('other', 'Other Location')}
              </div>
            </AddOnCard>
          </div>
          <div style={{ position: 'relative' }}>
            <AddOnCard
              selected={addOns.rushOrder}
              onClick={() => setShowRushOptions(!showRushOptions)}
            >
              <strong>Rush Order</strong>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                {addOns.rushOrder
                  ? RUSH_ORDER_OPTIONS.find(
                      (option) => option.value === addOns.rushOrder,
                    )?.label +
                    ' ' +
                    RUSH_ORDER_OPTIONS.find(
                      (option) => option.value === addOns.rushOrder,
                    )?.description
                  : 'Select turnaround time'}
              </div>
              <span
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.8rem',
                }}
              >
                {showRushOptions ? '▲' : '▼'}
              </span>
            </AddOnCard>

            {showRushOptions && (
              <DropdownContainer>
                <DropdownOption
                  onClick={() => {
                    setAddOns((prev) => ({ ...prev, rushOrder: null }));
                    setShowRushOptions(false);
                  }}
                  selected={!addOns.rushOrder}
                >
                  Standard Turnaround (No rush)
                </DropdownOption>
                {RUSH_ORDER_OPTIONS.map((option) => (
                  <DropdownOption
                    key={option.value}
                    onClick={() => {
                      setAddOns((prev) => ({
                        ...prev,
                        rushOrder: option.value,
                      }));
                      setShowRushOptions(false);
                    }}
                    selected={addOns.rushOrder === option.value}
                  >
                    <div>
                      <strong>{option.label}</strong>
                      <span style={{ marginLeft: '8px', color: '#666' }}>
                        {option.description}
                      </span>
                    </div>
                  </DropdownOption>
                ))}
                <DropdownNote>* 1 Day turnaround not available</DropdownNote>
              </DropdownContainer>
            )}
          </div>
        </AddOnGrid>
      </AddOnSection>

      {quote && (
        <>
          <div
            style={{
              background: '#F0F7FF',
              border: '1px solid #2563EB',
              borderRadius: '8px',
              padding: '1rem',
              margin: '1rem 0',
              fontSize: '0.9rem',
              color: '#1E40AF',
            }}
          >
            <strong>Printing Costs:</strong> Each additional location (back,
            sleeve, etc.) adds both setup fees and per-shirt printing charges.
            {totalLocations > 1 &&
              ` Currently printing on ${totalLocations} locations.`}
          </div>
          <QuoteDisplay>
            <div
              style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                marginBottom: '1.5rem',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                Quote for {quantity} shirts
              </div>
              <div
                style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', opacity: '0.9' }}
              >
                ${(parseFloat(quote.totalWithTax) / quantity).toFixed(2)} per
                shirt
              </div>
              {quote.rushOrder && (
                <div
                  style={{
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                    color: '#DC2626',
                    fontWeight: '600',
                    marginTop: '0.5rem',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  Includes {quote.rushPremium}% rush premium (
                  {
                    RUSH_ORDER_OPTIONS.find(
                      (opt) => opt.value === quote.rushOrder,
                    )?.label
                  }
                  )
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              }}
            >
              {/* Garments */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '8px',
                  gap: '12px',
                }}
              >
                <span style={{ flex: '1', lineHeight: '1.3' }}>
                  Garments ({quantity} × ${quote.garmentCostPerShirt})
                </span>
                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                  ${(quantity * quote.garmentCostPerShirt).toFixed(2)}
                </span>
              </div>

              {/* Setup Fees */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '8px',
                  gap: '12px',
                }}
              >
                <span style={{ flex: '1', lineHeight: '1.3' }}>Setup Fees</span>
                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                  ${quote.setupTotal.toFixed(2)}
                </span>
              </div>

              {/* Printing */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '8px',
                  gap: '12px',
                }}
              >
                <span style={{ flex: '1', lineHeight: '1.3' }}>
                  Printing{' '}
                  {totalLocations > 1
                    ? `(${quantity} shirts × ${totalLocations} locations)`
                    : `(${quantity} shirts)`}
                </span>
                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                  ${(quote.printingTotal || 0).toFixed(2)}
                </span>
              </div>
              {/* Subtotal */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(229, 231, 235, 0.8)',
                  fontWeight: '500',
                  gap: '12px',
                }}
              >
                <span>Subtotal</span>
                <span style={{ fontWeight: '600' }}>${quote.subtotal}</span>
              </div>

              {/* HST/Tax */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  gap: '12px',
                }}
              >
                <span>HST{quote.rushOrder ? ' + Rush Premium' : ''}</span>
                <span style={{ fontWeight: '600' }}>
                  $
                  {(
                    parseFloat(quote.totalWithTax) - parseFloat(quote.subtotal)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Final Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '2px solid rgba(37, 99, 235, 0.8)',
                  fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  padding: '12px 8px',
                  borderRadius: '6px',
                  gap: '12px',
                }}
              >
                <span>Total</span>
                <span>${quote.totalWithTax}</span>
              </div>

              {/* Shipping note */}
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  textAlign: 'center',
                  marginTop: '8px',
                  fontStyle: 'italic',
                }}
              >
                * Shipping costs will be calculated at checkout
                <span
                  className="info-tooltip"
                  title="First setup fee is waived—first one is on us!"
                >
                  
                </span>
              </div>
            </div>
          </QuoteDisplay>
        </>
      )}

      <SectionHeader>📝 Your Information</SectionHeader>
      <QuantitySection>
        <InputGroup>
          <label htmlFor="customer-name">Name *</label>
          <input
            id="customer-name"
            type="text"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="customer-email">
            Email *
            <span
              style={{
                fontSize: '0.8rem',
                color: '#6B7280',
                fontWeight: 'normal',
                display: 'block',
                marginTop: '4px',
              }}
            >
              We&apos;ll send your order confirmation here
            </span>
          </label>
          <input
            id="customer-email"
            type="email"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            style={{
              border:
                customerInfo.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
                  ? '2px solid #EF4444'
                  : '2px solid #E5E7EB',
            }}
          />
          {customerInfo.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email) && (
              <div
                style={{
                  color: '#EF4444',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                }}
              >
                ⚠️ Please enter a valid email address
              </div>
            )}
        </InputGroup>
        <InputGroup>
          <label htmlFor="customer-phone">Phone</label>
          <input
            id="customer-phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </InputGroup>
      </QuantitySection>

      <InputGroup style={{ marginBottom: '2rem' }}>
        <label htmlFor="design-notes">Design Notes</label>
        <textarea
          id="design-notes"
          style={{
            padding: '0.75rem',
            border: '2px solid #E5E7EB',
            borderRadius: '8px',
            resize: 'vertical',
            minHeight: '100px',
          }}
          value={customerInfo.notes}
          onChange={(e) =>
            setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Describe your design, preferred print size, and any special requests..."
        />
      </InputGroup>

      <InputGroup style={{ marginBottom: '2rem' }}>
        <div
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '0.5rem',
            display: 'block',
          }}
        >
          📁 Upload Artwork Files
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#6B7280',
            marginBottom: '1rem',
          }}
        >
          Upload your design files (.jpg, .png, .pdf, .ai, .eps, .svg, .psd)
        </div>
        <FileUpload
          maxFiles={10}
          maxSizeMB={25}
          acceptedTypes={[
            '.jpg',
            '.jpeg',
            '.png',
            '.pdf',
            '.ai',
            '.eps',
            '.svg',
            '.psd',
          ]}
          onFilesChange={setUploadedFiles}
        />
      </InputGroup>

      <SubmitButton
        type="submit"
        disabled={isSubmitting || !quote}
        style={{
          opacity: isSubmitting || !quote ? 0.6 : 1,
          cursor: isSubmitting || !quote ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting
          ? '🔄 Submitting Order...'
          : `Submit Order - $${quote ? quote.totalWithTax : '0.00'}`}
      </SubmitButton>
    </form>
  );
};

export default StreamlinedOrderForm;
