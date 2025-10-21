# 🏗️ PROJECT BLUEPRINT - Tag Team Printing Complete System

**Last Updated: October 18, 2025**

---

## 🎯 **SYSTEM OVERVIEW**

Tag Team Printing operates as **two interconnected systems**:

```
┌─────────────────────────────────────────────────────────────┐
│                    TAG TEAM ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   TAG TEAM WEBSITE   │◄────►│   CONTROL HUB AI    │   │
│  │   (Customer Side)    │      │   (Business Side)    │   │
│  └──────────────────────┘      └──────────────────────┘   │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌─────────────────┐           ┌─────────────────┐        │
│  │  S&S Activewear │           │    MongoDB      │        │
│  │  Square Payments │           │    AI Services  │        │
│  └─────────────────┘           └─────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **SYSTEM ARCHITECTURE**

### **System A: Tag Team Website (Public-Facing)**

**Purpose:** Customer e-commerce experience  
**Technology:** Gatsby (React) + Netlify  
**Users:** Customers browsing and ordering custom apparel

**Core Functions:**

- Browse products from S&S Activewear catalog
- Add items to cart
- Request print quotes
- Place orders
- Track order status

**Key Files:**

- `gatsby-node.js` - Builds product pages at deploy time
- `gatsby-config.js` - Site configuration
- `src/pages/` - Static pages
- `src/templates/` - Dynamic page templates
- `netlify/functions/` - Serverless backend functions

---

### **System B: Control Hub AI Unified (Internal)**

**Purpose:** Business management and automation  
**Technology:** Tauri (desktop) + React + Node.js backend  
**Users:** Business owners and staff

**Core Functions:**

- Receive and manage orders
- AI-powered quote generation
- Task automation
- Order tracking
- Business analytics

**Key Files:**

- `backend/server.js` - API server
- `backend/routes/` - API endpoints
- `src/` - Desktop app UI (React + Vite)
- `src-tauri/` - Desktop wrapper (Rust)
- `ai-projects/` - AI automation scripts

---

## 🔗 **INTEGRATION ARCHITECTURE**

### **How the Systems Connect:**

```
Customer on Website
        ↓
Places Order / Requests Quote
        ↓
Netlify Function (streamlined-order.js)
        ↓
HTTP POST → Control Hub Backend
        ↓
Control Hub Receives Order
        ↓
AI Processing (optional)
        ↓
Store in MongoDB
        ↓
Notify Staff (desktop app)
```

### **Authentication Flow:**

```
Website Function
  ↓
  Headers: { 'x-api-key': CONTROL_HUB_API_KEY }
  ↓
Control Hub Backend
  ↓
  Validates API Key
  ↓
  ✅ Authorized → Process Request
  ❌ Unauthorized → Return 401
```

---

## 🗄️ **DATA ARCHITECTURE**

### **Data Sources:**

1. **S&S Activewear API**

   - Product catalog (1000+ items)
   - Real-time inventory
   - Pricing information
   - Product images

2. **MongoDB (Control Hub)**

   - Orders
   - Customers
   - Quotes
   - Tasks
   - Analytics

3. **Local JSON Files (Website)**
   - `all_styles_raw.json` - Cached product data
   - `products.json` - Curated product list
   - Static content data

---

## 💳 **PAYMENT PROCESSING**

```
Customer Checkout
        ↓
Square Payment Form (Client-side)
        ↓
Square API (Tokenization)
        ↓
Netlify Function (process-payment.js)
        ↓
Square API (Charge Card)
        ↓
Success → Create Order in Control Hub
        ↓
Confirmation Email
```

**Critical Security:**

- Card data NEVER touches our servers
- Square handles all PCI compliance
- We only receive payment tokens

---

## 🎨 **FRONTEND ARCHITECTURE**

### **Tag Team Website (Gatsby/React)**

```
User Request
    ↓
Gatsby Router
    ↓
Page Component (src/pages/ or src/templates/)
    ↓
React Context (CartContext, etc.)
    ↓
Child Components
    ↓
API Calls (via Netlify Functions)
    ↓
Update State
    ↓
Re-render UI
```

### **Control Hub Desktop (React/Vite)**

```
User Interaction
    ↓
React Component
    ↓
Tauri Commands (Rust Bridge)
    ↓
