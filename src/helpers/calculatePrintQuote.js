// Inline config to avoid ES module SSR issues
const PRICING_CONFIG = {
  PRINT_SETUP_FEE_PER_COLOR: 30.0,
  PRINT_FIRST_COLOR_WITH_UNDERBASE: 2.0,
  PRINT_FIRST_COLOR_NO_UNDERBASE: 1.0,
  PRINT_ADDITIONAL_COLOR_STANDARD: 1.5,
  PRINT_ADDITIONAL_COLOR_PREMIUM: 1.75,
  TAX_RATE: 0.13,
  FALLBACK_GARMENT_PRICE: 12.0, // Reasonable mid-range fallback (includes markup)
};

// Light colors that don't need underbase
const LIGHT_COLORS = [
  'white',
  'yellow',
  'light-grey',
  'light-gray',
  'natural',
  'cream',
  'beige',
];

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

/**
 * Computes screens/underbase/per-shirt printing charge for ONE print location.
 *
 * Fixed Jul 27 2026: this used to be the only calculation calculatePrintQuote() did, with a
 * flat `locationCount` multiplier applied afterward assuming every location has the same
 * colour count and underbase need. Real orders don't work that way (e.g. 3-colour front +
 * 1-colour sleeve, or a location that doesn't need underbase when the main print does) — every
 * component calling calculatePrintQuote() ended up re-implementing a location-by-location setup
 * fee calculation locally to work around this, but none of them fixed the printing-cost side
 * the same way. This function is now run once per location (see calculatePrintQuote below) so
 * both setup fees AND printing cost are correct for real multi-location orders.
 */
