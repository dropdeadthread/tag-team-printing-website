// Wholesale pricing lookup for accurate cost calculations
// Based on actual wholesale costs from suppliers

export const WHOLESALE_PRICE_LOOKUP = {
  // Bella + Canvas
  '3001CVC': 7.75, // CVC Jersey Tee - confirmed wholesale price
  '3001': 6.50,    // Jersey Short Sleeve Tee (estimated)
  '3413': 8.25,    // Triblend Short Sleeve Tee (estimated)
  '3739': 14.50,   // Fleece Pullover Hoodie (estimated)
  
  // Gildan
  '5000': 2.50,    // Heavy Cotton Tee (estimated)
  '18500': 12.00,  // Heavy Blend Hooded Sweatshirt (estimated)
  '64000': 4.25,   // Softstyle T-Shirt (estimated)
  
  // Add more as you get actual wholesale costs
};

export function getWholesalePrice(styleID, apiRetailPrice) {
  // Check if we have actual wholesale data for this style
  const knownWholesale = WHOLESALE_PRICE_LOOKUP[styleID];
  
  if (knownWholesale) {
    return knownWholesale;
  }
  
  // If no known wholesale, estimate as 60-70% of API retail price
  // This is a conservative estimate for most garment wholesale margins
  return apiRetailPrice * 0.65;
}

export function calculateYourRetailPrice(wholesalePrice, markupMultiplier = 1.4) {
  // Apply your desired markup to actual wholesale cost
  return (wholesalePrice * markupMultiplier).toFixed(2);
}
