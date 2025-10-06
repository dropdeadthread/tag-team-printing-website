# 🚨 DEPLOYMENT FAILURE ROOT CAUSE ANALYSIS & FIXES

## **Executive Summary**

Every deployment has failed due to **3 critical issues** in your Netlify Functions. All issues have been identified and fixes provided below.

---

## ❌ **CRITICAL ISSUE #1: ES6 Module Syntax in Serverless Functions**

### **Problem:**

Your Netlify Functions use ES6 `import` syntax, but Netlify Functions require CommonJS `require()` syntax by default.

### **Affected Files:**

- `/netlify/functions/streamlined-order.js`
- `/netlify/functions/process-payment.js`

### **Error You're Seeing:**

```
SyntaxError: Cannot use import statement outside a module
```

or

```
Function invocation failed
```

### **Why It Fails:**

Netlify Functions run in a Node.js environment that expects CommonJS modules unless you specifically configure them for ES modules (which requires package.json in the functions directory).

### **✅ FIX:**

**Option A: Convert to CommonJS (RECOMMENDED)**

Replace the import statements with require():

```javascript
// ❌ BEFORE (ES6 - FAILS)
import { promises as fs } from 'fs';
import { Client, Environment } from 'square';
import crypto from 'crypto';

// ✅ AFTER (CommonJS - WORKS)
const fs = require('fs').promises;
const { Client, Environment } = require('square');
const crypto = require('crypto');
```

Also change the export:

```javascript
// ❌ BEFORE (ES6 - FAILS)
export default async function handler(req, res) { ... }

// ✅ AFTER (CommonJS - WORKS)
exports.handler = async function(event, context) { ... }
```

**I've created fixed versions:**

- `streamlined-order-FIXED.js`
- `process-payment-FIXED.js`

**Option B: Enable ES Modules (Advanced)**
Create a `package.json` in the `/netlify/functions/` directory with:

```json
{
  "type": "module"
}
```

---

## ❌ **CRITICAL ISSUE #2: File System Writing in Read-Only Environment**

### **Problem:**

`streamlined-order.js` tries to write to the file system, but **Netlify Functions are read-only**.

```javascript
// ❌ THIS FAILS - Cannot write to filesystem!
const ORDERS_FILE = path.join(process.cwd(), 'data', 'streamlined-orders.json');
await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
```

### **Why It Fails:**

Serverless functions run in ephemeral, read-only containers. They cannot persist data to the file system.

### **✅ FIX OPTIONS:**

**Option 1: Use Control Hub API (BEST SOLUTION)**
Your code already sends to Control Hub. Remove the file writing completely:

```javascript
// ✅ Just send to Control Hub - no file writing needed
const hubResult = await sendToControlHub(orderData, orderId);

// Return success based on Hub response
return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    orderId: orderId,
    jobId: hubResult?.jobId,
  }),
};
```

**Option 2: Use Netlify Blobs (For backup storage)**

```javascript
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const store = getStore('orders');
  await store.set(orderId, JSON.stringify(order));
};
```

**Option 3: Use a Database**

- Supabase (PostgreSQL)
- MongoDB Atlas
- Firebase

**My fixed version uses Option 1** - sending only to Control Hub and removing file system writes.

---

## ⚠️ **ISSUE #3: Request Body Parsing**

### **Problem:**

`process-payment.js` tries to parse an already-parsed body:

```javascript
const body = JSON.parse(req.body); // ❌ May already be an object
```

### **Why It Fails:**

Netlify automatically parses JSON request bodies. When you try to `JSON.parse()` an object, it fails.

### **✅ FIX:**

```javascript
// ✅ Handle both cases safely
const body =
  typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
```

Or simply:

```javascript
// ✅ Trust Netlify's parsing
const { token, amount } = JSON.parse(event.body);
```

---

## 🔧 **ADDITIONAL REQUIRED FIXES**

### **4. Environment Variables in .env.production**

Update these placeholder values:

```bash
# ❌ CURRENT (Will cause errors)
CLOUDINARY_API_KEY=your_production_cloudinary_api_key
CLOUDINARY_API_SECRET=your_production_cloudinary_api_secret

# ✅ REPLACE WITH REAL VALUES
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Also update Control Hub settings
CONTROL_HUB_URL=https://your-actual-control-hub-url.com
CONTROL_HUB_API_KEY=your-real-api-key-here
```

