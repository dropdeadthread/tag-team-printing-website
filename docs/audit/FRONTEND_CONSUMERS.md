# Frontend API Consumers - Contract Validation

## Purpose

This document maps every frontend component/page that calls Netlify function APIs, documenting:

- What data they expect from the API
- How they handle responses
- What assumptions they make about data structure
- Failure modes and error handling

This enables contract validation to prevent integration issues like the color swatch bug.

---

## 1. get-inventory API

### Contract Expected by Frontend

```typescript
{
  colors: Array<{
    name: string;
    hex?: string;
    colorSwatchImage?: string;
    colorFrontImage?: string;    // CRITICAL: Required for swatch functionality
    colorSideImage?: string;      // CRITICAL: Fallback image
    colorBackImage?: string;      // OPTIONAL: Additional view
    sizes: {
      [sizeName: string]: {
        available: number;
        price: string;           // Retail price with markup
      }
    }
  }>;
  brandName?: string;
  styleID?: string;
}
```

### Consumers

#### **src/templates/SimpleProductPageTemplate.jsx** (PRIMARY CONSUMER)

**Location:** Lines 51-77 (load inventory), Lines 288-320 (image display)

**Purpose:** Product detail page - displays color swatches and changes product images when swatches are clicked

**API Call:**

```javascript
const inventoryResponse = await fetch(
  `/.netlify/functions/get-inventory?styleCode=${foundProduct.styleID}`,
);
const inventory = await inventoryResponse.json();
```

**Data Usage:**

```javascript
// Sets first available color as default
const availableColor = inventory.colors.find((c) =>
  Object.values(c.sizes || {}).some((size) => size.available > 0),
);
setSelectedColor(availableColor);

// Uses color images for display (CRITICAL CODE PATH)
if (selectedColor && selectedColor.colorFrontImage) {
  const colorImageUrl = getImageUrl(selectedColor.colorFrontImage);
  // Display this image
}
// Fallback to colorSideImage if colorFrontImage not available
if (selectedColor && selectedColor.colorSideImage) {
  const colorImageUrl = getImageUrl(selectedColor.colorSideImage);
}
```

**Assumptions:**

- ✅ `inventory.colors` is an array
- ✅ Each color has a `sizes` object
- ✅ Size values include `available` (number) and `price` (string)
- ✅ Colors have `colorFrontImage`, `colorSideImage`, `colorBackImage` URLs
- ✅ Image URLs are either full HTTPS URLs or relative paths

**Error Handling:**

```javascript
try {
  // ... fetch inventory
} catch (error) {
  console.error('Error loading product:', error);
  setLoading(false);
}
```

- Logs error to console
- Stops loading state
- No user feedback shown

**Failure Modes:**

1. ❌ If `colors` array is empty → No swatches displayed
2. ❌ If `colorFrontImage` is missing → Falls back to `colorSideImage`
3. ❌ If both image fields missing → Uses product's default `styleImage`
4. ❌ If API returns 404/500 → Shows "Loading product..." forever

**Contract Validation Status:**

- ✅ API now returns `colorFrontImage`, `colorSideImage`, `colorBackImage` (Fixed in commit 6487fc2)
- ⚠️ Need to verify in live deployment

---

#### **src/templates/ProductPageTemplate.jsx** (LEGACY - Less Used)

**Location:** Similar pattern to SimpleProductPageTemplate

**Purpose:** Alternative product page template (not primary)

**API Call:**

```javascript
fetch('/.netlify/functions/get-inventory?styleCode=...');
```

**Data Usage:** Similar to SimpleProductPageTemplate

**Status:** Legacy template, less critical but should work identically

---

#### **src/pages/checkout.jsx** (VALIDATION CONSUMER)

**Location:** Lines 48-78

**Purpose:** Validates inventory availability before processing payment

**API Call:**

```javascript
const inventoryResponse = await fetch(
  `/.netlify/functions/get-inventory?styleID=${item.styleID}&color=${encodeURIComponent(item.color)}`,
);
const inventory = await inventoryResponse.json();
```

**Data Usage:**

```javascript
// Find color matching cart item
const colorData = inventory.colors?.find((c) => c.name === item.color);
const sizeInventory = colorData?.sizes?.[item.size];

// Validate stock
if (!sizeInventory || sizeInventory.available < item.quantity) {
  setStatus(
    `Sorry, ${item.name} in ${item.color} size ${item.size} is out of stock`,
  );
  return; // Block payment
}
```

**Assumptions:**

- ✅ `inventory.colors` array exists
- ✅ Colors have a `name` field matching cart item color
- ✅ Sizes object has keys matching cart item size
- ✅ Size has `available` number field

**Error Handling:**

```javascript
try {
  // ... inventory check
} catch (inventoryError) {
  console.warn('Inventory validation failed:', inventoryError);
  // Continue with payment if inventory check fails
}
```

- Logs warning
- **Does NOT block payment** if API fails (by design)

