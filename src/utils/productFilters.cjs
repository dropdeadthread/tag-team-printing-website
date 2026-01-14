/**
 * Centralized Product Filtering Utilities
 * Used by both gatsby-node.js (build-time) and netlify/functions/list-products.js (runtime)
 * This ensures consistent filtering behavior across the entire site.
 */

const SELECTED_BRANDS = [
  'Gildan',
  'JERZEES',
  'BELLA + CANVAS',
  'Next Level',
  'Hanes',
  'Comfort Colors',
  'Threadfast Apparel',
  'M&O',
  'Richardson',
  'YP Classics',
  'Valucap',
];

const EXCLUDED_BRANDS = ['American Apparel'];

// Category IDs: 21=T-Shirts, 36=Hoodies, 400=Crewnecks, 38=Full-Zips, 56=Long Sleeves, 11=Headwear, 64=Tank Tops
const SELECTED_CATEGORIES = ['21', '36', '400', '38', '56', '11', '64'];

/**
 * Check if product title indicates youth/baby product
 */
function isYouthOrBaby(title) {
  const t = (title || '').toLowerCase();
  return (
    t.includes('youth') ||
    t.includes('toddler') ||
    t.includes('infant') ||
    t.includes('baby') ||
    t.includes('onesie')
  );
}

/**
 * Get brand name from item (handles both API casing variants)
 */
function getBrandName(item) {
  return item && (item.brandName || item.BrandName || '');
}

/**
 * Check if item is from a selected brand and not excluded
 */
function isBrandIncluded(item) {
  const brand = getBrandName(item);
  if (!brand) return false;
  if (EXCLUDED_BRANDS.includes(brand)) return false;
  if (item.noeRetailing === true) return false;
  return SELECTED_BRANDS.includes(brand);
}

/**
 * Split categories string into array of trimmed IDs
 */
function splitCategories(item) {
  const raw = item.categories || item.Categories || '';
  return raw
    .toString()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Check if item has any of the given category IDs
 */
function hasAnyCategory(item, catIds) {
  if (!item || !catIds || !catIds.length) return false;
  const ids = splitCategories(item);
  return catIds.some((c) => ids.includes(c.toString()));
}

/**
 * Filter item by specific category with detailed rules
 * This is the authoritative category filtering logic
 */
function filterByCategory(item, category) {
  if (!item) return false;
  const itemCategories = splitCategories(item);
  const title = (item.title || item.Title || item.styleName || '').toLowerCase();
  const baseCategory = (item.baseCategory || '').toLowerCase();
  const c = category && category.toString();

  switch (c) {
    case '21': // T-Shirts - exclude tanks and long sleeves
      return (
        (itemCategories.includes('21') ||
          baseCategory.includes('t-shirts') ||
          title.includes('t-shirt')) &&
        !itemCategories.includes('64') &&
        !baseCategory.includes('long sleeve') &&
        !title.includes('long sleeve') &&
        !title.includes('tank')
      );

    case '64': // Tank Tops
      return (
        itemCategories.includes('64') ||
        baseCategory.includes('tank') ||
        title.includes('tank')
      );

    case '400': // Crewnecks - category 400 doesn't exist in S&S API
      return (
        title.includes('crewneck') ||
        title.includes('crew neck') ||
        baseCategory.includes('crew')
      );

    case '36': // Hoodies
      return (
        itemCategories.includes('36') ||
        title.includes('hoodie') ||
        baseCategory.includes('hoodie')
      );

    case '38': // Full-Zip / Zip-Ups
      return (
        itemCategories.includes('38') ||
        title.includes('full-zip') ||
        title.includes('full zip') ||
        baseCategory.includes('full-zip')
      );

    case '56': // Long Sleeves
      return (
        itemCategories.includes('56') ||
        title.includes('long sleeve') ||
        baseCategory.includes('long sleeve')
      );

    case '11': // Headwear
      return itemCategories.includes('11');

    default:
      return itemCategories.includes(c);
  }
}

/**
 * Apply brand, youth, and retail filters to an array of items
 */
function applyBaseFilters(items) {
  return (items || []).filter((item) => {
    if (!isBrandIncluded(item)) return false;
    if (isYouthOrBaby(item.title || item.Title || '')) return false;
    return true;
  });
}

/**
 * Apply base filters + check if item belongs to any selected category
 * Used by gatsby-node.js to filter products for GraphQL nodes
 */
function filterForBuild(items) {
  return applyBaseFilters(items).filter((item) =>
    hasAnyCategory(item, SELECTED_CATEGORIES)
  );
}

/**
 * Sort products by brand name, then by title
 */
function sortProducts(items) {
  return (items || []).sort((a, b) => {
    const aBrand = getBrandName(a) || '';
    const bBrand = getBrandName(b) || '';
    if (aBrand !== bBrand) return aBrand.localeCompare(bBrand);
    const aTitle = (a.title || a.Title || '').toString();
    const bTitle = (b.title || b.Title || '').toString();
    return aTitle.localeCompare(bTitle);
  });
}

/**
 * Transform item for API list response
 */
function transformForList(item) {
  return {
    styleID: item.styleID,
    styleCode: item.styleName,
    styleName: item.styleName,
    title: item.title,
    name: item.title,
    description: item.description,
    brand: getBrandName(item),
    brandName: getBrandName(item),
    categories: item.categories,
    styleImage: item.styleImage,
    baseCategory: item.baseCategory,
  };
}

module.exports = {
  SELECTED_BRANDS,
  EXCLUDED_BRANDS,
  SELECTED_CATEGORIES,
  isYouthOrBaby,
  getBrandName,
  isBrandIncluded,
  splitCategories,
  hasAnyCategory,
  filterByCategory,
  applyBaseFilters,
  filterForBuild,
  sortProducts,
  transformForList,
};
