// Debug the pricing calculation for the setup fee issue
const path = require('path');

// Mock the PRICING_CONFIG since we can't import ES modules directly
const PRICING_CONFIG = {
  PRINT_SETUP_FEE_PER_COLOR: 30.0,
  PRINT_FIRST_COLOR_WITH_UNDERBASE: 2.0,
  PRINT_FIRST_COLOR_NO_UNDERBASE: 1.0,
  PRINT_ADDITIONAL_COLOR_STANDARD: 1.5,
  TAX_RATE: 0.13,
  FALLBACK_GARMENT_PRICE: 25.0,
};

function calculatePrintQuote({
  garmentQty,
  colorCount,
  locationCount = 1,
  garmentColor = '',
  inkColors = [],
  polyesterPercent = 0,
  isPremiumInk = false,
  garmentWholesalePrice = null,
  needsUnderbase = null,
  rushOrder = null,
  garmentBrand = '',
  garmentStyle = '',
}) {
  if (garmentQty < 1 || colorCount < 1) {
    return {
      valid: false,
      message: 'You must select at least 1 garment and 1 print color.',
      total: 0,
    };
  }

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
  const isDarkGarment =
    needsUnderbase !== null
      ? needsUnderbase
      : !lightColors.includes(garmentColor.toLowerCase());

  // Check if only white ink is being used
  const isOnlyWhiteInk =
    inkColors.length > 0 &&
    inkColors.every(
      (color) =>
        color.toLowerCase().includes('white') ||
        color.toLowerCase().includes('opaque white'),
    );

  // Calculate total screens needed
  let totalScreens;
  let finalNeedsUnderbase;

  if (isDarkGarment) {
    if (isOnlyWhiteInk && colorCount === 1) {
      // Special case: Single white ink on dark garment = 1 screen only
      totalScreens = 1;
      finalNeedsUnderbase = false;
    } else {
      // Other colors on dark garments need underbase + color screens
      totalScreens = colorCount + 1; // Add underbase screen
      finalNeedsUnderbase = true;
    }
  } else {
    // Light garments: no underbase needed, just color screens
    totalScreens = colorCount;
    finalNeedsUnderbase = false;
  }

  // Override underbase if explicitly provided
  if (
    needsUnderbase !== null &&
    !(isOnlyWhiteInk && colorCount === 1 && isDarkGarment)
  ) {
    finalNeedsUnderbase = needsUnderbase;
    if (needsUnderbase) {
      totalScreens = colorCount + 1;
    } else {
      totalScreens = colorCount;
    }
  }

  // Setup fees: $30 per screen per location
  const setupTotal =
    totalScreens * locationCount * PRICING_CONFIG.PRINT_SETUP_FEE_PER_COLOR;

  console.log('🔍 Debug Pricing Calculation:');
  console.log('- Garment Color:', garmentColor);
  console.log('- Ink Colors:', inkColors);
  console.log('- Color Count:', colorCount);
  console.log('- Is Dark Garment:', isDarkGarment);
  console.log('- Needs Underbase (calculated):', finalNeedsUnderbase);
  console.log('- Total Screens:', totalScreens);
  console.log('- Setup Total:', setupTotal);
  console.log('- Setup per screen:', PRICING_CONFIG.PRINT_SETUP_FEE_PER_COLOR);

  return {
    valid: true,
    setupTotal,
    totalScreens,
    needsUnderbase: finalNeedsUnderbase,
    screenBreakdown: `${colorCount} color${colorCount > 1 ? 's' : ''}${finalNeedsUnderbase ? ' + underbase' : ''} = ${totalScreens} screen${totalScreens > 1 ? 's' : ''}`,
  };
}

// Test the scenario: 50 red tees, white underbase, yellow ink
console.log('=== Scenario: 50 red tees + white underbase + yellow ink ===');
const result = calculatePrintQuote({
  garmentQty: 50,
  colorCount: 1, // just yellow (underbase is handled separately)
  locationCount: 1,
  needsUnderbase: true, // explicitly set underbase
  garmentColor: 'red',
  inkColors: ['yellow'], // just the yellow ink color
  garmentWholesalePrice: 6.25,
});

console.log('Result:', result);
