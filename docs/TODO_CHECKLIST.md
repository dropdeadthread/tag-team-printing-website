# Mobile & Cart Optimization - Implementation Checklist

**Created:** October 23, 2025
**Priority:** Implement in order listed
**Estimated Time:** 2-3 weeks for complete implementation

---

## 🔴 SPRINT 1: CRITICAL MOBILE FIXES (Days 1-5)

### Product Page Mobile Responsiveness (HIGHEST PRIORITY)

- [ ] **Task 1.1: Add mobile media queries to SimpleProductPageTemplate.jsx**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Search for all `styled` components
  - Add `@media (max-width: 768px)` breakpoints
  - Add `@media (max-width: 480px)` for very small phones
  - Test: View product page on iPhone SE simulator

- [ ] **Task 1.2: Fix color swatch touch targets**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Find `ColorSwatch` styled-component
  - Current: Likely ~35-40px
  - Change to: 44x44px minimum on mobile
  - Add spacing: margin: 4px between swatches
  - Example code:

    ```javascript
    const ColorSwatch = styled.button`
      width: 40px;
      height: 40px;
      border-radius: 50%;

      @media (max-width: 768px) {
        width: 44px;
        height: 44px;
        margin: 4px;
      }

      &:active {
        transform: scale(0.95); /* Touch feedback */
      }
    `;
    ```

  - Test: Tap different colors on iPhone, verify easy selection

- [ ] **Task 1.3: Fix size selector for mobile**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Find size dropdown/select element
  - Set minimum height: 44px
  - Increase font-size on mobile if needed
  - Example:

    ```javascript
    const SizeSelect = styled.select`
      height: 40px;

      @media (max-width: 768px) {
        height: 48px; /* Larger for better touch */
        font-size: 16px; /* Prevent iOS zoom */
      }
    `;
    ```

  - Test: Tap size selector on mobile, verify easy selection

- [ ] **Task 1.4: Optimize "Add to Cart" button for mobile**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Find "Add to Cart" button styled-component
  - Make full-width on mobile
  - Ensure minimum 44px height
  - Make button sticky at bottom of viewport on mobile
  - Example:

    ```javascript
    const AddToCartButton = styled.button`
      padding: 1rem 2rem;

      @media (max-width: 768px) {
        width: 100%;
        position: sticky;
        bottom: 0;
        min-height: 48px;
        font-size: 1.1rem;
        z-index: 100;
      }
    `;
    ```

  - Test: Scroll product page on mobile, button stays accessible

- [ ] **Task 1.5: Fix product image scaling**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Find product image styled-component
  - Ensure responsive sizing
  - Example:

    ```javascript
    const ProductImage = styled.img`
      max-width: 100%;
      height: auto;

      @media (max-width: 768px) {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        display: block;
      }
    `;
    ```

  - Test: View product on iPhone, image fits screen

- [ ] **Task 1.6: Make product layout stack on mobile**

  - File: `src/templates/SimpleProductPageTemplate.jsx`
  - Find main product container (likely has `display: flex` or `grid`)
  - Stack image and details vertically on mobile
  - Example:

    ```javascript
    const ProductContainer = styled.div`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    `;
    ```

  - Test: Product page readable on mobile without horizontal scroll

---

### Cart Page Touch Target Fixes

- [ ] **Task 1.7: Increase cart quantity button sizes**

  - File: `src/styles/cart.css`
  - Location: Line 95-107 (.cart-qty-controls button)
  - Current: 30x30px
  - Change to: 44x44px on mobile
  - Code to add:
    ```css
    @media (max-width: 768px) {
      .cart-qty-controls button {
        width: 44px;
        height: 44px;
        font-size: 1.2rem;
      }
    }
    ```
  - Test: Tap +/- buttons on mobile, easy and accurate

- [ ] **Task 1.8: Increase remove button size**

  - File: `src/styles/cart.css`
  - Location: Line 120-137 (.remove-button)
  - Ensure minimum 44px touch target
  - Code to add:
    ```css
    @media (max-width: 768px) {
      .remove-button {
        min-height: 44px;
        padding: 0.75rem 1.25rem;
      }
    }
    ```
  - Test: Easy to tap "Remove" on mobile

