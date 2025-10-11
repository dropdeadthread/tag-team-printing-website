# Tag Team Printing Website - Technical Reference

## 🏗️ Build System & Architecture

### Project Structure

- **Framework**: Gatsby.js v5.14.5 (React-based static site generator)
- **Deployment**: Netlify with build commands
- **Environment**: Node.js with PowerShell terminal
- **Workspace Path**: `C:\Users\Stacey\Documents\tag team printing website\tag team printing website`

### Build Commands

- `npm run build` - Production build (generates ~348 pages successfully)
- `npm run develop` - Development server (runs on localhost:8000)
- Build creates: 347 product pages + additional pages

### Known Build Issues

- **ESLint conflicts**: Fixed with proper .eslintrc.json configuration
- **Icon issues**: Resolved with create-icon.js script
- **Directory navigation**: Must be in correct subdirectory for commands to work

---

## 🔌 S&S ActiveWear API Integration

### Data Sources

1. **Primary**: S&S ActiveWear API (requires SNS_API_USERNAME + SNS_API_KEY)
2. **Fallback**: Local file `data/all_styles_raw.json` (1,562 total styles, 32,804 lines)

### Product Loading Process (gatsby-node.js)

```javascript
// API endpoint: https://api-ca.ssactivewear.com/v2/styles/
// Filters: Selected brands + categories
// Result: ~298 products from selected brands out of 1,266 total
```

### Selected Brands & Categories

- **Brands**: Gildan, JERZEES, BELLA + CANVAS, Next Level, Hanes, Comfort Colors, Threadfast Apparel, M&O, Richardson, YP Classics, Valucap
- **Categories**: ['21', '36', '38', '56', '9', '64', '11'] (T-shirts, hoodies, etc.)

### Product Data Structure

```json
{
  "styleID": 395,
  "styleName": "18500",
  "brandName": "Gildan",
  "title": "Heavy Blend™ Hooded Sweatshirt",
  "baseCategory": "Fleece - Core - Hood",
  "styleImage": "Images/Style/395_fm.jpg"
}
```

---

## 🖼️ Image System - CRITICAL FINDINGS ✅ SOLVED!

### S&S ActiveWear Image Reality - **THE TRUTH REVEALED!**

**❌ OLD MYTH**: S&S only provides ONE image per style
**✅ NEW FACT**: S&S provides MULTIPLE color-specific images via Products API!

### S&S API Color Image Fields (DISCOVERED 2025-10-11)

The `/v2/products/` API endpoint provides these color-specific image fields:

- `colorSwatchImage`: Images/ColorSwatch/33507_fm.jpg
- `colorFrontImage`: Images/Color/33306_f_fm.jpg ✅ (Status 200)
- `colorSideImage`: Images/Color/33306_fm.jpg
- `colorBackImage`: Images/Color/33306_b_fm.jpg
- `colorDirectSideImage`: (when available)
- `colorOnModelFrontImage`: (when available)
- `colorOnModelSideImage`: (when available)
- `colorOnModelBackImage`: (when available)

### Working Color Image URLs

- **Color front**: `https://www.ssactivewear.com/Images/Color/33306_f_fm.jpg` ✅ (Status 200)
- **Color swatch**: `https://www.ssactivewear.com/Images/ColorSwatch/33507_fm.jpg` ✅
- **Base product image**: `https://www.ssactivewear.com/Images/Style/395_fm.jpg` ✅ (Status 200)
- **Brand images**: `https://www.ssactivewear.com/Images/Brand/35_fm.jpg`

### Current Image Implementation

Located in `src/templates/SimpleProductPageTemplate.jsx`:

- Uses local mockup images for color variations
- Falls back to S&S base image when mockups fail
- Categories: T-SHIRT, HOODIE, CREWNECK, HEADWEAR

---

## 🎨 Color System Analysis

### User Problem Statement

> "s&s provides blank images of all the shirt colors and we don't have them wired up to our swatch selections. when clicking on a product a black tee populates and doesn't change when a different shirt color is chosen"

### Reality Check

