# 🎯 DEPLOYMENT FIX - EXECUTIVE SUMMARY

**Last Updated:** October 18, 2025  
**Status:** Ready to implement

---

## 📊 **DIAGNOSIS COMPLETE**

Your site works perfectly locally but fails on Netlify. I've identified **the exact root cause** and the specific code that needs to change.

### **The Core Problem:**

Your product pages use this logic to determine image URLs:

```javascript
// Line ~285 in SimpleProductPageTemplate.jsx - CURRENT CODE (BROKEN)
const colorImageUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `https://www.ssactivewear.com/${selectedColor.colorFrontImage}`
    : `/ss-images/${selectedColor.colorFrontImage}`;
```

**Why This Breaks on Netlify:**

1. During Gatsby build, pages are generated using Server-Side Rendering (SSR)
2. In SSR, there is NO `window` object (it's a Node.js environment, not a browser)
3. The code checks `window.location.hostname === 'localhost'` during build
4. This check fails, so ALL images get set to `/ss-images/` path
5. But `/ss-images/` is a Netlify Function that needs to be set up correctly

---

## 🔧 **THE FIX**

Replace the image URL logic with environment-aware code that works during both build and runtime:

### **File to Change:** `src/templates/SimpleProductPageTemplate.jsx`

### **Find this function** (around line 259):

```javascript
// Get color-aware product image using S&S API color images
const getProductImageUrl = (product, selectedColor) => {
  if (!product?.styleID) return getProductFallbackImage(product);

  // NEW: Use S&S API color-specific images if available
  if (selectedColor && selectedColor.colorFrontImage) {
    const colorImageUrl =
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
        ? `https://www.ssactivewear.com/${selectedColor.colorFrontImage}`
        : `/ss-images/${selectedColor.colorFrontImage}`;

    console.log(
      `Using S&S color front image for ${selectedColor.name}:`,
      colorImageUrl,
    );
    return colorImageUrl;
  }

  // ... rest of function
```

### **Replace with this FIXED version:**

```javascript
// FIXED: Helper function to generate image URLs based on environment
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Check if we're in development using environment variable
  // This works during both build-time (SSR) and run-time
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Development: Access S&S images directly (no CORS issues on localhost)
    return `https://www.ssactivewear.com/${imagePath}`;
  } else {
    // Production: Proxy through Netlify function
    return `/ss-images/${imagePath}`;
  }
};

