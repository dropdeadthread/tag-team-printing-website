// CommonJS wrapper for pricing functions (for Netlify functions)
// This avoids ES module issues in the build process

const PRICING_CONFIG = {
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

  // Size-based wholesale price adjustments
  SIZE_PRICING: {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 2,
    XXXL: 4,
    '4XL': 6,
    '5XL': 8,
    '6XL': 10,
  },

  SIZE_ORDER: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL'],

  FALLBACK_GARMENT_PRICE: 25.0,
};

function getMarkupMultiplier(wholesalePrice) {
  const price = parseFloat(wholesalePrice);
  const tiers = PRICING_CONFIG.GARMENT_MARKUP_TIERS;

  if (price <= tiers.LOW_COST.maxWholesale) {
    return tiers.LOW_COST.multiplier;
  } else if (price <= tiers.MID_RANGE.maxWholesale) {
    return tiers.MID_RANGE.multiplier;
  } else {
    return tiers.PREMIUM.multiplier;
  }
}

function calculateRetailPrice(wholesalePrice) {
  const price =
    parseFloat(wholesalePrice) || PRICING_CONFIG.FALLBACK_GARMENT_PRICE;
  const multiplier = getMarkupMultiplier(price);
  return (price * multiplier).toFixed(2);
}

function getQuantityBasedPrice(wholesalePrice, quantity, brandName = '') {
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
    tiers = PRICING_CONFIG.QUANTITY_PRICING_TIERS.PREMIUM_BLANKS;
  } else if (isQualityBlank) {
    tiers = PRICING_CONFIG.QUANTITY_PRICING_TIERS.QUALITY_BLANKS;
  } else {
    return calculateRetailPrice(price);
  }

  const tier = tiers.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier ? tier.price.toFixed(2) : calculateRetailPrice(price);
}

function getSizeAdjustedWholesalePrice(baseWholesalePrice, size) {
  const adjustment = PRICING_CONFIG.SIZE_PRICING[size] || 0;
  return parseFloat(baseWholesalePrice) + adjustment;
}

function sortSizesByOrder(sizesObject) {
  const sortedSizes = {};
  PRICING_CONFIG.SIZE_ORDER.forEach((size) => {
    if (sizesObject[size]) {
      sortedSizes[size] = sizesObject[size];
    }
  });
  Object.keys(sizesObject).forEach((size) => {
    if (!sortedSizes[size]) {
      sortedSizes[size] = sizesObject[size];
    }
  });
  return sortedSizes;
}

module.exports = {
  PRICING_CONFIG,
  getQuantityBasedPrice,
  calculateRetailPrice,
  getMarkupMultiplier,
  getSizeAdjustedWholesalePrice,
  sortSizesByOrder,
};
