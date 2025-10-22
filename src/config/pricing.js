// Pricing configuration for Tag Team Printing
export const PRICING_CONFIG = {
  // Quantity-based pricing tiers for competitive positioning vs 4imprint
  QUANTITY_PRICING_TIERS: {
    // Bella Canvas and premium blanks - halfway between our old pricing and 4imprint
    PREMIUM_BLANKS: [
      { minQty: 1, maxQty: 11, price: 20.95, name: 'Individual' },
      { minQty: 12, maxQty: 23, price: 16.95, name: 'Small Team' },
      { minQty: 24, maxQty: 47, price: 15.33, name: 'Medium Order' },
      { minQty: 48, maxQty: 71, price: 14.45, name: 'Large Order' },
      { minQty: 72, maxQty: 143, price: 13.58, name: 'Volume Order' },
      { minQty: 144, maxQty: 287, price: 12.95, name: 'Bulk Order' },
      { minQty: 288, maxQty: Infinity, price: 12.33, name: 'Wholesale' },
    ],
    // Quality blanks - competitive tier
    QUALITY_BLANKS: [
      { minQty: 1, maxQty: 11, price: 16.95, name: 'Individual' },
      { minQty: 12, maxQty: 23, price: 14.95, name: 'Small Team' },
      { minQty: 24, maxQty: 47, price: 13.33, name: 'Medium Order' },
      { minQty: 48, maxQty: 71, price: 12.45, name: 'Large Order' },
      { minQty: 72, maxQty: 143, price: 11.58, name: 'Volume Order' },
      { minQty: 144, maxQty: 287, price: 10.95, name: 'Bulk Order' },
      { minQty: 288, maxQty: Infinity, price: 10.33, name: 'Wholesale' },
    ],
  },

  // Legacy tiered garment markup (fallback for basic blanks)
  GARMENT_MARKUP_TIERS: {
    // Low-cost items ($4.25 and under) - 150% markup for maximum profit
    LOW_COST: { maxWholesale: 4.25, multiplier: 2.5 },
    // Mid-range items ($4.30-$6.99) - 100% markup for competitive pricing
    MID_RANGE: { maxWholesale: 6.99, multiplier: 2.0 },
    // Premium items ($7.00+) - Use quantity-based pricing instead
    PREMIUM: { maxWholesale: Infinity, multiplier: 1.6 },
  },

  // Legacy single multiplier (kept for compatibility)
  GARMENT_MARKUP_MULTIPLIER: 2.5, // Will be overridden by tiered system

  // Size-based wholesale price adjustments
  SIZE_PRICING: {
    XS: 0, // Base price
    S: 0, // Base price
    M: 0, // Base price
    L: 0, // Base price
    XL: 0, // Base price
    XXL: 2, // +$2 wholesale
    XXXL: 4, // +$4 wholesale
    '4XL': 6, // +$6 wholesale
    '5XL': 8, // +$8 wholesale
    '6XL': 10, // +$10 wholesale
  },

  // Standard size order for consistent display
  SIZE_ORDER: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL'],

  // Print pricing (these are your current rates)
  PRINT_SETUP_FEE_PER_COLOR: 30.0,
  PRINT_SETUP_FEE_UNDERBASE: 30.0,

  // Per-shirt printing costs
  PRINT_FIRST_COLOR_WITH_UNDERBASE: 2.0,
  PRINT_FIRST_COLOR_NO_UNDERBASE: 1.0, // Updated: Even simple colors have ink/printing cost
  PRINT_ADDITIONAL_COLOR_STANDARD: 1.5,
  PRINT_ADDITIONAL_COLOR_PREMIUM: 1.75,

  // Minimums - Dynamic based on color count
  MIN_QTY_ONE_COLOR: 15,
  MIN_QTY_TWO_COLOR: 20,
  MIN_QTY_THREE_COLOR: 30,
  MIN_QTY_FOUR_COLOR: 40,
  MIN_QTY_FIVE_COLOR: 50,
  MIN_QTY_SIX_COLOR: 60,

  // Tax
  TAX_RATE: 0.13, // HST

  // Fallback pricing
  FALLBACK_GARMENT_PRICE: 25.0,
};