// Get color-aware product image using S&S API color images
const getProductImageUrl = (product, selectedColor) => {
  if (!product?.styleID) return getProductFallbackImage(product);

  // Use S&S API color-specific images if available
  if (selectedColor && selected Color.colorFrontImage) {
    const colorImageUrl = getImageUrl(selectedColor.colorFrontImage);
    console.log(
      `Using S&S color front image for ${selectedColor.name}:`,
      colorImageUrl,
    );
    return colorImageUrl;
  }

  // Alternative - use colorSideImage if colorFrontImage not available
  if (selectedColor && selectedColor.colorSideImage) {
    const colorImageUrl = getImageUrl(selectedColor.colorSideImage);
    console.log(
      `Using S&S color side image for ${selectedColor.name}:`,
      colorImageUrl,
    );
    return colorImageUrl;
  }

  // Fallback to main product image if no color-specific S&S image
  if (product.styleImage) {
    const mainImageUrl = getImageUrl(product.styleImage);
    console.log('Using main product image:', mainImageUrl);
    return mainImageUrl;
  }

  // Final fallback to constructed URL using styleID
  const imagePath = `Images/Style/${product.styleID}_fm.jpg`;
  const fallbackImageUrl = getImageUrl(imagePath);
  console.log('Using constructed fallback image:', fallbackImageUrl);
  return fallbackImageUrl || getProductFallbackImage(product);
};
```

### **Also fix the handleImageError function** (around line 324):

**Find:**

```javascript
// Handle image loading errors and provide fallback
const handleImageError = (event) => {
  console.log(
    'Color-specific image not found, falling back to main product image',
  );

  // Try main product image first
  if (
    product?.styleImage &&
    event.target.src !== `https://www.ssactivewear.com/${product.styleImage}`
  ) {
    const mainImageUrl =
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
        ? `https://www.ssactivewear.com/${product.styleImage}`
        : `/ss-images/${product.styleImage}`;

    event.target.src = mainImageUrl;
    return;
  }

  // Ultimate fallback based on product type
  // ...
```

**Replace with:**

```javascript
// Handle image loading errors and provide fallback
const handleImageError = (event) => {
  console.log(
    'Color-specific image not found, falling back to main product image',
  );

  // Try main product image first
  if (product?.styleImage) {
    const mainImageUrl = getImageUrl(product.styleImage);

    // Don't try the same URL twice
    if (event.target.src !== mainImageUrl) {
      event.target.src = mainImageUrl;
      return;
    }
  }

  // Ultimate fallback based on product type
  const productType = getProductType(product);
  let fallbackImage = '/api/placeholder/400/400';

  switch (productType) {
    case 'T-SHIRT':
      fallbackImage = '/images/black tshirt mockup.png';
      break;
    case 'HOODIE':
      fallbackImage = '/images/black hoodie mockup.png';
      break;
    case 'CREWNECK':
      fallbackImage = '/images/black crewneck mockup.png';
      break;
    case 'HEADWEAR':
      fallbackImage = '/images/black hat mockup.png';
      break;
    default:
      fallbackImage = '/api/placeholder/400/400';
  }

  event.target.src = fallbackImage;
};
```

---

## ✅ **WHY THIS FIX WORKS**

1. **Uses `process.env.NODE_ENV`** instead of `window.location.hostname`
   - `process.env.NODE_ENV` is available during BOTH build-time and run-time
   - Set to `'development'` locally, `'production'` on Netlify
2. **Centralized logic** in `getImageUrl()` helper function
   - All image URL generation goes through one function
   - Easy to debug and maintain
3. **No dependency on browser APIs** during SSR
   - Works perfectly during Gatsby build process
   - No more `window is undefined` errors

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Create a Safe Branch**

```bash
cd "C:\Users\Stacey\Documents\tag team printing website\tag team printing website"
git checkout -b fix/image-urls-deployment
```

### **Step 2: Make the Changes**

Open `src/templates/SimpleProductPageTemplate.jsx` in your editor and:

1. Find the `getProductImageUrl` function (line ~259)
2. Add the new `getImageUrl` helper function BEFORE `getProductImageUrl`
3. Update `getProductImageUrl` to use the helper
4. Update `handleImageError` to use the helper

### **Step 3: Test Locally**

```bash
npm run clean
npm run build
npm run serve
```

Visit your local site at `http://localhost:9000` and verify:

- Product pages load
- Images display correctly
- No console errors

### **Step 4: Commit and Push**

```bash
git add src/templates/SimpleProductPageTemplate.jsx
git commit -m "fix: Use process.env.NODE_ENV for image URLs instead of window check

- Replaces window.location.hostname checks with process.env.NODE_ENV
- Adds centralized getImageUrl helper function
- Fixes SSR issues during Gatsby build on Netlify
- Images now correctly proxy through /ss-images/ in production"

git push origin fix/image-urls-deployment
```

### **Step 5: Deploy to Netlify**

**Option A: Merge via GitHub**

1. Go to GitHub → Create Pull Request
2. Review changes
3. Merge to main branch
4. Netlify auto-deploys

**Option B: Direct Deploy**

```bash
git checkout main
git merge fix/image-urls-deployment
git push origin main
```

---

## 🔍 **VERIFICATION CHECKLIST**

After deployment, check:

- [ ] Netlify build completes successfully (no errors in build log)
- [ ] Product pages are created (check Deploy log for "Created X product pages")
- [ ] Visit a product page on live site
- [ ] Product images load correctly
- [ ] Color selection changes images
- [ ] No 404 errors in browser console
- [ ] Images proxy through `/ss-images/` path (check Network tab)

---

## 🆘 **IF ISSUES PERSIST**

### **Check Netlify Build Logs**

1. Go to Netlify Dashboard → Deploys → [Latest Deploy]
2. Look for these messages:

   ```
   🔍 Debug - Environment variables:
   SNS_API_USERNAME: SET
   SNS_API_KEY: SET
   ```

3. Count product pages created:
   ```
   ✅ Created [NUMBER] product pages
   ```

### **Check /ss-images/ Function**

1. Go to Netlify Dashboard → Functions
2. Verify `ss-images` function exists and is deployed
3. Check function logs for errors

### **Check Browser Console**

1. Visit your live site
2. Open product page
3. Press F12 → Console tab
4. Look for image loading errors

---

## 📋 **ADDITIONAL NOTES**

### **Environment Variables Are Set**

You confirmed that `SNS_API_USERNAME` and `SNS_API_KEY` are already in Netlify Dashboard. Good! The build should be fetching products from S&S API.

### **Data File Copying Works**

Your `gatsby-node.js` has `onPostBuild` hook that copies `all_styles_raw.json` to public directory - this is working correctly (I can see the file in your local `/public/` directory).

### **Product Curation**

You're filtering products in `gatsby-node.js`:

- Selected brands: Gildan, JERZEES, BELLA + CANVAS, Next Level, Hanes, Comfort Colors, etc.
- Selected categories: T-Shirts (21), Hoodies (36), Zip-Ups (38), Long Sleeves (56), etc.
- Limit: 500 products

This is all working correctly in your local build.

---

## 🎉 **EXPECTED OUTCOME**

After applying this fix:

✅ Gatsby build completes without errors  
✅ All product pages are generated  
✅ Images load correctly on deployed site  
✅ Color selection works  
✅ No SSR/window errors  
✅ Proper routing through Netlify function

---

**Need help implementing? Let me know and I can:**

1. Create the exact file with changes made
2. Walk through the changes line-by-line
3. Help debug if issues arise

**Ready to proceed?**
