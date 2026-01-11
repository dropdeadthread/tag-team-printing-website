# Tag Team Printing Website - Project Documentation

## Project Overview

**Site URL:** https://tagteamprints.com
**Framework:** Gatsby 5 (React-based static site generator)
**Deployment:** Netlify (with GitHub Actions integration)
**Backend:** Netlify Functions (Serverless) + Gatsby API routes in `src/api/`
**Product Catalog:** S&S ActiveWear API (real-time product data)

Tag Team Printing is a screen printing business based in Cornwall, ON that specializes in custom apparel printing. The website provides:

- Product catalog with 241+ products from major brands
- Custom order forms for quotes and print jobs
- Integrated checkout via Square payments
- Design services FAQ and customer support information

## Architecture

### Static Site Generation (Build Time)

- **gatsby-node.js** sources product data from S&S ActiveWear API during build
- Creates 241 individual product pages at `/products/[styleName]`
- Creates 7 category pages: T-Shirts, Hoodies, Crewnecks, Zip-Ups, Long Sleeves, Headwear, Tank Tops
- GraphQL data layer for querying product information
- Falls back to local cached data (`data/all_styles_raw.json`) if API unavailable

### Runtime (Serverless Functions)

- **netlify/functions/list-products.js** serves product listings to category pages
- Implements same filtering logic as build-time for consistency
- Handles pagination and category-specific filtering
- Uses S&S API credentials from environment variables

### Key Technologies

- **React 18** with Hooks
- **Styled Components** for CSS-in-JS styling
- **GraphQL** for data queries
- **Netlify Forms** for order submissions
- **Square SDK** for payment processing
- **Google Analytics 4** for tracking

## Environment Variables

### Required for Build & Runtime

```
SNS_API_USERNAME=419372
SNS_API_KEY=[set in Netlify Dashboard]
```

### Production Environment (.env.production)

```
GATSBY_GA_TRACKING_ID=G-220DWNXBFQ
GATSBY_SQUARE_APP_ID=sq0idp-5lvym4cTdjzdki3BV6B2MA
GATSBY_SQUARE_LOCATION_ID=DVTVP2H4C8A0X
CLOUDINARY_CLOUD_NAME=dnsgrkjha
SITE_URL=https://tagteamprints.com
MAX_FILE_SIZE_MB=25
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,ai,eps,psd,svg
```

### Netlify Dashboard Configuration

Set these as Environment Variables in Netlify Dashboard (NOT committed to Git):

- `SQUARE_ACCESS_TOKEN` - Square payment processing token
- `CONTROL_HUB_URL` - Your centralized Control Hub backend URL (e.g., `https://hub.yourdomain.com`)
- `CONTROL_HUB_API_KEY` - API key for Control Hub authentication
- `CONTROL_HUB_WEBHOOK_SECRET` - Webhook validation secret for Control Hub
- `CLOUDINARY_API_KEY` (if using) - Cloudinary media uploads
- `CLOUDINARY_API_SECRET` (if using) - Cloudinary media uploads

**Note:** Contact form now sends submissions to Control Hub (falls back to local JSON if unavailable)

### GitHub Secrets (for GitHub Actions)

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

## Product Catalog Configuration

### Selected Brands (11 total)

```javascript
const SELECTED_BRANDS = [
  'Gildan',
  'JERZEES',
  'BELLA + CANVAS',
  'Next Level',
  'Hanes',
  'Comfort Colors',
  'Threadfast Apparel',
  'M&O',
  'Richardson', // Headwear specialist
  'YP Classics', // Headwear specialist
  'Valucap', // Headwear specialist
];
```

### Product Categories

| Category ID | Slug         | Name         | Notes                                                                        |
| ----------- | ------------ | ------------ | ---------------------------------------------------------------------------- |
| 21          | t-shirts     | T-Shirts     | Excludes long sleeve & tanks                                                 |
| 64          | tank-tops    | Tank Tops    |                                                                              |
| 56          | long-sleeves | Long Sleeves |                                                                              |
| 36          | hoodies      | Hoodies      |                                                                              |
| 400         | crewnecks    | Crewnecks    | ⚠️ Category 400 doesn't exist in S&S API - uses title/baseCategory filtering |
| 38          | zip-ups      | Full-Zips    |                                                                              |
| 11          | headwear     | Headwear     | Richardson, YP Classics, Valucap                                             |

