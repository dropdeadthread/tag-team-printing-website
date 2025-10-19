# 🔧 COMMON TASKS - Step-by-Step Guides

**Last Updated: October 18, 2025**

---

## 📋 **TABLE OF CONTENTS**

1. [Adding a New Product Category](#adding-a-new-product-category)
2. [Fixing Image Loading Issues](#fixing-image-loading-issues)
3. [Adding Environment Variables](#adding-environment-variables)
4. [Deploying Changes](#deploying-changes)
5. [Debugging Build Failures](#debugging-build-failures)
6. [Adding a New Page](#adding-a-new-page)
7. [Modifying the Checkout Flow](#modifying-the-checkout-flow)
8. [Updating S&S Product Filters](#updating-ss-product-filters)

---

## 1️⃣ **ADDING A NEW PRODUCT CATEGORY**

### **Goal:** Display products from a new S&S category

### **Steps:**

1. **Find the S&S Category ID:**

   - Visit S&S API docs or use `/api/categories` endpoint
   - Note the category ID (e.g., `21` = T-Shirts, `36` = Hoodies)

2. **Update gatsby-node.js:**

   ```javascript
   // Find the SELECTED_CATEGORIES array
   const SELECTED_CATEGORIES = [
     '21', // T-Shirts
     '36', // Hoodies
     '38', // Zip-Ups
     'XX', // ← ADD YOUR NEW CATEGORY ID HERE
   ];
   ```

3. **Test Locally:**

   ```bash
   npm run clean
   npm run build
   # Look for "Created X product pages" - should be more now
   npm run serve
   ```

4. **Add to Navigation (Optional):**

   ```javascript
   // src/components/Header.jsx
   const categories = [
     { id: '21', slug: 't-shirts', name: 'T-Shirts' },
     { id: 'XX', slug: 'your-category', name: 'Your Category' },
   ];
   ```

5. **Deploy:**
   ```bash
   git add gatsby-node.js src/components/Header.jsx
   git commit -m "feat: add [category name] to product catalog"
   git push origin main
   ```

---

## 2️⃣ **FIXING IMAGE LOADING ISSUES**

### **Problem:** Images show broken/don't load in production

### **Diagnosis:**

1. **Check Browser Console (F12):**

   ```
   ❌ Failed to load resource: net::ERR_BLOCKED_BY_RESPONSE
   ```

   = CORS issue, need to use proxy

2. **Check Image URL:**

   ```javascript
   // ❌ WRONG in production
   https://www.ssactivewear.com/Images/...

   // ✅ CORRECT in production
   /ss-images/Images/...
   ```

### **Solution:**

**In any component using S&S images:**

```javascript
// Add this helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return `https://www.ssactivewear.com/${imagePath}`;
  } else {
    return `/ss-images/${imagePath}`;
  }
};

// Use it like this:
<img src={getImageUrl(product.styleImage)} alt={product.title} />;
```

**Why This Works:**

- Local development: Direct access (no CORS)
- Production: Proxies through Netlify Function

### **Verify ss-images Function Exists:**

```bash
# Check netlify/functions/ss-images.js exists
ls netlify/functions/ss-images.js

# If not, you need to create it (see TAG_TEAM_ARCHITECTURE.md)
```

---

## 3️⃣ **ADDING ENVIRONMENT VARIABLES**

### **For Local Development:**

1. **Add to .env.development:**

   ```bash
   NEW_API_KEY=your-key-here
   ANOTHER_VAR=some-value
   ```

2. **Never commit .env files!** (They're in .gitignore)

### **For Netlify (Production):**

1. **Go to Netlify Dashboard:**

   - Your Site → Site Settings → Environment Variables

2. **Click "Add a variable"**

3. **Add Key and Value:**

   ```
   Key: NEW_API_KEY
   Value: your-key-here
   ```

4. **Mark as Secret (if sensitive):**

   - Check "Keep this value secret"

5. **Choose Scope:**

   - All deployments (usually)
   - Or specific branches if needed

6. **Save and Redeploy:**
   ```bash
   # Trigger new build to pick up new env var
   git commit --allow-empty -m "chore: trigger rebuild for env vars"
   git push origin main
   ```

### **Using in Code:**

```javascript
// In Netlify Functions:
const apiKey = process.env.NEW_API_KEY;

// In Gatsby (browser-accessible):
// Must prefix with GATSBY_
const publicKey = process.env.GATSBY_PUBLIC_KEY;
```

**Important Rules:**

- Server-side only: No prefix needed
- Client-side (browser): MUST prefix with `GATSBY_`
- NEVER put secrets in `GATSBY_` vars (they're public!)

---

## 4️⃣ **DEPLOYING CHANGES**

### **Standard Deployment Flow:**

```bash
# 1. Create a branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... edit files ...

# 3. Test locally FIRST
npm run clean
npm run build
npm run serve
# Open http://localhost:9000 and test

# 4. Stage changes
git add .

# 5. Commit with clear message
git commit -m "feat: add new feature description"

# 6. Push to GitHub
git push origin feature/your-feature-name

# 7. Create Pull Request on GitHub
# Go to GitHub → Pull Requests → New Pull Request

# 8. Review and Merge
# Once approved, merge to main

# 9. Netlify Auto-Deploys
# Watch the deploy at app.netlify.com
```

### **Hotfix (Emergency):**

```bash
# For urgent fixes, can push directly to main
git checkout main
git pull origin main

# Make fix
# ... edit files ...

# Test quickly
npm run build

# Commit and push
git add .
git commit -m "fix: urgent bug fix description"
git push origin main

# Monitor Netlify deploy
```

---

## 5️⃣ **DEBUGGING BUILD FAILURES**

### **Step 1: Read the Build Log**

1. Go to Netlify → Deploys → [Failed Deploy]
2. Click "View log"
3. Scroll to find the red error message

### **Common Errors & Solutions:**

#### **Error: "Secrets detected in build"**

```
❌ Secret env var "CONTROL_HUB_API_KEY"'s value detected
```

**Solution:**

- Find the file mentioned in error
- Remove hardcoded secrets
- Use environment variables instead
- See CONTROL_HUB_SETUP_GUIDE.md

#### **Error: "window is not defined"**

```
❌ ReferenceError: window is not defined
```

**Solution:**

- Find where `window` is used during build
- Add SSR-safe check:
  ```javascript
  if (typeof window !== 'undefined') {
    // Browser-only code
  }
  ```

#### **Error: "GraphQL: Cannot query field"**

```
❌ Cannot query field "styleName" on type "SsProduct"
```

**Solution:**

- Check gatsby-node.js → sourceNodes
- Verify S&S API credentials in env vars
- Check that data is being fetched

#### **Error: "Module not found"**

```
❌ Cannot find module './nonexistent-file'
```

**Solution:**

- Check file path (case-sensitive!)
- Verify file exists
- Check import statement syntax

### **Step 2: Reproduce Locally**

```bash
# Clean everything
npm run clean
rm -rf node_modules
rm package-lock.json

# Fresh install
npm install

# Try building
npm run build

# If it works locally, issue is with Netlify config
# If it fails locally, fix the error
```

### **Step 3: Check Environment Variables**

```bash
# In Netlify Dashboard:
# Site Settings → Environment Variables

# Verify all required vars exist:
# - SNS_API_USERNAME
# - SNS_API_KEY
# - GATSBY_SQUARE_APP_ID
# - (etc.)
```

---

## 6️⃣ **ADDING A NEW PAGE**

### **Static Page (No Dynamic Data):**

1. **Create file in src/pages/:**

   ```jsx
   // src/pages/about.jsx
   import React from 'react';
   import Layout from '../components/Layout';

   const AboutPage = () => {
     return (
       <Layout>
         <h1>About Us</h1>
         <p>Your content here...</p>
       </Layout>
     );
   };

   export default AboutPage;
   ```

2. **That's it!** Gatsby auto-creates route `/about`

3. **Test:**
   ```bash
   npm run develop
   # Visit http://localhost:8000/about
   ```

### **Dynamic Page (With GraphQL):**

See gatsby-node.js → createPages for examples

---

## 7️⃣ **MODIFYING THE CHECKOUT FLOW**

### **Add a Custom Field:**

1. **Update src/pages/checkout.jsx:**

   ```jsx
   const [customField, setCustomField] = useState('');

   // Add to form:
   <input
     type="text"
     value={customField}
     onChange={(e) => setCustomField(e.target.value)}
     placeholder="Custom field"
   />;
   ```

2. **Include in order data:**

   ```jsx
   const orderData = {
     ...existingOrderData,
     customField: customField,
   };
   ```

3. **Update Control Hub to receive it:**
   - Modify `backend/routes/webhooks.js`
   - Add field to order schema

### **Change Payment Processor:**

Currently using Square. To switch:

1. Update payment form in checkout.jsx
2. Create new Netlify function for new processor
3. Update environment variables
4. Test thoroughly!

---

## 8️⃣ **UPDATING S&S PRODUCT FILTERS**

### **Change Which Brands Appear:**

**Edit gatsby-node.js:**

```javascript
const SELECTED_BRANDS = [
  'Gildan',
  'Bella + Canvas',
  'Next Level',
  // Add your brand here
  'New Brand Name',
];
```

### **Change Price Range:**

```javascript
// Filter products by price
const filteredByPrice = allProducts.filter((product) => {
  const price = parseFloat(product.price);
  return price >= 5.0 && price <= 50.0; // Adjust range
});
```

### **Limit Total Products:**

```javascript
// Limit to first 500 products
const limitedProducts = filteredProducts.slice(0, 500);
```

### **After Changes:**

```bash
npm run clean
npm run build
# Check output: "Created X product pages"
npm run serve
# Verify products look correct
git commit -m "feat: update product filters"
git push origin main
```

---

## 🎯 **QUICK REFERENCE**

### **Most Common Commands:**

```bash
# Start development
npm run develop

# Clean build cache
npm run clean

# Build for production
npm run build

# Test production build locally
npm run serve

# Deploy (push to main)
git push origin main
```

### **Most Common Files to Edit:**

- **gatsby-node.js** - Product filtering, page generation
- **src/pages/** - Add/edit static pages
- **src/templates/** - Modify product page template
- **src/components/** - Reusable UI components
- **netlify/functions/** - Backend API logic

### **Most Common Issues:**

1. Images not loading → Use getImageUrl helper
2. Build fails → Check env vars in Netlify
3. Products not generating → Check S&S API credentials
4. Window errors → Add SSR-safe checks

---

**Need more help?** Check:

- TAG_TEAM_ARCHITECTURE.md for technical details
- PROJECT_BLUEPRINT.md for system overview
- AI_ASSISTANT_QUICK_START.md for general guidance