Backend API Calls
    ↓
MongoDB / AI Services
    ↓
Return Data
    ↓
Update UI State
```

---

## 🔧 **BUILD & DEPLOYMENT**

### **Tag Team Website Deployment:**

```
Developer Push to GitHub
        ↓
GitHub Webhook → Netlify
        ↓
Netlify Build Process:
  1. Install dependencies (npm install)
  2. Run gatsby-node.js (generate pages)
  3. Build React app (gatsby build)
  4. Deploy to CDN
  5. Deploy Netlify Functions
        ↓
Live at tagteamprints.com
```

**Build Environment:**

- Node.js 18.x
- Gatsby 5.x
- Build time: 3-5 minutes
- Output: Static files in `/public`

### **Control Hub Deployment:**

Currently **local only** - runs on business computer:

```
Developer
    ↓
Build Desktop App:
  npm run tauri build
    ↓
Generate Executable (.exe)
    ↓
Install on Business Machine
    ↓
Start Backend Server (Node.js)
    ↓
Launch Desktop App
```

---

## 🌐 **NETWORK TOPOLOGY**

### **Production (Current):**

```
Internet
    │
    ├── tagteamprints.com (Netlify CDN)
    │   └── Netlify Functions (Serverless)
    │       └── S&S API (External)
    │       └── Square API (External)
    │       └── Control Hub API (Local)
    │
    └── Business Computer (Local Network)
        └── Control Hub Backend (localhost:4000)
            └── MongoDB (Local)
            └── Desktop App (Tauri)
```

### **Future (Planned):**

```
Internet
    │
    ├── tagteamprints.com (Netlify CDN)
    │   └── Netlify Functions
    │
    ├── Cloud MongoDB Atlas
    │
    └── Control Hub API (Cloud VPS)
        └── Desktop App (Connects to Cloud)
```

---

## 📦 **DEPENDENCY ARCHITECTURE**

### **Tag Team Website Dependencies:**

**Core Framework:**

- `gatsby` - Static site generator
- `react` - UI framework
- `react-dom` - React rendering

**Key Libraries:**

- None (intentionally minimal dependencies)
- Relies on browser APIs and Netlify Functions

**Build Tools:**

- `webpack` (via Gatsby)
- `babel` (via Gatsby)
- `sharp` - Image optimization

### **Control Hub Dependencies:**

**Backend:**

- `express` - Web server
- `mongoose` - MongoDB ORM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

**Frontend:**

- `react` - UI framework
- `vite` - Build tool (faster than webpack)
- `tauri` - Desktop wrapper

**Desktop:**

- `@tauri-apps/api` - Rust ↔ JavaScript bridge
- `@tauri-apps/cli` - Build CLI

---

## 🔐 **SECURITY ARCHITECTURE**

### **Layers of Security:**

1. **Environment Variables**

   - All API keys stored in Netlify/local .env
   - Never committed to Git
   - Netlify secrets scanning enabled

2. **API Authentication**

   - Control Hub uses API key (`x-api-key` header)
   - S&S uses HTTP Basic Auth
   - Square uses bearer tokens

3. **CORS Protection**

   - Control Hub backend restricts origins
   - Netlify Functions have built-in CORS

4. **Input Validation**

   - All user inputs sanitized
   - Type checking on API requests
   - SQL injection not possible (NoSQL)

5. **HTTPS**
   - Website: Automatic via Netlify
   - APIs: Required for production

---

## 📊 **STATE MANAGEMENT**

### **Website State:**

```
React Context API
    ├── CartContext
    │   ├── Cart items
    │   ├── Add/remove functions
    │   └── Cart total
    │
    └── (Future contexts)
        └── UserContext
        └── OrderContext
```

**No Redux/MobX** - React Context is sufficient for current needs

### **Control Hub State:**

```
React State + Tauri Store
    ├── React useState/useReducer
    │   └── UI state (forms, modals, etc.)
    │
    └── Tauri Store (Rust-backed)
        └── Persistent settings
        └── User preferences
```

---

## 🎯 **PRODUCT CATALOG FLOW**

Critical to understand:

```
1. Build Time (gatsby-node.js):
   ↓
   Fetch products from S&S API
   ↓
   Filter by selected brands/categories
   ↓
   Save to all_styles_raw.json
   ↓
   Create product pages (GraphQL)
   ↓
   Generate static HTML