**Failure Modes:**

1. ⚠️ If API fails → Payment proceeds anyway (acceptable fallback)
2. ✅ If stock insufficient → Payment blocked with user message
3. ✅ If color/size not found → Treated as out of stock

**Contract Validation Status:**

- ✅ API contract matches expectations
- ✅ Graceful degradation implemented

---

## 2. list-products API

### Contract Expected by Frontend

```typescript
{
  products: Array<{
    styleID: string | number;
    styleName: string;
    title?: string;
    brandName?: string;
    styleImage?: string;
    wholesalePrice?: number;
    retailPrice?: number;
    // ... other fields
  }>;
}
```

### Consumers

#### **src/components/ProductList.jsx**

**Location:** Lines 6-14

**Purpose:** Generic product list component

**API Call:**

```javascript
fetch('/.netlify/functions/list-products')
  .then((res) => res.json())
  .then((data) => {
    // Handle both formats
    const productsArray = Array.isArray(data) ? data : data.products || [];
    setProducts(productsArray);
  });
```

**Assumptions:**

- ✅ Response is either `Array<Product>` OR `{ products: Array<Product> }`
- ✅ Handles both legacy array and modern object format

**Error Handling:**

- ❌ No try/catch
- ❌ No error state shown to user
- ❌ Failed fetch leaves empty product list

**Failure Modes:**

1. ❌ API fails → Empty product grid, no error message
2. ✅ Data format mismatch → Fallback array handling works

**Contract Validation Status:**

- ⚠️ API returns `{ products: [...] }` format
- ✅ Component handles both formats
- ❌ Missing error handling

---

#### **src/components/CategoryPage.jsx**

**Location:** Uses list-products with category filter

**API Call:**

```javascript
fetch('/.netlify/functions/list-products?category=...');
```

**Same pattern as ProductList.jsx**

---

#### **src/components/SimpleCategoryPage.jsx**

**Similar to CategoryPage.jsx**

---

#### **src/pages/products.jsx**

**Main products catalog page - uses list-products**

---

## 3. process-payment API

### Contract Expected by Frontend

```typescript
Request: {
  token: string;        // Square payment token
  amount: number;       // Amount in cents
  currency: string;     // 'CAD' or 'USD'
}

Response: {
  success: boolean;
  payment?: {
    id: string;
    status: string;
    // ... Square payment object
  };
  message?: string;
  error?: string;
}
```

### Consumers

#### **src/pages/checkout.jsx**

**Location:** Lines 92-147

**Purpose:** Process Square payment for cart checkout

**API Call:**

```javascript
const response = await fetch('/.netlify/functions/process-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: result.token,
    amount: amountInCents,
    currency: 'CAD',
  }),
});
const paymentResult = await response.json();
```

**Data Usage:**

```javascript
if (paymentResult.success) {
  // Payment succeeded
  clearCart();
  setStatus('Payment Successful! Redirecting...');
  window.location.href = '/order-confirmed';
} else {
  setStatus('Payment Failed: ' + (paymentResult.message || 'Unknown error'));
}
```

**Assumptions:**

- ✅ Response has `success` boolean
- ✅ If success=true, `payment.id` exists
- ✅ If success=false, `message` or `error` explains why

**Error Handling:**

```javascript
try {
  // ... payment processing
} catch (error) {
  setStatus('Payment error: ' + error.message);
}
```

- Shows error to user
- Does not clear cart on failure
- User can retry

**Failure Modes:**

1. ✅ Payment declined → Shows error message, keeps cart
2. ✅ Network error → Shows error message, keeps cart
3. ✅ API 500 error → Caught and displayed

**Contract Validation Status:**

- ✅ API contract matches expectations
- ✅ Robust error handling

---

## 4. streamlined-order API

### Contract Expected by Frontend

```typescript
Request: {
  customer: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  items: Array<CartItem>;
  total: number;
  paymentId?: string;
  paymentStatus?: string;
  orderType: string;
  shippingAddress?: string;
}

Response: {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}
```

### Consumers

#### **src/pages/checkout.jsx**

**Location:** Lines 106-136

**Purpose:** Send order details to Control Hub after successful payment

**API Call:**

```javascript
const orderResponse = await fetch('/.netlify/functions/streamlined-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      name: fields.name,
      email: fields.email,
      phone: fields.phone || '',
      notes: `Checkout order - Payment ID: ${paymentResult.payment.id}`,
    },
    items: cartItems,
    total: totalAmount,
    paymentId: paymentResult.payment.id,
    paymentStatus: 'completed',
    orderType: 'checkout-cart',
    shippingAddress: fields.address,
  }),
});
```

**Error Handling:**

```javascript
try {
  const orderData = await orderResponse.json();
  console.log('✅ Order synced to Control Hub:', orderData);
} catch (hubError) {
  console.warn(
    '⚠️ Control Hub sync failed (payment still processed):',
    hubError,
  );
}
```

