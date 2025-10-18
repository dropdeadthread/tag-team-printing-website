import { PRICING_CONFIG, getMinimumQuantity } from '../config/pricing';

export function calculatePrintQuote({
  garmentQty,
  colorCount,
  locationCount = 1, // NEW: number of print locations (front, back, sleeve, etc.)
  garmentColor = '',
  inkColors = [], // NEW: array of ink colors being used (e.g., ['white'], ['yellow', 'red'])
  polyesterPercent = 0,
  isPremiumInk = false,
  garmentWholesalePrice = null, // NEW: actual garment cost from API
  needsUnderbase = null, // NEW: allow override of underbase calculation
  rushOrder = null, // NEW: rush order option (5day, 4day, 3day, 2day, or null)
  garmentBrand = '', // NEW: for premium pricing detection
  garmentStyle = '', // NEW: for premium pricing detection
}) {
  if (garmentQty < 1 || colorCount < 1) {
    return {
      valid: false,
      message: 'You must select at least 1 garment and 1 print color.',
      total: 0,
    };
  }

  // === Dynamic Minimums Based on Color Count ===
  const requiredMinimum = getMinimumQuantity(colorCount);
  if (garmentQty < requiredMinimum) {
    return {
      valid: false,
      message: `Minimum order for ${colorCount} color print${colorCount > 1 ? 's' : ''} is ${requiredMinimum} pieces.`,
      total: 0,
    };
  }

  // === Screen Setup Logic ===
  // CORRECTED LOGIC:
  // - White ink on dark garments = 1 screen (white serves as both print color and underbase)
  // - Other colors on dark garments = 2 screens (underbase + print color)
  // - Any colors on light garments = 1 screen per color (no underbase needed)

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
  // Use the needsUnderbase parameter if provided, otherwise determine by color
  const isDarkGarment =
    needsUnderbase !== null
      ? needsUnderbase
      : !lightColors.includes(garmentColor.toLowerCase());
  const isPolyester = polyesterPercent >= 50;

  // Check if only white ink is being used
  const isOnlyWhiteInk =
    inkColors.length > 0 &&
    inkColors.every(
      (color) =>
        color.toLowerCase().includes('white') ||
        color.toLowerCase().includes('opaque white'),
    );

  // Calculate total screens needed based on CORRECTED logic
  let totalScreens;
  let finalNeedsUnderbase;

  if (garmentColor === 'unknown' || !garmentColor) {
    // When garment color is unknown (user choosing own blanks), use the underbase checkbox as provided
    // Default to standard calculation: base colors + underbase if specified
    finalNeedsUnderbase = needsUnderbase !== null ? needsUnderbase : true; // Default to true for safety
    totalScreens = colorCount + (finalNeedsUnderbase ? 1 : 0);
  } else if (isDarkGarment || isPolyester) {
    if (isOnlyWhiteInk && colorCount === 1) {
      // Special case: Single white ink on dark garment = 1 screen only
      totalScreens = 1;
      finalNeedsUnderbase = false; // White ink serves as its own base
    } else {
      // Check if white is in the ink colors (meaning white underbase + white ink = same screen)
      const hasWhiteInk = inkColors.some(
        (color) =>
          color.toLowerCase().includes('white') ||
          color.toLowerCase().includes('opaque white'),
      );

      if (hasWhiteInk) {
        // White underbase and white ink are the same screen, so no extra screen needed
        totalScreens = colorCount; // Just count the actual colors
        finalNeedsUnderbase = true; // Still needs underbase, but it's combined with white ink
      } else {
        // Other colors on dark garments need underbase + color screens
        totalScreens = colorCount + 1; // Add underbase screen
        finalNeedsUnderbase = true;
      }
    }
  } else {
    // Light garments: no underbase needed, just color screens
    totalScreens = colorCount;
    finalNeedsUnderbase = false;
  }

  // Override underbase if explicitly provided (unless it's the white ink special case)
  if (
    needsUnderbase !== null &&
    !(isOnlyWhiteInk && colorCount === 1 && isDarkGarment)
  ) {
    finalNeedsUnderbase = needsUnderbase;
    if (needsUnderbase) {
      totalScreens = colorCount + 1; // Force underbase screen
    } else {
      totalScreens = colorCount; // No underbase screen
    }
  }

  // Maximum 6 screens (6-color press limit)
  if (totalScreens > 6) {
    return {
      valid: false,
      message: `Maximum 6 screens allowed on our press. You have ${colorCount} colors${finalNeedsUnderbase ? ' + underbase' : ''} = ${totalScreens} screens.`,
      total: 0,
    };
  }

  // Setup fees: $30 per screen per location
  const setupTotal =
    totalScreens * locationCount * PRICING_CONFIG.PRINT_SETUP_FEE_PER_COLOR;

  // === Per Shirt Costs ===
  // Use garment price as provided (no markup calculations for now)
  const garmentCostPerShirt = garmentWholesalePrice
    ? parseFloat(garmentWholesalePrice) // Use provided price as-is
    : PRICING_CONFIG.FALLBACK_GARMENT_PRICE;

  // Special pricing logic for white ink on dark garments
  let firstColorCharge;
  if (isOnlyWhiteInk && colorCount === 1 && isDarkGarment) {
    // White ink on dark garments always gets $2.00 charge even though no separate underbase is needed
    firstColorCharge = PRICING_CONFIG.PRINT_FIRST_COLOR_WITH_UNDERBASE;
  } else {
    // Standard logic: use underbase pricing if underbase is needed
    firstColorCharge = finalNeedsUnderbase
      ? PRICING_CONFIG.PRINT_FIRST_COLOR_WITH_UNDERBASE
      : PRICING_CONFIG.PRINT_FIRST_COLOR_NO_UNDERBASE;
  }

  const additionalColorCharge =
    colorCount > 1
      ? (colorCount - 1) *
        (isPremiumInk
          ? PRICING_CONFIG.PRINT_ADDITIONAL_COLOR_PREMIUM
          : PRICING_CONFIG.PRINT_ADDITIONAL_COLOR_STANDARD)
      : 0;

  // Multiply print charges by location count
  const totalColorCharges =
    (firstColorCharge + additionalColorCharge) * locationCount;
  const printingCostPerShirt = garmentCostPerShirt + totalColorCharges;

  let subtotal = garmentQty * printingCostPerShirt + setupTotal;

  // Apply rush order premium based on selected option
  const rushOrderOptions = {
    '5day': 0.2,
    '4day': 0.3,
    '3day': 0.4,
    '2day': 0.5,
  };

  let rushPremium = 0;
  if (rushOrder && rushOrderOptions[rushOrder]) {
    rushPremium = rushOrderOptions[rushOrder];
    subtotal = subtotal * (1 + rushPremium);
  }

  const taxRate = PRICING_CONFIG.TAX_RATE;
  const totalWithTax = subtotal * (1 + taxRate);

  console.log('💰 Final pricing breakdown:', {
    garmentCostPerShirt,
    firstColorCharge,
    additionalColorCharge,
    totalColorCharges,
    setupTotal,
    subtotal,
    finalNeedsUnderbase,
    totalScreens,
  });

  return {
    valid: true,
    message: 'Quote generated successfully.',
    garmentQty,
    colorCount,
    locationCount,
    garmentCostPerShirt,
    setupTotal,
    printingCostPerShirt,
    printingTotal: garmentQty * totalColorCharges, // NEW: separate printing total for breakdown
    subtotal: subtotal.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    needsUnderbase: finalNeedsUnderbase,
    totalScreens, // Include screen count for display
    screenBreakdown: `${colorCount} color${colorCount > 1 ? 's' : ''}${finalNeedsUnderbase ? ' + underbase' : ''} = ${totalScreens} screen${totalScreens > 1 ? 's' : ''} × ${locationCount} location${locationCount > 1 ? 's' : ''}`,
    rushOrder, // Include rush order status
    rushPremium: rushPremium * 100, // Convert to percentage for display
  };
}