2. Runtime (Browser):
   ↓
   Load /all_styles_raw.json
   ↓
   Display in ProductCard components
   ↓
   User clicks product
   ↓
   Navigate to /products/[slug]
   ↓
   Load SimpleProductPageTemplate
   ↓
   Fetch real-time inventory (Netlify Function)
   ↓
   Display available sizes/colors
```

**Why this approach:**

- Fast page loads (pre-built HTML)
- Real-time inventory (fetch on demand)
- No database needed for catalog

---

## 🖼️ **IMAGE HANDLING**

### **Challenge:**

S&S images have CORS restrictions - can't load directly in production

### **Solution:**

Proxy through Netlify Function

```
Product Page
    ↓
Request: /ss-images/[image-path]
    ↓
Netlify Function: ss-images.js
    ↓
Fetch from ssactivewear.com
    ↓
Return image with correct headers
    ↓
Browser displays image
```

**Critical Code:**

```javascript
// In templates, use environment-aware helper:
const getImageUrl = (imagePath) => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev
    ? `https://www.ssactivewear.com/${imagePath}`
    : `/ss-images/${imagePath}`;
};
```

---

## 🚀 **SCALING CONSIDERATIONS**

### **Current Limitations:**

1. **Product Count:**

   - Limited to ~500 products (build time)
   - All products built at deploy
   - Solution: Pagination or on-demand generation

2. **Control Hub:**

   - Single-instance desktop app
   - Local-only backend
   - Solution: Cloud deployment

3. **Inventory:**
   - Fetched per page load
   - Could be slow with high traffic
   - Solution: Caching layer

### **Future Optimizations:**

1. **Incremental Builds:**

   - Only rebuild changed products
   - Faster deployments

2. **Edge Functions:**

   - Move image proxy to Netlify Edge
   - Better performance globally

3. **GraphQL Caching:**
   - Cache S&S product data
   - Reduce API calls

---

## 📈 **METRICS & MONITORING**

### **What We Track:**

**Website:**

- Page views (Netlify Analytics)
- Build success/failure
- Function invocations
- Error rates

**Control Hub:**

- Order volume
- Quote generation time
- System uptime
- Database size

### **Where to Find Metrics:**

- **Netlify:** Dashboard → Analytics
- **Control Hub:** Desktop app → Analytics tab
- **MongoDB:** Database size in Control Hub

---

## 🔄 **UPDATE PROCESS**

### **Making Changes:**

```
1. Create Git Branch
    ↓
2. Make Changes Locally
    ↓
3. Test Locally (npm run build && npm run serve)
    ↓
4. Commit Changes
    ↓
5. Push to GitHub
    ↓
6. Create Pull Request
    ↓
7. Review Changes
    ↓
8. Merge to Main
    ↓
9. Netlify Auto-Deploy
    ↓
10. Verify Live Site
```

**Important:**

- Always test before merging
- Use branches to protect main
- Document major changes

---

## 🎓 **KEY CONCEPTS**

### **Static Site Generation (SSG):**

Gatsby builds all pages at deploy time → Super fast page loads

### **Serverless Functions:**

Code that runs on-demand without managing servers

### **Jamstack Architecture:**

JavaScript + APIs + Markup = Modern web architecture

### **API-First Design:**

All business logic through APIs → Easy to swap frontends

---

## 📞 **SUPPORT CHANNELS**

**For Developers:**

- Read docs in repo root
- Check `COMMON_TASKS.md` for solutions
- Review architecture docs

**For Business:**

- Control Hub desktop app
- Email notifications
- Direct database access (admin)

---

## ✅ **SUCCESS CRITERIA**

A successful deployment means:

1. ✅ All product pages build successfully
2. ✅ Images load correctly
3. ✅ Cart functions work
4. ✅ Checkout completes
5. ✅ Orders reach Control Hub
6. ✅ No console errors
7. ✅ Fast page load times (<3s)
8. ✅ Mobile responsive

---

**Next Steps:**

1. Read `TAG_TEAM_ARCHITECTURE.md` for website details
2. Read `CONTROL_HUB_ARCHITECTURE.md` for backend details
3. Read `INTEGRATION_MAP.md` for connection details
