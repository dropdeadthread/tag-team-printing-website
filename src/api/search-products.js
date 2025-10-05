const fs = require('fs')
const path = require('path')

const SELECTED_BRANDS = [
  'Gildan',
  'JERZEES', // Hanes brand
  'BELLA + CANVAS', // Note: uppercase with +
  'Next Level',
  'Hanes', // Also include in case some products use this name
  'Comfort Colors', // Popular premium cotton brand
  'Threadfast Apparel', // Quality basics brand
  'M&O', // Mills & Oliver apparel brand
  // Hat specialist brands for headwear category
  'Richardson',
  'YP Classics', 
  'Valucap'
]

const EXCLUDED_BRANDS = [
  'American Apparel'
]

module.exports = async (req, res) => {
  const { q } = req.query || {};
  if (!q) {
    res.status(400).json({ error: 'Missing search query (q)' });
    return;
  }
  
  try {
    console.log(`search-products API called with query: "${q}"`);
    
    // Read from local JSON file instead of S&S API
    const dataPath = path.join(process.cwd(), 'data', 'all_styles_raw.json')
    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(rawData)
    
    // Filter by selected brands, exclude unwanted brands, and exclude noeRetailing products
    const brandFiltered = data.filter(item => 
      SELECTED_BRANDS.includes(item.brandName) && 
      !EXCLUDED_BRANDS.includes(item.brandName) &&
      item.noeRetailing !== true  // Exclude closeout/discontinued items
    )
    
    console.log(`After brand filtering: ${brandFiltered.length} products`)
    
    // Search by brand name or product title
    const searchTerm = q.toLowerCase();
    const searchResults = brandFiltered.filter(item => {
      const brandMatch = item.brandName && item.brandName.toLowerCase().includes(searchTerm);
      const titleMatch = item.title && item.title.toLowerCase().includes(searchTerm);
      return brandMatch || titleMatch;
    });
    
    console.log(`Found ${searchResults.length} products matching "${q}"`);
    
    // Transform results to match expected format
    const results = searchResults.map(item => ({
      styleID: item.styleID,
      styleCode: item.styleName,
      styleName: item.styleName,
      title: item.title,
      name: item.title,
      description: item.description,
      brand: item.brandName,
      brandName: item.brandName,
      categories: item.categories,
      styleImage: item.styleImage,
      baseCategory: item.baseCategory
    }));
    
    console.log(`Returning ${results.length} search results`);
    res.status(200).json(results);
    
  } catch (err) {
    console.error('Error in search-products API:', err);
    res.status(500).json({ error: 'Failed to search products', details: err.message });
  }
};