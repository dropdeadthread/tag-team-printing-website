// Maps category slugs to category IDs - Updated for proper categorization

const categoryIdSlugMap = {
  "t-shirts": "21",           // Short sleeve T-shirts only (long sleeves excluded)
  "long-sleeves": "8",        // Long sleeve T-shirts only (specific BELLA + CANVAS styles)
  "sweatshirts": "9",         // Crewneck sweatshirts and fleece
  "hoodies": "36",            // Hooded sweatshirts
  "crewnecks": "400",         // BELLA + CANVAS sponge fleece crewnecks
  "lightweight-hoodies": "401", // BELLA + CANVAS lightweight/sponge fleece hoodies
  "polos": "2",               // Polo shirts
  "headwear": "11",           // Hats, caps, beanies
  "outerwear": "15",          // Jackets, windbreakers, etc.
  
  // Keep legacy mappings for backward compatibility
  "premium-t-shirts": "21",
  "fleece-hoodies": "36",
  "zip-ups": "15",
  "tank-tops": "64",
};

export default categoryIdSlugMap;