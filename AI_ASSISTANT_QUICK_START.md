# 🤖 AI ASSISTANT QUICK START GUIDE

**⚡ READ THIS FIRST - Last Updated: October 18, 2025**

---

## 🎯 **PROJECT MISSION**

**Tag Team Printing** is a custom apparel printing company building two interconnected systems:

1. **Tag Team Website** (Gatsby e-commerce) - Customer-facing online store
2. **Control Hub AI Unified** (Tauri desktop app + Node.js backend) - Business management & AI automation

---

## 📚 **REQUIRED READING (In Order)**

Before making ANY code changes, read these documents:

1. **This file** - You're here! ✅
2. **PROJECT_BLUEPRINT.md** - System architecture overview
3. **TAG_TEAM_ARCHITECTURE.md** - Website technical details
4. **CONTROL_HUB_ARCHITECTURE.md** - Backend/desktop app details
5. **INTEGRATION_MAP.md** - How systems connect
6. **TECH_STACK.md** - Technologies used
7. **COMMON_TASKS.md** - Frequent operations

**Total reading time: 15-20 minutes**  
**Value: Saves hours of mistakes and re-work**

---

## 🚨 **CRITICAL RULES - NEVER BREAK THESE**

### **1. NEVER Hardcode Secrets**

```javascript
// ❌ WRONG - Will trigger Netlify security scanner
const API_KEY = 'control-hub-secure-key-2025';

// ✅ CORRECT - Use environment variables
const API_KEY = process.env.CONTROL_HUB_API_KEY;
```

### **2. NEVER Use window During SSR**

```javascript
// ❌ WRONG - Breaks Gatsby build
const isDev = window.location.hostname === 'localhost';

// ✅ CORRECT - Use Node env
const isDev = process.env.NODE_ENV === 'development';
```

### **3. ALWAYS Verify File Paths**

- Use `Filesystem:list_directory` before reading files
- Never assume file structure
- Check if files exist before operations

### **4. ALWAYS Test Locally Before Deploy**

```bash
npm run clean && npm run build && npm run serve
```

### **5. ALWAYS Use Git Branches**

```bash
git checkout -b feature/your-feature-name
# Make changes
# Test
# Then merge
```

---

## 🗺️ **PROJECT STRUCTURE OVERVIEW**

### **Tag Team Website** (This Repository)

```
tag-team-printing-website/
├── src/
│   ├── pages/              # Gatsby pages (auto-routing)
│   ├── templates/          # Dynamic page templates
│   ├── components/         # Reusable React components
│   ├── context/            # React Context (cart, etc)
│   └── utils/              # Helper functions
├── netlify/functions/      # Serverless functions
├── data/                   # Static JSON data
├── static/                 # Static assets
├── gatsby-node.js          # Build-time page creation
├── gatsby-config.js        # Gatsby configuration
└── netlify.toml           # Netlify deployment config
```

### **Control Hub AI Unified** (Separate Repository)

```
control-hub-ai-unified/
├── src/                    # Frontend (React + Vite)
├── src-tauri/              # Desktop app wrapper (Rust)
├── backend/                # Node.js API server
│   ├── server.js          # Express server
│   ├── routes/            # API endpoints
│   └── services/          # Business logic
└── ai-projects/           # AI automation scripts
```

---

## 🔧 **COMMON ISSUES & FIXES**

### **Issue: "window is not defined"**

**Cause:** Using browser APIs during Gatsby build  
**Fix:** Use `process.env.NODE_ENV` or `typeof window !== 'undefined'` checks

### **Issue: "Secrets detected in build"**

**Cause:** Hardcoded API keys in files  
**Fix:** Use environment variables, add files to .gitignore

### **Issue: "Product pages not generating"**

**Cause:** GraphQL query failing in gatsby-node.js  
**Fix:** Check S&S API credentials in Netlify environment variables

### **Issue: "Images not loading"**

**Cause:** Wrong image URL path for environment  
**Fix:** Use helper function that checks NODE_ENV (see TAG_TEAM_ARCHITECTURE.md)

### **Issue: "Netlify build fails but local works"**

**Cause:** Usually environment variables or SSR issues  
**Fix:** Check build logs, verify env vars in Netlify dashboard

---

## 🎯 **CURRENT PROJECT STATUS**

### **✅ COMPLETED**

- E-commerce website with product catalog
- Shopping cart and checkout flow
- S&S Activewear API integration
- Netlify Functions for backend operations
- Print order quote generator
- Control Hub desktop app (basic)
- Control Hub backend API

### **🚧 IN PROGRESS**

- Control Hub ↔ Website integration
- AI-powered task automation
- Advanced quote generation
- Order management system

### **📋 PLANNED**

- Customer portal
- Design upload system
- Advanced analytics
- Multi-channel integrations

---

## 🔐 **ENVIRONMENT VARIABLES**

### **Tag Team Website (Netlify)**

| Variable                    | Purpose              | Secret? | Required?   |
| --------------------------- | -------------------- | ------- | ----------- |
| `SNS_API_USERNAME`          | S&S API auth         | ✅ Yes  | ✅ Yes      |
| `SNS_API_KEY`               | S&S API auth         | ✅ Yes  | ✅ Yes      |
| `CONTROL_HUB_API_KEY`       | Control Hub auth     | ✅ Yes  | ⚠️ Optional |
| `CONTROL_HUB_URL`           | Control Hub endpoint | ❌ No   | ⚠️ Optional |
| `SQUARE_ACCESS_TOKEN`       | Payment processing   | ✅ Yes  | ✅ Yes      |
| `GATSBY_SQUARE_APP_ID`      | Square public ID     | ❌ No   | ✅ Yes      |
| `GATSBY_SQUARE_LOCATION_ID` | Square location      | ❌ No   | ✅ Yes      |