### Product Filtering Logic

**Youth/Baby Exclusion:**
Filters out products with titles containing:

- "youth"
- "toddler"
- "infant"
- "baby"
- "onesie"

**Important:** Category 9 (Youth) filter was removed as it was too aggressive and excluded adult products that happen to also be available in youth sizes.

**Headwear:** Removed "5-panel only" restriction (was only showing 1 of 60 products). Now shows all category 11 products.

## Critical Files

### gatsby-node.js

**Purpose:** Build-time product data sourcing and page creation
**Key Functions:**

- `sourceNodes()` - Fetches from S&S API or falls back to local cache
- `createPages()` - Creates category pages and individual product pages
- `createSchemaCustomization()` - Defines GraphQL schema
- `onPostBuild()` - Copies data files to public directory

**Key Code Sections:**

- Lines 48-148: Local fallback data loading with brand/category filtering
- Lines 150-305: S&S API fetching with same filtering logic
- Lines 308-378: Page creation for categories and products

### netlify/functions/list-products.js

**Purpose:** Runtime product listing API for category pages
**Key Functions:**

- Validates category parameter
- Fetches from S&S API or falls back to local cache
- Implements category-specific filtering logic
- Handles pagination

**Category 400 (Crewnecks) Special Handling:**

```javascript
if (category.toString() === '400') {
  // Category 400 doesn't exist in S&S API, use title/baseCategory
  return (
    title.includes('crewneck') ||
    title.includes('crew neck') ||
    baseCategory.includes('crew')
  );
}
```

**Critical Fixes Applied:**

1. Added `.trim()` when splitting categories (lines 137, 154)
2. Removed aggressive category 9 filter
3. Added explicit category filtering for each category type
4. Removed 5-panel headwear restriction

### src/pages/faq.jsx

**Purpose:** Customer-facing FAQ page
**Recent Updates:**

- Enhanced art submission requirements (Vector files: .AI, .EPS, .PDF)
- Added "changes must be made in writing" emphasis
- Expanded additional charges section with all pricing details
- Added colour garments section (base/flash requirements)
- Clarified 3-day approval requirement before due date
- Updated spoilage/damage rate policy

### src/templates/CategoryTemplate.jsx

**Purpose:** Dynamic category page template
**Data Source:** Fetches from `/api/list-products?category=[id]&page=[n]&limit=20`

### src/templates/SimpleProductPageTemplate.jsx

**Purpose:** Individual product detail page template
**Data Source:** GraphQL query for product data + S&S API for real-time inventory/pricing

## Known Issues & Solutions

### Issue 1: Category 400 (Crewnecks) Doesn't Exist in S&S API

**Solution:** Implemented fallback filtering using title and baseCategory fields instead of category ID

### Issue 2: Headwear "5-Panel Only" Filter Too Restrictive

**Solution:** Removed restriction, now showing all 60 headwear products from category 11

### Issue 3: Missing `.trim()` in Category Filtering

**Solution:** Added `.map(id => id.trim())` after splitting categories to handle whitespace

### Issue 4: Build vs Runtime Filtering Inconsistency

**Solution:** Ensured both gatsby-node.js and list-products.js use identical filtering logic

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run develop
# Server: http://localhost:8000/
# GraphiQL: http://localhost:8000/___graphql

# Build for production
npm run build

# Serve production build locally
npm run serve

# Clean Gatsby cache (use when data structure changes)
gatsby clean

