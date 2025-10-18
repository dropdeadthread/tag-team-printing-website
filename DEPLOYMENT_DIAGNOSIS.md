# 🔍 DEPLOYMENT ISSUES - COMPREHENSIVE DIAGNOSIS

**Date:** October 18, 2025  
**Status:** Works locally, fails on Netlify

---

## 🎯 **CORE PROBLEMS IDENTIFIED**

### **Issue #1: Product Pages Not Being Created** 🚨 CRITICAL

**Location:** `gatsby-node.js` → `createPages` function

**The Problem:**

- Looking at `public/products/`, there are NO individual product pages
- Only a dynamic route fallback exists: `[styleID]/[slug]/index.html`
- This means `gatsby-node.js` is NOT successfully creating pages during build

**Why This Happens:**

```javascript
// In gatsby-node.js line ~145
const result = await graphql(`
  query {
    allSsProduct {
      nodes {
        id
        styleName
        title
      }
    }
  }
`);
```

This GraphQL query **depends on data from `sourceNodes`** which runs BEFORE `createPages`. If the S&S API call fails OR the environment variables are missing, `sourceNodes` creates NO nodes, so this query returns empty results.

**Evidence:**

- Your local build works because environment variables are in `.env.development`
- Netlify build fails because it's not accessing environment variables correctly

---

### **Issue #2: Environment Variables Not Accessible at Build Time** 🚨 CRITICAL

**Location:** `gatsby-node.js` line 8-10

**The Problem:**

```javascript
const username = process.env.SNS_API_USERNAME;
const password = process.env.SNS_API_KEY;
```

Even though these are set in Netlify Dashboard, Gatsby may not see them because:

1. **Variable naming issue**: Gatsby only exposes variables prefixed with `GATSBY_` to the browser
2. **Build context**: Node.js environment variables (without GATSBY\_ prefix) ARE available during build, BUT
3. **Timing issue**: `dotenv.config()` in `gatsby-config.js` runs AFTER Netlify sets env vars

**Solution:**
The variables ARE accessible in Node.js during build (Netlify sets them), but we need to verify they're actually being passed correctly.

---

### **Issue #3: Image URLs Break During SSR** 🔥 HIGH PRIORITY

**Location:** `src/templates/SimpleProductPageTemplate.jsx` line 285-290

**The Problem:**

```javascript
const colorImageUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `https://www.ssactivewear.com/${selectedColor.colorFrontImage}`
    : `/ss-images/${selectedColor.colorFrontImage}`;
```

**Why This Fails:**

1. During Gatsby's build (SSR), `window` is `undefined`
2. The check fails and defaults to `/ss-images/` path
3. But at build time, this creates HTML with the wrong image URLs
4. When deployed, the pages have broken image paths

**What Should Happen:**

- At **build time**: Use environment variable to determine URL strategy
- At **runtime**: Images should proxy through Netlify function `/ss-images/`

---

### **Issue #4: Data Fetching Strategy Mismatch** ⚠️ MEDIUM PRIORITY

**Location:** `src/templates/SimpleProductPageTemplate.jsx` line 16-35

**The Problem:**

```javascript
useEffect(() => {
  const loadProduct = async () => {
    const response = await fetch('/all_styles_raw.json');
    const data = await response.json();
    const foundProduct = allProducts.find(
      (p) => p.styleName === pageContext.styleCode,
    );
    setProduct(foundProduct);
  };
  loadProduct();
}, [pageContext.styleCode]);
```

**Why This Is Problematic:**

1. Product pages are created at BUILD time with data from GraphQL
2. But the template IGNORES that data and re-fetches at RUNTIME
3. This causes a loading state every time someone views a product page
4. If `/all_styles_raw.json` fails to load, products don't show

**Better Approach:**
Pass product data through `pageContext` at build time so it's immediately available.

---

## 🛠️ **THE FIX PLAN**

### **Phase 1: Verify Environment Variables in Netlify** ✅

**What to Check:**

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Verify these exist (exact names):
   ```
   SNS_API_USERNAME
   SNS_API_KEY
   ```
3. **Important**: Do NOT prefix with `GATSBY_` - these are server-side only

**Test:**
Add a console.log in `gatsby-node.js` to verify:

```javascript
console.log('🔍 ENV CHECK:', {
  hasUsername: !!process.env.SNS_API_USERNAME,
  hasKey: !!process.env.SNS_API_KEY,
  usernameLength: process.env.SNS_API_USERNAME?.length,
});
```

---

### **Phase 2: Fix Image URL Logic** 🔧

**File:** `src/templates/SimpleProductPageTemplate.jsx`

**Current Problem:**

```javascript
const colorImageUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `https://www.ssactivewear.com/${selectedColor.colorFrontImage}`
    : `/ss-images/${selectedColor.colorFrontImage}`;