- [ ] **Task 1.9: Stack cart items vertically on small screens**

  - File: `src/styles/cart.css`
  - Location: Line 38-49 (.cart-item)
  - Current: Flex layout with thumbnail and info side-by-side
  - Change: Stack on very small screens
  - Code to add:

    ```css
    @media (max-width: 480px) {
      .cart-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .cart-thumbnail {
        width: 150px;
        margin-bottom: 1rem;
      }
    }
    ```

  - Test: Cart items readable on iPhone SE

---

### iOS-Specific Fixes

- [ ] **Task 1.10: Fix iOS input zoom issue (CRITICAL)**

  - File: `src/styles/checkout.css`
  - Location: Line 91-100 (.form-group input)
  - Issue: iOS Safari zooms in when focusing inputs with font-size < 16px
  - Current: `font-size: 1rem` (may be <16px)
  - Fix: Set explicit 16px
  - Code to change:
    ```css
    .form-group input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #fff5d1;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.95);
      font-size: 16px; /* EXPLICIT 16px minimum for iOS */
      color: #333;
      transition: all 0.3s ease;
    }
    ```
  - Test: Focus inputs on iPhone Safari, verify no zoom

- [ ] **Task 1.11: Add safe-area-insets for iPhone notch**

  - File: `src/styles/checkout.css`
  - Location: Add to .checkout-container
  - Issue: Content hidden behind iPhone X+ notch
  - Code to add:
    ```css
    @supports (padding: max(0px)) {
      .checkout-container {
        padding-top: max(10rem, calc(10rem + env(safe-area-inset-top)));
        padding-bottom: max(6rem, calc(6rem + env(safe-area-inset-bottom)));
      }
    }
    ```
  - Also add to cart.css:
    ```css
    @supports (padding: max(0px)) {
      .cart-container {
        padding-top: max(8rem, calc(8rem + env(safe-area-inset-top)));
        padding-bottom: max(3rem, calc(3rem + env(safe-area-inset-bottom)));
      }
    }
    ```
  - Test: View on iPhone 11/12/13/14, content not hidden

- [ ] **Task 1.12: Add viewport meta tag check**
  - File: `gatsby-config.js` or HTML template
  - Ensure viewport meta tag exists:
    ```html
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
    />
    ```
  - Note: DO NOT set maximum-scale=1.0 (bad for accessibility)
  - Test: Site scales properly on all devices

---

## 🟡 SPRINT 2: CART UX IMPROVEMENTS (Days 6-10)

### Cart Panel Mobile Optimization

- [ ] **Task 2.1: Make cart panel full-screen on mobile**

  - File: `src/components/CartPanel.jsx`
  - Location: Line 48-62 (inline styles)
  - Current: Fixed 320px width
  - Change: Full-screen on mobile
  - Refactor to use CSS file or add media query to styled-components
  - Create: `src/styles/cartpanel.css`
  - Code:

    ```css
    .cart-panel {
      position: fixed;
      top: 120px;
      right: 0;
      width: 320px;
      height: calc(100% - 120px);
      background-color: #111;
      color: #fff;
      padding: 20px;
      z-index: 1001;
      overflow-y: auto;
      box-shadow: -3px 0 10px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
      .cart-panel {
        width: 100%;
        height: 100%;
        top: 0;
      }
    }
    ```

  - Update CartPanel.jsx to import CSS file
  - Test: Cart panel takes full screen on mobile

- [ ] **Task 2.2: Add slide-in animation for cart panel**

  - File: `src/styles/cartpanel.css`
  - Add smooth slide animation
  - Code:

    ```css
    .cart-panel {
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
    }

    .cart-panel.open {
      transform: translateX(0);
    }
    ```

  - Update CartPanel.jsx to add/remove "open" class
  - Test: Cart slides in smoothly when opened