### **5. Square Environment Setting**

**In `process-payment.js`:**

```javascript
// ❌ CURRENTLY HARDCODED TO SANDBOX
environment: Environment.Sandbox,

// ✅ USE ENVIRONMENT VARIABLE
environment: process.env.NODE_ENV === 'production'
  ? Environment.Production
  : Environment.Sandbox,
```

### **6. Netlify Function Handler Signature**

Netlify Functions use a different signature than Express:

```javascript
// ❌ WRONG for Netlify
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// ✅ CORRECT for Netlify
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};
```

---

## 📋 **STEP-BY-STEP DEPLOYMENT FIX**

### **Step 1: Replace Function Files**

```bash
# Backup originals
cd "C:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions"
move streamlined-order.js streamlined-order.js.backup
move process-payment.js process-payment.js.backup

# Use fixed versions
move streamlined-order-FIXED.js streamlined-order.js
move process-payment-FIXED.js process-payment.js
```

### **Step 2: Update Environment Variables**

In Netlify Dashboard:

1. Go to Site Settings > Environment Variables
2. Add/Update these variables:
   ```
   SQUARE_ACCESS_TOKEN=[your-production-token]
   GATSBY_SQUARE_LOCATION_ID=[your-location-id]
   CONTROL_HUB_URL=[your-control-hub-url]
   CONTROL_HUB_API_KEY=[your-api-key]
   CLOUDINARY_API_KEY=[if-using-cloudinary]
   CLOUDINARY_API_SECRET=[if-using-cloudinary]
   NODE_ENV=production
   ```

### **Step 3: Install Required Dependencies**

Make sure `package.json` includes:

```json
{
  "dependencies": {
    "node-fetch": "^2.6.1",
    "square": "^43.0.0"
  }
}
```

Note: Use `node-fetch` v2.x (not v3) for CommonJS compatibility.

### **Step 4: Test Local Build**

```bash
npm install
npm run build
netlify dev  # Test functions locally
```

### **Step 5: Deploy**

```bash
# Push to GitHub
git add .
git commit -m "Fix: Convert Netlify Functions to CommonJS, remove file system writes"
git push

# Or deploy directly
netlify deploy --prod
```

---

## 🎯 **VERIFICATION CHECKLIST**

After deployment, verify:

- [ ] Build completes without errors
- [ ] Functions deploy successfully
- [ ] `/.netlify/functions/streamlined-order` endpoint is accessible
- [ ] `/.netlify/functions/process-payment` endpoint is accessible
- [ ] Orders submit successfully
- [ ] Payments process correctly
- [ ] Data reaches Control Hub

---

## 🆘 **If Still Failing:**

### **Check Netlify Deploy Logs:**

1. Go to Netlify Dashboard > Site > Deploys
2. Click on failed deploy
3. Look for errors in "Function bundling" section
4. Common errors:
   - "Cannot find module" → Missing dependency in package.json
   - "SyntaxError" → Still using ES6 imports
   - "ENOENT" → Trying to access file system

### **Check Function Logs:**

1. Go to Netlify Dashboard > Functions
2. Click on function name
3. View real-time logs
4. Test with sample requests

### **Enable Detailed Logging:**

Add to your functions:

```javascript
console.log('Event:', JSON.stringify(event));
console.log('Body:', event.body);
```

---

## 📞 **Quick Support Checklist**

If you need to troubleshoot with Netlify support, provide:

1. **Deploy Log** - Full build and function bundling output
2. **Function Log** - Real-time execution logs
3. **Environment** - Which variables are set
4. **Package.json** - Dependency versions
5. **Node Version** - From netlify.toml or dashboard

---

## ✅ **EXPECTED RESULT AFTER FIXES**

- ✅ Build completes successfully
- ✅ Functions deploy without errors
- ✅ Orders save to Control Hub
- ✅ Payments process through Square
- ✅ No file system errors
- ✅ No import syntax errors

**All deployment failures should be resolved!** 🎉