**The core assumption was wrong**: S&S does NOT provide separate blank images for each color. They only provide one product image per style, regardless of color variants.

### Current Color Mapping

```javascript
const ssActiveWearColorMap = {
  White: { code: 'WHT', suffix: '_wht' },
  Black: { code: 'BLK', suffix: '_blk' },
  Red: { code: 'RED', suffix: '_red' },
  // ... 21 colors total
};
```

**Status**: This mapping is useless because S&S doesn't use these patterns.

---

## 🔧 API Endpoints (Local Development)

### Working Endpoints

- `http://localhost:8000/api/list-products?category=t-shirts&limit=3` ✅
- `http://localhost:8000/api/get-inventory` ✅
- `http://localhost:8000/` (Homepage) ✅

### API Response Structure

```javascript
// Typical API response from list-products
{
  products: [...], // Array of product objects
  pagination: {...},
  brandDistribution: {
    'BELLA + CANVAS': 31,
    'Gildan': 41,
    // etc.
  }
}
```

---

## 🛠️ Development Server Status

### Current State

- **Status**: Running successfully on `http://localhost:8000/`
- **Product Pages**: Generated for all 347 products
- **API Functions**: Working (inventory, product listing)
- **Build**: Successful (348 total pages)

### Known Working Product IDs

- Gildan 18500 Hoodie: `/products/395` (styleID 395)
- Gildan 12000 Crewneck: `/products/375` (styleID 375)
- Various BELLA + CANVAS, Next Level, etc.

---

## ⚠️ Critical Issues & Solutions

### Issue 1: Color-Specific Images

**Problem**: Expecting S&S to provide color-specific images
**Reality**: S&S only provides one image per style
**Solution**: Need to either:

1. Use local mockup images with color variations
2. Accept single image per product
3. Find alternative image sources

### Issue 2: Color Swatch Functionality

**Problem**: "clicking different color swatches doesn't change images"
**Root Cause**: No color-specific images exist from S&S
**Current Workaround**: Local mockup images in `/images/` directory

### Issue 3: Product Category Display

**Problem**: "hoodies showing black screens, headwear showing t-shirt images"
**Solution**: Category-specific fallback images implemented

---

## 📝 Next Steps & Decisions Needed

### Decision Required: Image Strategy

1. **Option A**: Accept single S&S image per product (simplest)
2. **Option B**: Create/source color-specific mockup images
3. **Option C**: Find alternative API that provides color images

### Technical Debt

- Remove unused color mapping system if going with Option A
- Simplify getProductImageUrl function
- Update user expectations about color image functionality

---

## � S&S API AUDIT & OPTIMIZATION

### Current API Endpoints In Use

1. **`/v2/styles/`** - Basic product info (gatsby-node.js, get-product.js)
2. **`/v2/products/`** - Detailed product + inventory (get-inventory.js, ProductPageCardLayout.jsx)
3. **`/v2/brands/`** - Brand listings (list-brands.js)
4. **`/v2/categories/`** - Category data (list-categories.js)

### API Usage Analysis

#### ✅ CORRECT Usage

- **get-inventory.js**: Uses `/v2/products/` - Gets detailed color/size/inventory data
- **gatsby-node.js**: Uses `/v2/styles/` - Efficient for bulk product loading
- **list-brands.js**: Uses `/v2/brands/` - Proper endpoint
- **list-categories.js**: Uses `/v2/categories/` - Proper endpoint

#### ⚠️ SUBOPTIMAL Usage

- **get-product.js**: Uses `/v2/styles/` but should use `/v2/products/` for color data
- **ProductPageCardLayout.jsx**: Duplicates API calls that get-inventory.js already makes

#### 🚨 MAJOR DISCOVERY (Fixed 2025-10-11)

**Problem**: We were missing color-specific images because:

1. `/v2/styles/` endpoint only provides `styleImage` (generic product image)
2. `/v2/products/` endpoint provides color-specific image fields:
   - `colorFrontImage`, `colorSideImage`, `colorBackImage`
   - `colorOnModelFrontImage`, `colorOnModelSideImage`, `colorOnModelBackImage`
   - `colorSwatchImage`