- [ ] **Task 2.3: Improve cart panel close button for mobile**

  - File: `src/components/CartPanel.jsx`
  - Location: Line 65-83 (close button)
  - Increase size on mobile
  - Change to:
    ```javascript
    <button
      onClick={onClose}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: '#ff0000',
        border: '2px solid #fff',
        borderRadius: '50%',
        padding: '12px 16px', // Increased for mobile
        cursor: 'pointer',
        color: '#fff',
        fontSize: '20px', // Larger X
        fontWeight: 'bold',
        zIndex: 9999,
        minWidth: '44px', // Touch target
        minHeight: '44px',
      }}
    >
      ✕
    </button>
    ```
  - Test: Easy to close cart on mobile

- [ ] **Task 2.4: Add quantity controls to cart panel**

  - File: `src/components/CartPanel.jsx`
  - Location: Line 92-116 (cart items list)
  - Current: Only shows quantity, no controls
  - Add: +/- buttons like cart.jsx has
  - Import updateCartItemQuantity from context
  - Code to add:

    ```jsx
    const handleQuantityChange = (index, delta) => {
      const item = cartItems[index];
      const newQty = Math.max(1, (item.quantity || 1) + delta);
      updateCartItemQuantity(index, newQty);
    };

    // In the JSX:
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '0.5rem 0',
      }}
    >
      <button
        onClick={() => handleQuantityChange(index, -1)}
        style={{ width: '30px', height: '30px' }}
      >
        -
      </button>
      <span>Qty: {item.quantity || 1}</span>
      <button
        onClick={() => handleQuantityChange(index, 1)}
        style={{ width: '30px', height: '30px' }}
      >
        +
      </button>
    </div>;
    ```

  - Test: Can change quantity from cart panel

---

### Visual Feedback & Loading States

- [ ] **Task 2.5: Add toast notification when item added to cart**

  - Option A: Use a library like `react-toastify`
  - Option B: Create custom toast component
  - Location: Trigger from SimpleProductPageTemplate.jsx after addToCart()
  - Example with react-toastify:

    ```bash
    npm install react-toastify
    ```

    ```javascript
    import { toast } from 'react-toastify';

    const handleAddToCart = () => {
      addToCart(productData);
      toast.success('Added to cart!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    };
    ```

  - Test: Toast appears when adding item

- [ ] **Task 2.6: Add cart icon animation when item added**

  - File: `src/components/FloatingCartButton.jsx` (if exists)
  - Add bounce animation when cart updates
  - CSS:

    ```css
    @keyframes bounce {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    .cart-button.updated {
      animation: bounce 0.3s ease;
    }
    ```

  - JavaScript: Add "updated" class, remove after animation
  - Test: Cart icon bounces when item added

- [ ] **Task 2.7: Add loading spinner during checkout API call**

  - File: `src/components/CartPanel.jsx`
  - Location: Line 8-44 (handleCheckout function)
  - Add loading state:

    ```javascript
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
      setIsCheckingOut(true);
      try {
        // ... existing checkout logic
      } finally {
        setIsCheckingOut(false);
      }
    };
    ```

  - Update button:
    ```jsx
    <button disabled={isCheckingOut}>
      {isCheckingOut ? 'Processing...' : '🔒 Checkout'}
    </button>
    ```
  - Test: Button shows loading state

- [ ] **Task 2.8: Add loading state to checkout form submit**
  - File: `src/pages/checkout.jsx`
  - Location: Already has status state
  - Ensure button is disabled while processing (line 247)
  - Already implemented ✅ (can verify)

---

### Confirmation Dialogs

- [ ] **Task 2.9: Add confirmation for "Clear Cart"**

  - File: `src/components/CartPanel.jsx`
  - Location: Line 141-153 (Clear Cart button)
  - Add confirmation:
    ```javascript
    const handleClearCart = () => {
      if (window.confirm('Are you sure you want to clear your cart?')) {
        clearCart();
      }
    };
    ```
  - Update button onClick to use handleClearCart
  - Test: Confirmation dialog appears