# Lint code
npm run lint
```

## Deployment Process

### Automatic Deployment (Recommended)

1. Push to `main` branch on GitHub
2. GitHub Actions triggers Netlify build
3. Netlify runs `npm run build`
4. Deploys to https://tagteamprints.com

### Manual Deployment

```bash
npm run build
netlify deploy --prod
```

### Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:

- `SNS_API_USERNAME=419372`
- `SNS_API_KEY=[get from S&S ActiveWear account]`
- `SQUARE_ACCESS_TOKEN=[get from Square Dashboard]`

## Recent Fixes (October 2025)

### Session 1: ESLint & Category Mapping

- Fixed ESLint errors in styled components
- Fixed category mapping bugs in gatsby-node.js
- Added `.trim()` to category splitting
- Removed aggressive category 9 filter
- Deployed to production

### Session 2: Runtime Category Filtering

- Fixed same bugs in netlify/functions/list-products.js
- Implemented category 400 (Crewnecks) fallback filtering
- Removed 5-panel headwear restriction
- Updated FAQ page with detailed pricing/policy information
- Started dev server and verified S&S API connection
- Product count increased from 131 → 241 pages

## Testing Checklist

### Before Deployment

- [ ] Run `npm run lint` - No ESLint errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Check product count in build logs (should be ~241 products)
- [ ] Verify S&S API connection (HTTP 200 response)
- [ ] Test all 7 category pages load products
- [ ] Test individual product pages display correctly
- [ ] Verify FAQ page content matches quick order page

### After Deployment

- [ ] Test https://tagteamprints.com loads
- [ ] Check all category pages show products:
  - T-Shirts (21)
  - Tank Tops (64)
  - Long Sleeves (56)
  - Hoodies (36)
  - Crewnecks (400) - Should show ~23 products
  - Zip-Ups (38)
  - Headwear (11) - Should show ~60 products
- [ ] Verify product detail pages load
- [ ] Test order form submission
- [ ] Check Square payment integration

## Troubleshooting

### "0 products found" in category pages

**Cause:** Runtime filtering bug in list-products.js
**Solution:** Check category filtering logic matches gatsby-node.js

### Missing headwear products

**Cause:** 5-panel only filter or category 11 not included
**Solution:** Verify line 221 in list-products.js returns `itemCategories.includes('11')`

### Crewnecks showing 0 products

**Cause:** Category 400 doesn't exist in S&S API
**Solution:** Use title/baseCategory fallback filtering (lines 182-189 in list-products.js)

### Build fails with S&S API error

**Cause:** Missing or invalid API credentials
**Solution:** Check SNS_API_USERNAME and SNS_API_KEY are set correctly. Build will fall back to local cache in `data/all_styles_raw.json` if API fails.

### ESLint errors on commit

**Cause:** Pre-commit hook runs ESLint
**Solution:** Fix ESLint errors before committing. Common issues:

- Unescaped quotes in JSX (use `&apos;` for apostrophes)
- Unused variables
- Missing prop-types

## Contact Information

**Business:** Tag Team Printing
**Location:** 1014 First St E., Cornwall, ON
**Website:** https://tagteamprints.com

## Project Structure

```
tag team printing website/
├── src/
│   ├── api/                    # Gatsby API routes (runtime)
│   ├── components/             # React components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   ├── pages/                  # Static pages
│   │   ├── index.jsx           # Homepage
│   │   ├── faq.jsx             # FAQ page
│   │   ├── designer-faq.jsx    # Designer FAQ
│   │   └── ...
│   └── templates/              # Dynamic page templates
│       ├── CategoryTemplate.jsx
│       └── SimpleProductPageTemplate.jsx
├── netlify/
│   └── functions/              # Netlify serverless functions
│       └── list-products.js    # Product listing API
├── data/
│   └── all_styles_raw.json    # Cached S&S product data (fallback)
├── public/                     # Build output directory
├── gatsby-node.js             # Gatsby build configuration
├── gatsby-config.js           # Gatsby plugins & settings
├── .env.development           # Local dev environment variables
└── .env.production            # Production environment variables

```

## Additional Notes

- Product images are served from S&S ActiveWear CDN
- Local product data cache is ~11MB and contains 1,256+ products
- Build time typically 2-3 minutes on Netlify
- Development server takes ~20 seconds to start
- GraphQL schema includes custom `SsProduct` node type

---

**Last Updated:** October 28, 2025
**Current Status:** ✅ All systems operational. 241 product pages live. All category filters working correctly.