- **Non-blocking**: Payment success not dependent on Control Hub sync
- Logs warning if sync fails
- User still sees success page

**Assumptions:**

- ⚠️ Control Hub sync is best-effort only
- ✅ Payment completing is more important than order sync

**Failure Modes:**

1. ✅ Control Hub down → Payment still succeeds, order logged client-side
2. ✅ Network error → Payment succeeds, order may need manual entry

**Contract Validation Status:**

- ✅ API contract matches
- ✅ Appropriate fault tolerance

---

#### **src/components/StreamlinedOrderForm.jsx**

**Location:** Lines 420-490 (estimated, not read yet)

**Purpose:** Custom print order form submission

**API Call:** Similar pattern to checkout.jsx

**Status:** Need to analyze in detail

---

## 5. get-product API

### Contract Expected by Frontend

```typescript
{
  styleID: string | number;
  styleName: string;
  title: string;
  description?: string;
  brandName?: string;
  styleImage?: string;
  wholesalePrice?: number;
  categories?: string[];
  // ... other fields
}
```

### Consumers

#### **src/pages/products/[styleID]/[slug].jsx**

**Purpose:** Dynamic product page route

**API Call:**

```javascript
fetch(`/.netlify/functions/get-product?styleID=${styleID}`);
```

**Status:** Less commonly used than direct JSON file reads

---

#### **src/pages/styles/[slug].jsx**

**Similar pattern**

---

#### **src/components/ProductDetail.jsx**

**Product detail display component**

---

## Contract Mismatch Summary

### Critical Issues Fixed

1. ✅ **Color Swatch Images** (Fixed in commit 6487fc2)
   - Issue: `colorFrontImage`, `colorSideImage`, `colorBackImage` missing from get-inventory
   - Impact: Color swatches not changing product images
   - Fix: Updated get-inventory.js to extract all image fields from S&S API
   - Status: Awaiting deployment verification

### Remaining Issues

#### High Priority

1. ❌ **Missing Error Handling in ProductList.jsx**

   - Component: src/components/ProductList.jsx
   - Issue: No try/catch, no error UI
   - Impact: Silent failure leaves empty product grid
   - Recommendation: Add error boundary and retry mechanism

2. ⚠️ **Checkout Inventory Validation Non-Blocking**
   - Component: src/pages/checkout.jsx:74-77
   - Issue: If inventory API fails, payment proceeds
   - Impact: Could oversell out-of-stock items
   - Current: Intentional design for UX
   - Recommendation: Consider adding Sentry alert for inventory check failures

#### Medium Priority

3. ⚠️ **SimpleProductPageTemplate Forever Loading**

   - Component: src/templates/SimpleProductPageTemplate.jsx:86-87
   - Issue: Error only logged to console, loading spinner never stops
   - Impact: User sees eternal loading on API failure
   - Recommendation: Show error message with retry button

4. ⚠️ **Control Hub Sync Silent Failures**
   - Component: src/pages/checkout.jsx:131-136
   - Issue: Order sync failures only logged to console
   - Impact: Orders may not reach Control Hub without notice
   - Current: Acceptable (payment succeeds)
   - Recommendation: Add monitoring/alerting for sync failures

#### Low Priority

5. ℹ️ **Inconsistent API Response Formats**
   - list-products returns `{ products: [...] }`
   - ProductList.jsx handles both array and object format
   - Impact: None (graceful fallback exists)
   - Recommendation: Standardize all APIs to object format for consistency

---

## Testing Checklist

### Pre-Deployment

- [x] Build succeeds locally
- [x] ES module errors resolved
- [x] get-inventory returns all image fields

### Post-Deployment Verification

- [ ] Visit https://tagteamprints.com/products/4502
- [ ] Verify color swatches display
- [ ] Click different color swatches
- [ ] Confirm product image changes
- [ ] Test on mobile viewport
- [ ] Check browser console for errors
- [ ] Test size selection
- [ ] Test add to cart with different colors/sizes

### Integration Tests Needed

- [ ] get-inventory API returns all required fields
- [ ] Color image URLs are valid
- [ ] Inventory validation prevents overselling
- [ ] Payment flow completes successfully
- [ ] Order sync to Control Hub succeeds
- [ ] Error states display properly

---

## Next Steps (PHASE 3)

1. **Verify Deployment**

   - Wait for Netlify build to complete
   - Test color swatches on live site
   - Confirm all contract fixes working

2. **Add Error Boundaries**

   - Wrap ProductList in error boundary
   - Add retry mechanism for failed API calls
   - Show user-friendly error messages

3. **Add Monitoring**

   - Sentry alerts for inventory check failures
   - Track Control Hub sync success rate
   - Monitor API response times

4. **Create Integration Tests**

   - Automated tests for critical paths
   - Contract validation tests
   - E2E tests for checkout flow

5. **Documentation**
   - API versioning strategy
   - Breaking change process
   - Developer onboarding guide