- [ ] **Task 2.10: Add confirmation for "Remove from Cart"**

  - File: `src/pages/cart.jsx` AND `src/components/CartPanel.jsx`
  - Add confirmation or undo option
  - Option A: Simple confirm dialog
    ```javascript
    const handleRemove = (index) => {
      if (window.confirm('Remove this item from cart?')) {
        removeFromCart(index);
      }
    };
    ```
  - Option B: Toast with undo (better UX)

    ```javascript
    const handleRemove = (index) => {
      const removedItem = cartItems[index];
      removeFromCart(index);

      toast.info('Item removed', {
        action: {
          text: 'Undo',
          onClick: () => addToCart(removedItem),
        },
      });
    };
    ```

  - Test: Can undo accidental removal

---

## 🟢 SPRINT 3: POLISH & OPTIMIZATION (Days 11-15)

### Image Optimization

- [ ] **Task 3.1: Convert images to WebP format**

  - Tool: Use `sharp` or `imagemin`
  - Process all product images
  - Keep JPG fallbacks for old browsers
  - Use `<picture>` element:
    ```html
    <picture>
      <source srcset="image.webp" type="image/webp" />
      <img src="image.jpg" alt="..." />
    </picture>
    ```
  - Test: Images load faster on 3G

- [ ] **Task 3.2: Add responsive image sizes**

  - Use `srcset` attribute for different screen sizes
  - Example:
    ```html
    <img
      srcset="
        image-small.jpg   400w,
        image-medium.jpg  800w,
        image-large.jpg  1200w
      "
      sizes="(max-width: 768px) 100vw, 50vw"
      src="image-medium.jpg"
      alt="..."
    />
    ```
  - Apply to product images in SimpleProductPageTemplate.jsx
  - Test: Correct size loads on mobile vs desktop

- [ ] **Task 3.3: Add lazy loading to images**
  - Add `loading="lazy"` attribute to all images
  - Example:
    ```jsx
    <img src="..." alt="..." loading="lazy" />
    ```
  - Improves initial page load time
  - Test: Images below fold load after scroll

---

### Cart System Enhancements

- [ ] **Task 3.4: Add getCartTotal() helper to CartContext**

  - File: `src/context/CartContext.js`
  - Add function:
    ```javascript
    const getCartTotal = () => {
      return cartItems.reduce((total, item) => {
        return total + (item.price || 0) * (item.quantity || 1);
      }, 0);
    };
    ```
  - Add to context provider value (line 91-98)
  - Update CartPanel and cart.jsx to use this instead of inline calculation
  - Test: Total calculates correctly

- [ ] **Task 3.5: Add getCartItemCount() helper**

  - File: `src/context/CartContext.js`
  - Add function:
    ```javascript
    const getCartItemCount = () => {
      return cartItems.reduce((count, item) => {
        return count + (item.quantity || 1);
      }, 0);
    };
    ```
  - Use for cart badge count
  - Test: Badge shows correct total quantity

- [ ] **Task 3.6: Add cart item limit validation**

  - File: `src/context/CartContext.js`
  - Add validation in addToCart:

    ```javascript
    const MAX_CART_ITEMS = 50; // Reasonable limit

    const addToCart = (product) => {
      if (cartItems.length >= MAX_CART_ITEMS) {
        alert('Cart is full! Maximum 50 items allowed.');
        return;
      }
      // ... existing logic
    };
    ```

  - Test: Can't add more than limit

- [ ] **Task 3.7: Add error boundary for cart JSON parsing**

  - File: `src/context/CartContext.js`
  - Location: Line 14-20 (localStorage load)
  - Improve error handling:
    ```javascript
    useEffect(() => {
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('tagteam_cart');
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            // Validate structure
            if (Array.isArray(parsed)) {
              setCartItems(parsed);
            } else {
              console.error('Invalid cart data, resetting');
              localStorage.removeItem('tagteam_cart');
            }
          }
        } catch (error) {
          console.error('Error loading cart, resetting:', error);
          localStorage.removeItem('tagteam_cart');
        }
      }
    }, []);
    ```
  - Test: Corrupted localStorage doesn't break site