```

**Fixed Version:**

```javascript
const getColorImageUrl = (colorImage) => {
  // At build time, process.env.NODE_ENV tells us the environment
  // In development, we can directly access S&S images (no CORS issues on localhost)
  // In production, we MUST proxy through Netlify function
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!colorImage) return null;

  // For development/local builds
  if (isDevelopment) {
    return `https://www.ssactivewear.com/${colorImage}`;
  }

  // For production (Netlify deployment)
  return `/ss-images/${colorImage}`;
};

// Usage:
const imageUrl = selectedColor?.colorFrontImage
  ? getColorImageUrl(selectedColor.colorFrontImage)
  : getColorImageUrl(product?.styleImage);
```

**Why This Works:**

- Uses `process.env.NODE_ENV` which is available during SSR
- No dependency on `window` object
- Correctly routes through Netlify proxy in production

---

### **Phase 3: Pass Product Data Through pageContext** 🔧

**File:** `gatsby-node.js` → `createPages` function

**Current:**

```javascript
createPage({
  path: `/products/${slug}`,
  component: path.resolve(`src/templates/SimpleProductPageTemplate.jsx`),
  context: {
    styleCode: product.styleName,
    id: product.id,
  },
});
```

**Improved:**

```javascript
createPage({
  path: `/products/${slug}`,
  component: path.resolve(`src/templates/SimpleProductPageTemplate.jsx`),
  context: {
    styleCode: product.styleName,
    id: product.id,
    // Pass full product data
    productData: {
      styleID: product.styleID,
      styleName: product.styleName,
      title: product.title,
      brandName: product.brandName,
      styleImage: product.styleImage,
      baseCategory: product.baseCategory,
      description: product.description,
    },
  },
});
```

**Then in template:**

```javascript
const SimpleProductPageTemplate = ({ pageContext }) => {
  // Use build-time data immediately, no loading state
  const [product, setProduct] = useState(pageContext.productData || null);

  // Optionally: Still fetch inventory at runtime (dynamic data)
  // But core product info is instantly available
```

---

### **Phase 4: Add Build Verification** 📊

**File:** `gatsby-node.js`

Add logging to verify pages are being created:

```javascript
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  console.log('🏗️  Starting page creation...');

  // Query products
  const result = await graphql(`...`);

  console.log('📊 GraphQL Results:', {
    totalProducts: result.data.allSsProduct.nodes.length,
    firstProduct: result.data.allSsProduct.nodes[0]?.styleName,
  });

  // Create pages
  let pagesCreated = 0;
  result.data.allSsProduct.nodes.forEach((product) => {
    const slug = product.styleName;
    if (slug) {
      createPage({...});
      pagesCreated++;
    }
  });

  console.log(`✅ Created ${pagesCreated} product pages`);
};
```

---

## 🎬 **IMPLEMENTATION STEPS**

### **Step 1: Verify Current State** (No changes to local files)

1. Check Netlify Build Logs:

   - Look for "🔍 Debug - Environment variables:" output
   - See if products are being fetched from S&S API or local fallback
   - Count how many product pages are created

2. Check Netlify Environment Variables:
   - Confirm `SNS_API_USERNAME` and `SNS_API_KEY` exist
   - Values should match what's in your local `.env.development`

---

### **Step 2: Create Fix Branch** (Protect main branch)

```bash
git checkout -b fix/deployment-images-products
```

---

### **Step 3: Apply Fixes** (In order)

1. **Fix image URL logic** (SimpleProductPageTemplate.jsx)
2. **Add build verification logging** (gatsby-node.js)
3. **Improve pageContext data** (gatsby-node.js)
4. **Test locally**: `npm run clean && npm run build && npm run serve`

---

### **Step 4: Deploy to Test**

```bash
git add .
git commit -m "fix: resolve product pages and image URLs for Netlify deployment"
git push origin fix/deployment-images-products
```

Create Pull Request on GitHub, review changes, then merge to main.

---

## ❓ **DIAGNOSTIC QUESTIONS**

Before we proceed, let's verify:

1. **Can you access your Netlify build logs?**

   - Go to: Netlify Dashboard → Your Site → Deploys → [Latest Deploy] → Deploy log
   - Look for the "🔍 Debug" output from gatsby-node.js

2. **Can you see the Environment Variables in Netlify?**

   - Go to: Netlify Dashboard → Site Settings → Environment Variables
   - Confirm SNS_API_USERNAME and SNS_API_KEY are listed

3. **What error messages appear in the deployed site?**
   - Visit your live site
   - Try to access a product page
   - Check browser console (F12) for errors

---

## 🚀 **EXPECTED OUTCOME**

After fixes:

- ✅ Product pages build successfully (visible in build logs)
- ✅ Images load via Netlify proxy function
- ✅ No console errors on deployed site
- ✅ Products display immediately (no loading spinner)
- ✅ All S&S product images visible

---

## 📝 **NEXT STEPS**

Let me know:

1. If you can access Netlify build logs and what errors you see
2. If you'd like me to create the fixed versions of the files
3. If you want me to create a safe branch first before making changes