function calculateLocationCharge({
  colorCount,
  garmentColor = '',
  inkColors = [],
  polyesterPercent = 0,
  isPremiumInk = false,
  needsUnderbase = null,
}) {
  const isDarkGarment =
    needsUnderbase !== null
      ? needsUnderbase
      : !LIGHT_COLORS.includes(garmentColor.toLowerCase());
  const isPolyester = polyesterPercent >= 50;

  const isOnlyWhiteInk =
    inkColors.length > 0 &&
    inkColors.every(
      (color) =>
        color.toLowerCase().includes('white') ||
        color.toLowerCase().includes('opaque white'),
    );

  let totalScreens;
  let finalNeedsUnderbase;

  if (garmentColor === 'unknown' || !garmentColor) {
    finalNeedsUnderbase = needsUnderbase !== null ? needsUnderbase : true;
    totalScreens = colorCount + (finalNeedsUnderbase ? 1 : 0);
  } else if (isDarkGarment || isPolyester) {
    if (isOnlyWhiteInk && colorCount === 1) {
      totalScreens = 1;
      finalNeedsUnderbase = false;
    } else {
      const hasWhiteInk = inkColors.some(
        (color) =>
          color.toLowerCase().includes('white') ||
          color.toLowerCase().includes('opaque white'),
      );

      if (hasWhiteInk) {
        totalScreens = colorCount;
        finalNeedsUnderbase = true;
      } else {
        totalScreens = colorCount + 1;
        finalNeedsUnderbase = true;
      }
    }
  } else {
    totalScreens = colorCount;
    finalNeedsUnderbase = false;
  }

  // Override underbase if explicitly provided (unless it's the white ink special case)
  if (
    needsUnderbase !== null &&
    !(isOnlyWhiteInk && colorCount === 1 && isDarkGarment)
  ) {
    finalNeedsUnderbase = needsUnderbase;
    totalScreens = needsUnderbase ? colorCount + 1 : colorCount;
  }

  let firstColorCharge;
  if (isOnlyWhiteInk && colorCount === 1 && isDarkGarment) {
    firstColorCharge = PRICING_CONFIG.PRINT_FIRST_COLOR_WITH_UNDERBASE;
  } else {
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

  return {
    totalScreens,
    needsUnderbase: finalNeedsUnderbase,
    setupTotal: totalScreens * PRICING_CONFIG.PRINT_SETUP_FEE_PER_COLOR,
    chargePerShirt: firstColorCharge + additionalColorCharge,
  };
}

export function calculatePrintQuote({
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
  garmentBrand = '', // eslint-disable-line no-unused-vars -- for premium pricing detection (reserved for future use)
  garmentStyle = '', // eslint-disable-line no-unused-vars -- for premium pricing detection (reserved for future use)
  // NEW: real per-location breakdown — [{ name, colorCount, needsUnderbase, inkColors }].
  // When provided, this is the source of truth and colorCount/locationCount/needsUnderbase/
  // inkColors above are ignored for the per-location math (colorCount is still used for the
  // minimum-quantity/press-limit checks below, taken from the main/first location).
  locations = null,
}) {
  const resolvedLocations =
    locations && locations.length > 0
      ? locations
      : Array.from({ length: Math.max(1, locationCount) }, () => ({
          colorCount,
          garmentColor,
          inkColors,
          polyesterPercent,
          isPremiumInk,
          needsUnderbase,
        }));

  const mainLocation = resolvedLocations[0];
  const mainColorCount = mainLocation.colorCount;

  if (garmentQty < 1 || mainColorCount < 1) {
    return {
      valid: false,
      message: 'You must select at least 1 garment and 1 print color.',
      total: 0,
    };
  }

  // Minimum order quantity is driven by the main print location's colour count — a small
  // add-on (e.g. a 1-colour sleeve print) shouldn't loosen or tighten the base minimum.
  const requiredMinimum = getMinimumQuantity(mainColorCount);
  if (garmentQty < requiredMinimum) {
    return {
      valid: false,
      message: `Minimum order for ${mainColorCount} color print${mainColorCount > 1 ? 's' : ''} is ${requiredMinimum} pieces.`,
      total: 0,
    };
  }

  // Each location is computed independently — the 6-screen press limit applies per location
  // (screens get swapped between locations on a manual press, not loaded simultaneously),
  // not summed across every print location on the order.
  const locationResults = [];
  for (const loc of resolvedLocations) {
    const result = calculateLocationCharge({
      colorCount: loc.colorCount,
      garmentColor: loc.garmentColor ?? garmentColor,
      inkColors: loc.inkColors ?? inkColors,
      polyesterPercent: loc.polyesterPercent ?? polyesterPercent,
      isPremiumInk: loc.isPremiumInk ?? isPremiumInk,
      needsUnderbase: loc.needsUnderbase ?? needsUnderbase,
    });
    if (result.totalScreens > 6) {
      return {
        valid: false,
        message: `Maximum 6 screens allowed on our press. ${loc.name ? `"${loc.name}" needs` : 'A location needs'} ${loc.colorCount} colors${result.needsUnderbase ? ' + underbase' : ''} = ${result.totalScreens} screens.`,
        total: 0,
      };
    }
    locationResults.push(result);
  }

  const setupTotal = locationResults.reduce((sum, r) => sum + r.setupTotal, 0);
  const totalScreens = locationResults.reduce(
    (sum, r) => sum + r.totalScreens,
    0,
  );
  const totalChargePerShirt = locationResults.reduce(
    (sum, r) => sum + r.chargePerShirt,
    0,
  );

  const garmentCostPerShirt = garmentWholesalePrice
    ? parseFloat(garmentWholesalePrice)
    : PRICING_CONFIG.FALLBACK_GARMENT_PRICE;

  const printingCostPerShirt = garmentCostPerShirt + totalChargePerShirt;

  let subtotal = garmentQty * printingCostPerShirt + setupTotal;

  const rushOrderOptions = {
    '5day': 0.2,
    '4day': 0.3,
    '3day': 0.5,
    '2day': 1.0,
  };

  let rushPremium = 0;
  if (rushOrder && rushOrderOptions[rushOrder]) {
    rushPremium = rushOrderOptions[rushOrder];
    subtotal = subtotal * (1 + rushPremium);
  }

  const taxRate = PRICING_CONFIG.TAX_RATE;
  const totalWithTax = subtotal * (1 + taxRate);

  const mainNeedsUnderbase = locationResults[0].needsUnderbase;
  const locationsSummary = resolvedLocations
    .map((loc, i) => {
      const r = locationResults[i];
      return `${loc.name ? `${loc.name}: ` : ''}${loc.colorCount} color${loc.colorCount > 1 ? 's' : ''}${r.needsUnderbase ? ' + underbase' : ''} = ${r.totalScreens} screen${r.totalScreens > 1 ? 's' : ''}`;
    })
    .join(', ');

  console.log('💰 Final pricing breakdown:', {
    garmentCostPerShirt,
    totalChargePerShirt,
    setupTotal,
    subtotal,
    totalScreens,
    locations: resolvedLocations.map((loc, i) => ({
      ...loc,
      ...locationResults[i],
    })),
  });

  return {
    valid: true,
    message: 'Quote generated successfully.',
    garmentQty,
    colorCount: mainColorCount,
    locationCount: resolvedLocations.length,
    garmentCostPerShirt,
    setupTotal,
    printingCostPerShirt,
    printingTotal: garmentQty * totalChargePerShirt,
    subtotal: subtotal.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    needsUnderbase: mainNeedsUnderbase,
    totalScreens,
    screenBreakdown: locationsSummary,
    rushOrder,
    rushPremium: rushPremium * 100,
  };
}