// Get quantity-based pricing for premium and quality blanks
export function getQuantityBasedPrice(
  wholesalePrice,
  quantity,
  brandName = '',
) {
  const price = parseFloat(wholesalePrice);
  const qty = parseInt(quantity) || 1;

  // Determine if this is a premium blank (Bella Canvas, AS Colour, etc.)
  const isPremiumBlank =
    price >= 7.0 ||
    brandName.toLowerCase().includes('bella') ||
    brandName.toLowerCase().includes('canvas') ||
    brandName.toLowerCase().includes('as colour') ||
    brandName.toLowerCase().includes('next level');

  const isQualityBlank = price >= 4.3 && price < 7.0;

  let tiers;
  if (isPremiumBlank) {
    tiers = PRICING_CONFIG.QUANTITY_PRICING_TIERS.PREMIUM_BLANKS;
  } else if (isQualityBlank) {
    tiers = PRICING_CONFIG.QUANTITY_PRICING_TIERS.QUALITY_BLANKS;
  } else {
    // Use legacy markup for basic blanks
    return calculateRetailPrice(price);
  }

  // Find the appropriate tier based on quantity
  const tier = tiers.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier ? tier.price.toFixed(2) : calculateRetailPrice(price);
}

// Determine appropriate markup multiplier based on wholesale price (legacy function)
export function getMarkupMultiplier(wholesalePrice) {
  const price = parseFloat(wholesalePrice);
  const tiers = PRICING_CONFIG.GARMENT_MARKUP_TIERS;

  if (price <= tiers.LOW_COST.maxWholesale) {
    return tiers.LOW_COST.multiplier; // 2.5x for low-cost items ($4.25 and under)
  } else if (price <= tiers.MID_RANGE.maxWholesale) {
    return tiers.MID_RANGE.multiplier; // 2.0x for mid-range ($4.30-$6.99)
  } else {
    return tiers.PREMIUM.multiplier; // 1.6x for premium ($7.00+)
  }
}

// Calculate retail price from wholesale with tiered markup (legacy function)
export function calculateRetailPrice(wholesalePrice) {
  const price =
    parseFloat(wholesalePrice) || PRICING_CONFIG.FALLBACK_GARMENT_PRICE;
  const multiplier = getMarkupMultiplier(price);
  return (price * multiplier).toFixed(2);
}

// Calculate size-adjusted wholesale price
export function getSizeAdjustedWholesalePrice(baseWholesalePrice, size) {
  const adjustment = PRICING_CONFIG.SIZE_PRICING[size] || 0;
  return parseFloat(baseWholesalePrice) + adjustment;
}

// Calculate size-adjusted retail price with quantity pricing
export function getSizeAdjustedRetailPrice(
  baseWholesalePrice,
  size,
  quantity = 1,
  brandName = '',
) {
  const adjustedWholesale = getSizeAdjustedWholesalePrice(
    baseWholesalePrice,
    size,
  );
  return getQuantityBasedPrice(adjustedWholesale, quantity, brandName);
}

// Sort sizes in proper order
export function sortSizesByOrder(sizesObject) {
  const sortedSizes = {};
  PRICING_CONFIG.SIZE_ORDER.forEach((size) => {
    if (sizesObject[size]) {
      sortedSizes[size] = sizesObject[size];
    }
  });
  // Add any sizes not in our standard order at the end
  Object.keys(sizesObject).forEach((size) => {
    if (!sortedSizes[size]) {
      sortedSizes[size] = sizesObject[size];
    }
  });
  return sortedSizes;
}

// Get minimum quantity for a given color count
export function getMinimumQuantity(colorCount) {
  switch (colorCount) {
    case 1:
      return PRICING_CONFIG.MIN_QTY_ONE_COLOR;
    case 2:
      return PRICING_CONFIG.MIN_QTY_TWO_COLOR;
    case 3:
      return PRICING_CONFIG.MIN_QTY_THREE_COLOR;
    case 4:
      return PRICING_CONFIG.MIN_QTY_FOUR_COLOR;
    case 5:
      return PRICING_CONFIG.MIN_QTY_FIVE_COLOR;
    case 6:
      return PRICING_CONFIG.MIN_QTY_SIX_COLOR;
    default:
      return PRICING_CONFIG.MIN_QTY_ONE_COLOR;
  }
}

// Check if customer should see wholesale price (for admin/staff)
export function shouldShowWholesale(userRole = null) {
  // Only show wholesale to admin users
  return userRole === 'admin' || userRole === 'staff';
}
