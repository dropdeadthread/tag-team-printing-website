# 🔍 DEPLOYMENT VERIFICATION CHECKLIST

**Use this AFTER every deployment to verify everything works**

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **1. Environment Variables (Netlify Dashboard)**

Go to: Site Settings → Environment Variables

**Required Variables:**

- [ ] `SNS_API_USERNAME` - Set? **\_\_** (Yes/No)
- [ ] `SNS_API_KEY` - Set? **\_\_** (Yes/No)
- [ ] `SNS_BASE_URL` - Set? **\_\_** (Yes/No)
- [ ] `GATSBY_SQUARE_APP_ID` - Set? **\_\_** (Yes/No)
- [ ] `GATSBY_SQUARE_LOCATION_ID` - Set? **\_\_** (Yes/No)
- [ ] `SQUARE_ACCESS_TOKEN` - Set? **\_\_** (Yes/No)

**Optional Variables:**

- [ ] `CONTROL_HUB_API_KEY` - Set? **\_\_** (Yes/No/N/A)
- [ ] `CONTROL_HUB_URL` - Set? **\_\_** (Yes/No/N/A)

**If any are missing → Add them before deploying!**

---

## 🏗️ **BUILD VERIFICATION**

### **2. Check Build Log**

Go to: Deploys → [Latest Deploy] → View log

**Look for these SUCCESS indicators:**

- [ ] `Starting to prepare the repo for build` ✅
- [ ] `Successfully installed dependencies` ✅
- [ ] `Created [NUMBER] product pages` ✅ **← CRITICAL!**
  - How many? **\_\_\_** (should be 100+)
- [ ] `success Building production JavaScript and CSS bundles` ✅
- [ ] `Packaging Functions from netlify/functions directory` ✅
- [ ] Functions listed:
  - [ ] `get-inventory.js` ✅
  - [ ] `get-product.js` ✅
  - [ ] `list-products.js` ✅
  - [ ] `ss-images.js` ✅
  - [ ] `process-payment.js` ✅
  - [ ] `streamlined-order.js` ✅

**Look for these FAILURE indicators:**

- [ ] ❌ `Secrets scanning found secrets`
- [ ] ❌ `window is not defined`
- [ ] ❌ `Cannot query field`
- [ ] ❌ `Module not found`
- [ ] ❌ `Failed to fetch`

**If you see failures → Fix before proceeding!**

---

## 🌐 **POST-DEPLOYMENT TESTING**

### **3. Homepage Test**

Visit: https://tagteamprints.com

- [ ] Page loads (not 404)
- [ ] No console errors (F12 → Console)
- [ ] Images load
- [ ] Navigation works
- [ ] Footer loads

**If fails → Check build completed successfully**

---

### **4. Shop/Products Page Test**

Visit: https://tagteamprints.com/products

- [ ] Product cards display
- [ ] Product images load
- [ ] Product names show
- [ ] Prices display
- [ ] "View Details" buttons work

**If products don't show:**

- Check build log for "Created X product pages"
- Verify SNS_API_USERNAME and SNS_API_KEY are set

**If images broken:**

- Check browser console (F12)
- Look for CORS errors
- Verify ss-images function deployed

---

### **5. Individual Product Page Test**

Click any product, or visit: https://tagteamprints.com/products/[any-product-slug]

- [ ] Product page loads (not 404)
- [ ] Main product image loads
- [ ] Product title shows
- [ ] Product description shows
- [ ] Size selector appears
- [ ] Color options show (if available)
- [ ] Price displays
- [ ] "Add to Cart" button works

**Open Console (F12):**

- [ ] No red errors
- [ ] No 404s for images
- [ ] No CORS errors

**Test Add to Cart:**

- [ ] Click "Add to Cart"
- [ ] Item appears in cart count (top right)
- [ ] No console errors

---

### **6. Cart Test**

Visit: https://tagteamprints.com/cart

Or click cart icon after adding items