### **Control Hub Backend**

| Variable      | Purpose                    | Secret? | Required?             |
| ------------- | -------------------------- | ------- | --------------------- |
| `API_KEY`     | Control Hub authentication | ✅ Yes  | ✅ Yes                |
| `PORT`        | Server port                | ❌ No   | ❌ No (default: 4000) |
| `MONGODB_URI` | Database connection        | ✅ Yes  | ✅ Yes                |

---

## 🧪 **TESTING CHECKLIST**

Before saying "It's done":

### **For Website Changes:**

```bash
# 1. Clean build
npm run clean

# 2. Build locally
npm run build

# 3. Check output
# Look for "Created X product pages"
# Check for errors

# 4. Serve locally
npm run serve

# 5. Test in browser
# - Product pages load?
# - Images display?
# - Cart works?
# - No console errors?

# 6. If all good, commit & push
git add .
git commit -m "feat: your description"
git push origin your-branch-name
```

### **For Control Hub Changes:**

```bash
# 1. Test backend
cd backend
npm start
# Check http://localhost:4000/health

# 2. Test desktop app
cd ..
npm run dev
# App launches without errors?

# 3. Test integration
# Send test order to webhook
# Check logs for errors
```

---

## 💡 **TIPS FOR WORKING WITH THIS PROJECT**

### **Tip 1: Always Check Existing Docs**

Before creating new functionality, search for:

- Existing implementation
- Previous attempts
- Related documentation files

### **Tip 2: Use the Right Tool**

- **Gatsby Node APIs** → Build-time operations (gatsby-node.js)
- **React Components** → UI and interactivity
- **Netlify Functions** → Backend operations, API calls
- **Context** → Global state management

### **Tip 3: Follow the Data Flow**

```
User Action
  ↓
React Component
  ↓
Context/State Update
  ↓
Netlify Function (if needed)
  ↓
External API (S&S, Square, Control Hub)
  ↓
Response back to Component
```

### **Tip 4: Understand the Environments**

- **Development:** `npm run develop` - Hot reload, dev tools
- **Build:** `npm run build` - Production build, SSR
- **Serve:** `npm run serve` - Test production build locally
- **Netlify:** Live deployment, serverless functions

---

## 🆘 **WHEN YOU'RE STUCK**

### **Step 1: Check the Logs**

```bash
# Local development
# Look at terminal output

# Netlify deployment
# Go to: Deploys → [Click deploy] → View full log
```

### **Step 2: Check the Docs**

- Look in repo root for `.md` files
- Check `COMMON_TASKS.md` for similar issues
- Check `TROUBLESHOOTING.md` if it exists

### **Step 3: Verify Environment**

- Are all env vars set?
- Is the build command correct?
- Are dependencies installed?

### **Step 4: Test Incrementally**

- Does it work locally?
- Does it work in a fresh build?
- Does it work when deployed?
- Narrow down where it breaks

---

## 🔗 **IMPORTANT LINKS**

### **Documentation**

- [Gatsby Docs](https://www.gatsbyjs.com/docs/)
- [Netlify Docs](https://docs.netlify.com/)
- [S&S API Docs](https://www.ssactivewear.com/api/)

### **Dashboards**

- **Netlify:** [app.netlify.com](https://app.netlify.com)
- **GitHub:** [github.com/dropdeadthread/tag-team-printing-website](https://github.com/dropdeadthread/tag-team-printing-website)

### **Live Sites**

- **Production:** https://tagteamprints.com

---

## 📞 **PROJECT CONVENTIONS**

### **Naming Conventions**

- **Components:** PascalCase (`ProductCard.jsx`)
- **Functions:** camelCase (`getProductData()`)
- **Files:** kebab-case (`product-page.jsx`)
- **CSS Classes:** kebab-case (`product-card-title`)

### **Git Commit Messages**

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, no code change
refactor: code refactor
test: adding tests
chore: maintenance
```

### **File Organization**

- Keep components focused (single responsibility)
- Shared components in `/src/components`
- Page-specific components near their pages
- Utilities in `/src/utils`

---

## ✅ **PRE-FLIGHT CHECKLIST**

Before making changes, confirm:

- [ ] I've read this guide
- [ ] I've read the relevant architecture docs
- [ ] I understand the tech stack
- [ ] I know where to make changes
- [ ] I know how to test changes
- [ ] I have a git branch ready
- [ ] I know the environment variables needed

---

## 🎓 **LEARNING RESOURCES**

If you need to understand the technologies:

- **React:** [react.dev](https://react.dev)
- **Gatsby:** [gatsbyjs.com/docs](https://www.gatsbyjs.com/docs/)
- **GraphQL:** [graphql.org/learn](https://graphql.org/learn/)
- **Netlify Functions:** [docs.netlify.com/functions](https://docs.netlify.com/functions/overview/)

---

**Remember: When in doubt, ask before making changes. It's better to clarify than to fix mistakes later!**

**Next Step:** Read `PROJECT_BLUEPRINT.md` to understand the full system architecture.