- [ ] **Task 3.8: Add quantity validation in updateCartItemQuantity**

  - File: `src/context/CartContext.js`
  - Location: Line 79-88
  - Add validation:

    ```javascript
    const updateCartItemQuantity = (index, newQuantity) => {
      const qty = parseInt(newQuantity);

      // Validate positive integer
      if (!Number.isInteger(qty) || qty < 1) {
        console.error('Invalid quantity');
        return;
      }

      // Optional: Set maximum per item
      const MAX_QTY_PER_ITEM = 999;
      if (qty > MAX_QTY_PER_ITEM) {
        alert(`Maximum ${MAX_QTY_PER_ITEM} per item`);
        return;
      }

      setCartItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: qty,
        };
        return updatedItems;
      });
    };
    ```

  - Test: Can't set invalid quantities

---

### Checkout Improvements

- [ ] **Task 3.9: Improve address field (optional)**

  - File: `src/pages/checkout.jsx`
  - Current: Single text input (line 228-237)
  - Option: Split into separate fields
  - Example:
    ```jsx
    <div className="form-group">
      <label htmlFor="street">Street Address *</label>
      <input id="street" name="street" required />
    </div>
    <div className="form-group">
      <label htmlFor="city">City *</label>
      <input id="city" name="city" required />
    </div>
    <div className="form-group">
      <label htmlFor="province">Province *</label>
      <select id="province" name="province" required>
        <option value="">Select...</option>
        <option value="ON">Ontario</option>
        <option value="QC">Quebec</option>
        {/* ... other provinces */}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="postal">Postal Code *</label>
      <input id="postal" name="postal" pattern="[A-Z][0-9][A-Z] [0-9][A-Z][0-9]" required />
    </div>
    ```
  - Test: Validation works for Canadian address format
  - Note: This is optional - current simple approach may be preferred

- [ ] **Task 3.10: Add phone format validation**

  - File: `src/pages/checkout.jsx`
  - Location: Line 218-226 (phone input)
  - Add pattern:
    ```jsx
    <input
      id="phone"
      name="phone"
      value={fields.phone}
      onChange={handleChange}
      type="tel"
      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
      placeholder="123-456-7890"
    />
    ```
  - Test: Invalid format shows error

- [ ] **Task 3.11: Save form data to sessionStorage on change**

  - File: `src/pages/checkout.jsx`
  - Persist form data during filling
  - Add:

    ```javascript
    useEffect(() => {
      // Load saved form data
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('checkout_form');
        if (saved) {
          try {
            setFields(JSON.parse(saved));
          } catch (e) {
            console.error('Error loading saved form');
          }
        }
      }
    }, []);

    useEffect(() => {
      // Save form data on change
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_form', JSON.stringify(fields));
      }
    }, [fields]);
    ```

  - Clear sessionStorage after successful payment
  - Test: Form data survives page refresh

- [ ] **Task 3.12: Fix duplicate CSS rules in checkout.css**
  - File: `src/styles/checkout.css`
  - Location: Lines 189-207 duplicate 142-187
  - Remove duplicate rules
  - Test: No visual change

---

## 🔵 SPRINT 4: TESTING & VALIDATION (Days 16-18)

### Mobile Device Testing

- [ ] **Task 4.1: Test on iPhone SE (375x667)**

  - Smallest modern iPhone
  - Check all pages load and function
  - Verify touch targets work
  - Test cart and checkout flow
  - Document any issues

- [ ] **Task 4.2: Test on iPhone 14 Pro (390x844)**

  - Standard modern iPhone
  - Test all functionality
  - Verify safe-area-insets work
  - Test in both portrait and landscape
  - Document any issues

- [ ] **Task 4.3: Test on iPhone 14 Pro Max (430x932)**

  - Largest iPhone
  - Ensure layout doesn't break
  - Test all interactive elements
  - Document any issues

- [ ] **Task 4.4: Test on Android (Pixel 5 - 393x851)**

  - Test in Chrome browser
  - Check form autofill works
  - Test keyboard behavior
  - Verify pull-to-refresh doesn't conflict
  - Document any issues