- [ ] Cart page loads
- [ ] Items show in cart
- [ ] Quantities can change
- [ ] Items can be removed
- [ ] Total price calculates
- [ ] "Checkout" button works

---

### **7. Checkout Test (Without Completing)**

Visit: https://tagteamprints.com/checkout

- [ ] Checkout page loads
- [ ] Order summary shows
- [ ] Square payment form loads (credit card fields)
- [ ] No console errors

**DO NOT test actual payment unless ready!**

---

## 🔧 **FUNCTION TESTING**

### **8. Test ss-images Function**

Open any product page, then in Console (F12):

```javascript
fetch('/.netlify/functions/ss-images/Images/Style/000_fl.jpg').then((r) =>
  r.ok
    ? console.log('✅ ss-images works!')
    : console.log('❌ ss-images failed'),
);
```

- [ ] Shows "✅ ss-images works!"

**If failed:**

- Check function deployed (build log)
- Check function code exists in repo

---

### **9. Test get-inventory Function**

In Console (F12):

```javascript
fetch('/.netlify/functions/get-inventory?styleID=12345')
  .then((r) => r.json())
  .then((d) => console.log('Inventory:', d));
```

- [ ] Returns inventory data (not error)

**If failed:**

- Verify SNS_API_USERNAME and SNS_API_KEY in Netlify

---

## 🎯 **CRITICAL PATH TEST**

### **10. End-to-End User Journey**

Simulate a real customer:

1. [ ] Visit homepage → Browse products
2. [ ] Click a product → View details
3. [ ] Select size → Add to cart
4. [ ] View cart → Item is there
5. [ ] Go to checkout → Form loads
6. [ ] (Don't complete payment, but verify form works)

**If ANY step fails → Deployment has issues!**

---

## 📊 **PERFORMANCE CHECK**

### **11. Page Speed**

Use: [PageSpeed Insights](https://pagespeed.web.dev/)

Test: https://tagteamprints.com

- [ ] Score > 70 (acceptable)
- [ ] Score > 90 (good)

**If slow:**

- Check image sizes
- Check JavaScript bundle size
- Check for blocking resources

---

## 🔐 **SECURITY CHECK**

### **12. Console Warnings**

Open Console (F12) on homepage:

- [ ] No warnings about insecure content
- [ ] No mixed content warnings (http vs https)
- [ ] No exposed API keys in console

---

## ✅ **DEPLOYMENT SUCCESS CRITERIA**

**Deployment is successful when:**

1. ✅ Build completes without errors
2. ✅ Product pages are created (100+)
3. ✅ All functions deploy
4. ✅ Homepage loads correctly
5. ✅ Products display with images
6. ✅ Individual product pages work
7. ✅ Cart functionality works
8. ✅ Checkout page loads
9. ✅ No console errors
10. ✅ No broken images

---

## 🚨 **IF SOMETHING FAILS**

### **Common Issues & Fixes:**

**No products showing:**
→ Check env vars (SNS_API_USERNAME, SNS_API_KEY)
→ Check build log for "Created X product pages"

**Images broken:**
→ Check ss-images function deployed
→ Check browser console for CORS errors
→ Verify image URLs use correct pattern

**Checkout fails:**
→ Check Square env vars (GATSBY_SQUARE_APP_ID, SQUARE_ACCESS_TOKEN)
→ Check Square payment form loads

**Build fails:**
→ Check build log for specific error
→ See COMMON_TASKS.md → "Debugging Build Failures"

---

## 📝 **DEPLOYMENT LOG**

**Date:** **\*\***\_\_\_\_**\*\***  
**Deploy ID:** **\*\***\_\_\_\_**\*\***  
**Status:** ☐ Success ☐ Partial ☐ Failed

**Issues Found:**

---

---

---

**Actions Taken:**

---

---

---

**Final Status:** ☐ Ready for production ☐ Needs fixes

---

**Save this checklist and use it EVERY deployment!** 🚀