**Solution**: Modified get-inventory.js to include color image fields in color objects.

### Recommended Optimizations

1. **Consolidate API calls**: get-product.js should use `/v2/products/` for consistency
2. **Remove duplicate calls**: ProductPageCardLayout.jsx redundant with get-inventory.js
3. **Cache API responses**: Implement caching for frequently requested product data
4. **Use specific endpoints**: Match endpoint to data needed (styles for lists, products for details)

---

## 🔄 Update Log

- **2025-10-11**: Initial technical reference created
- **2025-10-11**: CORRECTED: S&S DOES provide color-specific images via `/v2/products/` API
- **2025-10-11**: Documented working API endpoints and build process
- **2025-10-11**: Fixed color image implementation using real S&S API data
- **2025-10-11**: Completed S&S API audit - identified optimization opportunities

---

## 🔍 COMPREHENSIVE API AUDIT - OCTOBER 2025

### Cart & Checkout Analysis

#### 🚨 CRITICAL ISSUES FOUND

##### Cart Storage & Management

- **Problem**: Cart uses file-based storage (`data/carts.json`) instead of session/database
- **Issue**: No user isolation, potential data loss, not scalable
- **Impact**: Cart data vulnerable to server restarts, concurrent user conflicts

##### Data Format Inconsistencies

- **Cart Context**: Uses fields like `StyleID`, `Size`, `Color`, `Quantity`
- **Checkout Flow**: Expects fields like `name`, `price`, `quantity`
- **Product APIs**: Return fields like `styleID`, `title`, `Price`
- **Impact**: Data transformation errors, broken cart/checkout flow

##### Inventory Validation Missing

- **Problem**: Cart allows adding items without real-time stock checks
- **Issue**: Users can checkout items that are out of stock
- **Impact**: Order fulfillment problems, customer disappointment

##### Square Payment Integration

- **Inconsistency**: Some areas use USD, others use CAD currency
- **Problem**: `create-checkout.js` uses CAD, `process-payment.js` uses USD default
- **Impact**: Potential payment amount mismatches

### Product Data & Search Analysis

#### 🚨 CRITICAL: Static Data Usage

- **list-products.js**: Uses cached `all_styles_raw.json` instead of live S&S API
- **search-products.js**: Searches only cached data, missing new products
- **Impact**: Website shows outdated product catalog, missing new items

#### Category Management Issues

- **Hardcoded Logic**: Category filtering uses hardcoded rules in `list-products.js`
- **Missing S&S Categories**: Not using S&S `/v2/categories/` API properly
- **Impact**: Inflexible category management, manual maintenance required

### Inventory Management Analysis

#### Mixed Data Sources

- **get-inventory.js**: Has real S&S integration but falls back to mock data frequently
- **Netlify function**: `get-inventory.js` also exists with only mock data
- **Impact**: Inconsistent inventory numbers across the site

#### No Real-Time Validation

- **Cart Operations**: No inventory check when adding items
- **Checkout**: No stock verification before payment processing
- **Impact**: Can sell out-of-stock items

### 🔧 RECOMMENDED FIXES

#### IMMEDIATE (High Priority)

1. **Fix cart data format consistency** - standardize field names across cart/checkout
2. **Implement real-time product listing** - replace static JSON with S&S API calls
3. **Add checkout inventory validation** - verify stock before payment
4. **Standardize currency handling** - fix USD/CAD inconsistencies

#### SHORT TERM (Medium Priority)

1. **Database cart storage** - replace file-based cart with proper storage
2. **Real-time search** - connect search to live S&S API instead of cached data
3. **Inventory validation in cart** - check stock when adding/updating items
4. **Dynamic category system** - use S&S category API instead of hardcoded logic

#### LONG TERM (Low Priority)

1. **API call consolidation** - optimize S&S API usage to reduce calls
2. **Caching layer** - implement Redis/similar for S&S API response caching
3. **Webhook integration** - S&S inventory updates via webhooks
4. **Performance monitoring** - track API performance and optimize bottlenecks

---

_This document should be updated every time we discover something new about the system architecture, API behavior, or build process._
