# 🏗️ TAG TEAM WEBSITE - TECHNICAL ARCHITECTURE

**Last Updated: October 18, 2025**

---

## 📋 **TABLE OF CONTENTS**

1. [Technology Stack](#technology-stack)
2. [File Structure](#file-structure)
3. [Page Generation](#page-generation)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Netlify Functions](#netlify-functions)
7. [Build Process](#build-process)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## 💻 **TECHNOLOGY STACK**

### **Core Framework:**

- **Gatsby 5.14.5** - React-based static site generator
- **React 18** - UI library
- **Node.js 18.20.8** - Runtime environment

### **Hosting & Backend:**

- **Netlify** - Static hosting + serverless functions
- **Netlify Functions** - Serverless backend (AWS Lambda)

### **External APIs:**

- **S&S Activewear API** - Product catalog, inventory, pricing
- **Square API** - Payment processing
- **Control Hub API** - Order management (internal)

### **Build Tools:**

- **Webpack** (via Gatsby) - Module bundler
- **Babel** (via Gatsby) - JavaScript transpiler
- **Sharp** (via Gatsby) - Image optimization

---

## 📁 **FILE STRUCTURE**

```
tag-team-printing-website/
├── src/
│   ├── pages/                    # Auto-routed pages
│   │   ├── index.jsx            # Homepage (/)
│   │   ├── shop.jsx             # Shop page (/shop)
│   │   ├── products.jsx         # All products (/products)
│   │   ├── cart.jsx             # Shopping cart (/cart)
│   │   ├── checkout.jsx         # Checkout (/checkout)
│   │   ├── order-confirmed.jsx  # Order confirmation
│   │   └── [other pages]
│   │
│   ├── templates/                # Dynamic page templates
│   │   ├── SimpleProductPageTemplate.jsx  # Individual products
│   │   └── CategoryTemplate.jsx           # Category pages
│   │
│   ├── components/               # Reusable components
│   │   ├── Layout.jsx           # Site wrapper
│   │   ├── Header.jsx           # Global header
│   │   ├── Footer.jsx           # Global footer
│   │   ├── ProductCard.jsx      # Product list item
│   │   ├── FloatingCartButton.jsx  # Cart icon
│   │   └── [other components]
│   │
│   ├── context/                  # React Context providers
│   │   └── CartContext.js       # Shopping cart state
│   │
│   ├── utils/                    # Helper functions
│   │   └── formatting.js        # Price, date formatting
│   │
│   └── styles/                   # Global styles
│       └── global.css
│
├── netlify/functions/            # Serverless functions
│   ├── get-inventory.js         # Fetch S&S inventory
│   ├── get-product.js           # Fetch single product
│   ├── list-products.js         # Fetch product list
│   ├── ss-images.js             # Proxy S&S images
│   ├── process-payment.js       # Handle Square payments
│   └── streamlined-order.js     # Send orders to Control Hub
│
├── static/                       # Static assets
│   ├── images/                  # Static images
│   ├── fonts/                   # Web fonts
│   └── favicon.ico
│
├── data/                         # Static JSON data
│   ├── all_styles_raw.json     # Full S&S product catalog
│   └── products.json           # Curated product list
│
├── gatsby-node.js               # Build-time page creation
├── gatsby-config.js             # Gatsby configuration
├── gatsby-browser.js            # Browser APIs
├── gatsby-ssr.js                # Server-side rendering APIs
└── netlify.toml                 # Netlify configuration
```

---

## 🏗️ **PAGE GENERATION**

### **How Product Pages Are Created:**

Gatsby uses GraphQL to create pages at build time:

```javascript
// gatsby-node.js

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  // 1. Fetch products from S&S API
  const products = await fetchProductsFromSS();

  // 2. Filter to selected brands/categories
  const filteredProducts = filterProducts(products);

  // 3. Create GraphQL nodes
  filteredProducts.forEach((product) => {
    actions.createNode({
      ...product,
      id: createNodeId(`SsProduct-${product.styleID}`),
      internal: {
        type: 'SsProduct',
        contentDigest: createContentDigest(product),
      },
    });
  });
};

exports.createPages = async ({ graphql, actions }) => {
  // 4. Query the nodes we just created
  const result = await graphql(`
    query {
      allSsProduct {
        nodes {
          id
          styleName
          title
          styleID
        }
      }
    }
  `);

  // 5. Create a page for each product
  result.data.allSsProduct.nodes.forEach((product) => {
    actions.createPage({
      path: `/products/${product.styleName}`,
      component: path.resolve(`src/templates/SimpleProductPageTemplate.jsx`),
      context: {
        styleCode: product.styleName,
        id: product.id,
      },
    });
  });
};
```

**Important:** This runs ONCE during build, not at runtime!

---

## 🧩 **COMPONENT ARCHITECTURE**

### **Component Hierarchy:**

```
Layout (Wraps all pages)
  ├── Header
  │   ├── Logo
  │   ├── Navigation
  │   └── CartIcon
  │
  ├── Page Content (varies)
  │   ├── ProductCard (if shop/products)
  │   ├── ProductDetails (if product page)
  │   └── CheckoutForm (if checkout)
  │
  ├── FloatingCartButton (Global)
  │
  └── Footer
```

### **Key Components:**

#### **Layout.jsx**

```javascript
// Wraps all pages, provides consistent structure
<Layout>
  <Header />
  <main>{children}</main>
  <FloatingCartButton />
  <Footer />
</Layout>
```

#### **CartContext.js**

```javascript
// Manages cart state globally
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    /* ... */
  };
  const removeFromCart = (id) => {
    /* ... */
  };
  const clearCart = () => {
    /* ... */
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
```

#### **SimpleProductPageTemplate.jsx**

```javascript
// Dynamic product page template
const SimpleProductPageTemplate = ({ pageContext }) => {
  // pageContext = data passed from gatsby-node.js
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  // Fetch inventory at runtime
  useEffect(() => {
    fetch(`/.netlify/functions/get-inventory?styleID=${pageContext.id}`)
      .then((res) => res.json())
      .then((data) => setInventory(data));
  }, []);

  return (
    <Layout>
      <ProductDetails product={product} />
      <SizeSelector sizes={inventory.sizes} />
      <AddToCartButton />
    </Layout>
  );
};
```

---

## 🔄 **DATA FLOW**

### **Product Browsing Flow:**

```
User visits /products
    ↓
Gatsby serves pre-built HTML
    ↓
React hydrates (becomes interactive)
    ↓
ProductCard components display
    ↓
User clicks product
    ↓
Navigate to /products/[styleCode]
    ↓
SimpleProductPageTemplate loads
    ↓
useEffect fetches inventory (runtime)
    ↓
Display available sizes/colors
```

### **Shopping Cart Flow:**

```
User clicks "Add to Cart"
    ↓
Call addToCart() from CartContext
    ↓
Update cart state
    ↓
Save to localStorage (persistence)
    ↓
Update FloatingCartButton count
    ↓
User can continue shopping or checkout
```

### **Checkout Flow:**

```
User clicks "Checkout"
    ↓
Navigate to /checkout
    ↓
Display cart summary
    ↓
Square Payment Form (iframe)
    ↓
User enters payment info
    ↓
Square tokenizes card (client-side)
    ↓
Send token to /.netlify/functions/process-payment
    ↓
Netlify Function charges card via Square API
    ↓
On success: Create order in Control Hub
    ↓
Redirect to /order-confirmed
```

---

## ⚡ **NETLIFY FUNCTIONS**

### **Function: ss-images.js**

**Purpose:** Proxy S&S images to avoid CORS issues

```javascript
exports.handler = async (event) => {
  const imagePath = event.path.replace('/.netlify/functions/ss-images/', '');
  const imageUrl = `https://www.ssactivewear.com/${imagePath}`;

  const response = await fetch(imageUrl);
  const buffer = await response.buffer();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': response.headers.get('content-type'),
      'Cache-Control': 'public, max-age=31536000',
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};
```

**Usage:**

```javascript
// In components:
const imageUrl = `/ss-images/Images/Style/${styleID}_fm.jpg`;
```

### **Function: get-inventory.js**

**Purpose:** Fetch real-time inventory from S&S

```javascript
exports.handler = async (event) => {
  const { styleID, color } = event.queryStringParameters;

  const inventory = await fetchFromSSAPI({
    endpoint: '/inventory',
    params: { styleID, color },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(inventory),
  };
};
```

### **Function: streamlined-order.js**

**Purpose:** Send completed orders to Control Hub

```javascript
exports.handler = async (event) => {
  const orderData = JSON.parse(event.body);

  // Send to Control Hub
  const response = await fetch(`${CONTROL_HUB_URL}/api/webhooks/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CONTROL_HUB_API_KEY,
    },
    body: JSON.stringify(orderData),
  });

  return {
    statusCode: response.status,
    body: JSON.stringify({ success: response.ok }),
  };
};
```

---

## 🔨 **BUILD PROCESS**

### **Build Stages:**

```
1. Pre-Build
   ├── Install dependencies (npm install)
   ├── Load environment variables
   └── Initialize Gatsby plugins

2. Source Nodes (gatsby-node.js:sourceNodes)
   ├── Fetch S&S product catalog
   ├── Filter to selected products
   ├── Create GraphQL nodes
   └── Save all_styles_raw.json

3. Create Pages (gatsby-node.js:createPages)
   ├── Query GraphQL nodes
   ├── Generate product pages
   ├── Generate category pages
   └── Total: ~36 pages + 500 product pages

4. Build Assets
   ├── Compile React components
   ├── Optimize images (Sharp)
   ├── Generate CSS
   └── Create JavaScript bundles

5. Generate HTML
   ├── Server-side render pages
   ├── Create static HTML files
   └── Output to /public folder

6. Deploy
   ├── Upload to Netlify CDN
   ├── Deploy Netlify Functions
   └── Update DNS records
```

**Total Time:** 3-5 minutes

---

## 🎨 **COMMON PATTERNS**

### **Pattern 1: Environment-Aware Image URLs**

```javascript
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return `https://www.ssactivewear.com/${imagePath}`;
  } else {
    return `/ss-images/${imagePath}`;
  }
};
```

**Why:** Direct S&S image loading works in dev, but fails in production due to CORS.

### **Pattern 2: SSR-Safe Code**

```javascript
// ❌ WRONG - Breaks during build
const hostname = window.location.hostname;

// ✅ CORRECT - Works during SSR
const hostname =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

// ✅ BETTER - Use environment variable
const isDev = process.env.NODE_ENV === 'development';
```

### **Pattern 3: Lazy Loading Data**

```javascript
// Don't fetch all data at build time
// Instead, fetch on-demand at runtime

useEffect(() => {
  const loadInventory = async () => {
    const data = await fetch(`/.netlify/functions/get-inventory?styleID=${id}`);
    setInventory(await data.json());
  };

  loadInventory();
}, [id]);
```

### **Pattern 4: Context + LocalStorage**

```javascript
// Persist cart across page refreshes

const [cart, setCart] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}, [cart]);
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: "window is not defined"**

**Cause:** Using browser APIs during SSR (server-side render)

**Fix:**

```javascript
if (typeof window !== 'undefined') {
  // Browser-only code here
}
```

### **Issue: Images not loading in production**

**Cause:** CORS blocking direct S&S image loads

**Fix:** Use `/ss-images/` proxy function

### **Issue: Product pages not generating**

**Cause:** GraphQL query in gatsby-node.js failing

**Debug:**

1. Check S&S API credentials in env vars
2. Look at build logs for "Created X product pages"
3. Verify sourceNodes completed successfully

### **Issue: Netlify function timeout**

**Cause:** Function takes longer than 10 seconds

**Fix:**

- Optimize API calls
- Add caching
- Split into multiple functions

### **Issue: Build fails with "Secrets detected"**

**Cause:** Hardcoded API keys in files

**Fix:**

- Use environment variables
- Add sensitive files to .gitignore
- Review CONTROL_HUB_SETUP_GUIDE.md

---

## 📊 **PERFORMANCE OPTIMIZATION**

### **Current Optimizations:**

1. **Static Generation:** Pages pre-built = fast loads
2. **Image Optimization:** Sharp plugin auto-optimizes
3. **Code Splitting:** Webpack splits by page
4. **CDN Delivery:** Netlify global CDN

### **Future Optimizations:**

1. **Lazy Load Images:** Load images as user scrolls
2. **Service Worker:** Offline support
3. **GraphQL Caching:** Cache S&S API responses
4. **Edge Functions:** Move image proxy to edge

---

## ✅ **CHECKLIST FOR NEW FEATURES**

Before adding a new feature:

- [ ] Does it need to run at build time or runtime?
- [ ] Does it need serverless function or client-side?
- [ ] Does it affect SEO (needs to be in static HTML)?
- [ ] Does it need environment variables?
- [ ] Is it SSR-safe (no window/document during build)?
- [ ] Have I tested it locally first?

---

**Next:** Read `COMMON_TASKS.md` for step-by-step guides to common operations.