- [ ] **Task 4.5: Test on iPad (768x1024)**
  - Tablet-sized viewport
  - Ensure layout is readable
  - Test touch interactions
  - Document any issues

---

### Performance Testing

- [ ] **Task 4.6: Run Lighthouse mobile audit**

  - Open Chrome DevTools
  - Run Lighthouse in mobile mode
  - Target scores:
    - Performance: > 80
    - Accessibility: > 90
    - Best Practices: > 90
    - SEO: > 90
  - Document scores and recommendations

- [ ] **Task 4.7: Test with 3G throttling**

  - Chrome DevTools → Network → Slow 3G
  - Reload product page
  - Measure:
    - Time to first content (< 3 seconds)
    - Time to interactive (< 5 seconds)
  - Document if too slow

- [ ] **Task 4.8: Check JavaScript bundle size**

  - Run `npm run build`
  - Check bundle sizes in build output
  - Main bundle should be < 500KB
  - Total JS should be < 1MB
  - Document sizes

- [ ] **Task 4.9: Check image loading**
  - Verify lazy loading works
  - Check WebP format loads
  - Verify responsive sizes load correctly
  - Document any issues

---

### Cross-Browser Testing

- [ ] **Task 4.10: Test on iOS Safari**

  - Real device or simulator
  - Test all pages
  - Verify input zoom fix works
  - Test payment form (Square SDK)
  - Document any issues

- [ ] **Task 4.11: Test on Android Chrome**

  - Real device or emulator
  - Test all pages
  - Test checkout flow
  - Verify autofill works
  - Document any issues

- [ ] **Task 4.12: Test on desktop browsers (sanity check)**
  - Chrome: Verify nothing broken
  - Firefox: Check layout
  - Safari: Test functionality
  - Edge: Verify compatibility

---

### Checkout Flow End-to-End Testing

- [ ] **Task 4.13: Complete full checkout with test payment**

  - Add items to cart
  - Proceed to checkout
  - Fill all form fields
  - Use Square test card: 4111 1111 1111 1111
  - Complete payment
  - Verify order submitted to Control Hub
  - Verify cart cleared
  - Verify redirect to confirmation page
  - Document any issues

- [ ] **Task 4.14: Test payment failure scenarios**

  - Test with declined card: 4000 0000 0000 0002
  - Verify error message shows
  - Verify cart NOT cleared
  - Verify can retry payment
  - Document any issues

- [ ] **Task 4.15: Test inventory validation**
  - Find product with low stock
  - Try to order more than available
  - Verify error message shows
  - Verify payment NOT processed
  - Document any issues

---

## 📊 COMPLETION CRITERIA

### All tasks complete when:

- [ ] All touch targets are 44x44px minimum on mobile
- [ ] Product page has full mobile responsiveness
- [ ] Cart panel works perfectly on mobile
- [ ] Checkout form fills without iOS zoom
- [ ] Safe-area-insets protect content on iPhone X+
- [ ] All images optimized and lazy-loaded
- [ ] Cart system has proper error handling
- [ ] Visual feedback for all cart actions
- [ ] Confirmations for destructive actions
- [ ] Tested on iOS Safari and Android Chrome
- [ ] Lighthouse mobile score > 80
- [ ] Complete checkout flow works end-to-end
- [ ] All findings documented

---

## 📝 NOTES

### Testing Tools Needed

- Chrome DevTools (device emulation)
- iOS Simulator (Xcode - Mac only)
- Android Emulator (Android Studio)
- Real devices (iOS and Android)

### Libraries to Consider Installing

- `react-toastify` - Toast notifications
- `sharp` or `imagemin` - Image optimization
- Testing libraries already installed (check package.json)

### Documentation to Create After Completion

- Mobile Testing Guide
- Cart System Documentation
- Checkout Flow Diagram
- Performance Metrics Report

---

**Remember:** Test each task immediately after implementation. Don't batch multiple changes before testing - you'll catch issues faster this way!
