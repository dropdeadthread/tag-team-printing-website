# 🔐 CONTROL HUB API KEY - COMPLETE GUIDE

## **Current Configuration**

### **Control Hub Backend** (`backend/.env`):

```bash
API_KEY=control-hub-secure-key-2025
```

### **Tag Team Website** (`.env.production`):

```bash
CONTROL_HUB_URL=http://localhost:4000
CONTROL_HUB_API_KEY=control-hub-secure-key-2025
```

**✅ The keys MATCH - this is correct!**

---

## **🔍 How Control Hub Authentication Works**

Looking at `control-hub-ai-unified/backend/server.js`:

```javascript
const API_KEY = process.env.API_KEY || '';

function requireApiKey(req, res, next) {
  if (!API_KEY) return next(); // If no key set, allow all requests
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (key === API_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### **Control Hub Accepts API Keys in TWO Ways:**

1. **HTTP Header:** `x-api-key: control-hub-secure-key-2025`
2. **Query Parameter:** `?api_key=control-hub-secure-key-2025`

**Important:** Control Hub does NOT check the `Authorization` header!

---

## **❌ PROBLEM FOUND IN OLD CODE**

Your original `streamlined-order.js` was sending:

```javascript
// ❌ WRONG - Control Hub doesn't check this!
headers: {
    'Authorization': `Bearer ${process.env.CONTROL_HUB_SECRET || ''}`
}
```

**This would FAIL authentication** because:

- Control Hub looks for `x-api-key` header
- You were sending `Authorization` header instead
- The variable name was wrong (`CONTROL_HUB_SECRET` vs `CONTROL_HUB_API_KEY`)

---

## **✅ CORRECT IMPLEMENTATION**

In the FINAL fixed version (`streamlined-order-FINAL.js`):

```javascript
// ✅ CORRECT
headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.CONTROL_HUB_API_KEY  // ✅ Correct header name and variable
}
```

---

## **🎯 For Netlify Environment Variables**

When setting up in Netlify Dashboard:

### **Required Variables:**

| Variable Name               | Value                                              | Secret?    | Notes                            |
| --------------------------- | -------------------------------------------------- | ---------- | -------------------------------- |
| `CONTROL_HUB_URL`           | `http://localhost:4000` (dev)<br>OR production URL | ❌ No      | Your Control Hub server address  |
| `CONTROL_HUB_API_KEY`       | `control-hub-secure-key-2025`                      | ✅ **YES** | Must match Control Hub's API_KEY |
| `SQUARE_ACCESS_TOKEN`       | Your Square token                                  | ✅ **YES** | For payments                     |
| `GATSBY_SQUARE_APP_ID`      | Your Square app ID                                 | ❌ No      | Public identifier                |
| `GATSBY_SQUARE_LOCATION_ID` | `DVTVP2H4C8A0X`                                    | ❌ No      | Public identifier                |

### **DO NOT Mark as Secret:**

- `CONTROL_HUB_URL` - Just a URL
- `GATSBY_SQUARE_LOCATION_ID` - Public identifier
- `GATSBY_SQUARE_APP_ID` - Public identifier

### **MUST Mark as Secret:**

- `CONTROL_HUB_API_KEY` - Authorizes access to Control Hub
- `SQUARE_ACCESS_TOKEN` - Authorizes payments

---

## **🔒 Security Levels**

### **Level 1: No API Key (INSECURE)**

```bash
# In Control Hub .env
API_KEY=
```

**Result:** Anyone can access your Control Hub API (NOT RECOMMENDED)

### **Level 2: Simple API Key (CURRENT)**

```bash
# In Control Hub .env
API_KEY=control-hub-secure-key-2025
```

**Result:** Basic authentication - anyone with the key can access

### **Level 3: Strong API Key (RECOMMENDED)**

```bash
# In Control Hub .env
API_KEY=CHK_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Result:** Harder to guess, more secure

### **Level 4: JWT Tokens (FUTURE)**

Implement JWT-based authentication for better security

---

## **🚀 Deployment Checklist**

### **Step 1: Verify Control Hub is Running**

```bash
# Check if Control Hub is accessible
curl http://localhost:4000/health
```

**Expected response:**

```json
{
  "status": "healthy",
  "services": {
    "mongodb": "connected",
    "aiService": "operational"
  }
}
```

### **Step 2: Test API Key Authentication**

**Without API key (should fail):**

```bash
curl -X POST http://localhost:4000/api/webhooks/order \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Expected:** `401 Unauthorized`

**With API key (should work):**

```bash
curl -X POST http://localhost:4000/api/webhooks/order \
  -H "Content-Type: application/json" \
  -H "x-api-key: control-hub-secure-key-2025" \
  -d '{"orderId": "TEST-123"}'
```

**Expected:** `200 OK` or endpoint-specific response

### **Step 3: Deploy Tag Team Website**

1. Set `CONTROL_HUB_API_KEY` in Netlify environment variables
2. Use the FINAL fixed function files
3. Test order submission after deploy

---

## **🔧 Troubleshooting**

### **Error: "Unauthorized" (401)**

**Possible Causes:**

1. API key not set in Netlify environment variables
2. Wrong header name (`Authorization` instead of `x-api-key`)
3. Key mismatch between Control Hub and website

**Fix:**

```javascript
// Make sure you're using:
headers: {
    'x-api-key': process.env.CONTROL_HUB_API_KEY
}
```

### **Error: "Cannot read property 'CONTROL_HUB_API_KEY'"**

**Cause:** Environment variable not set

**Fix:** Add to Netlify Dashboard → Site Settings → Environment Variables

### **Error: "ECONNREFUSED"**

**Cause:** Control Hub is not running or wrong URL

**Fix:**

1. Start Control Hub: `cd backend && npm start`
2. Update `CONTROL_HUB_URL` to correct address

---

## **📊 API Key Usage Summary**

### **Where the API Key is Used:**

1. **Tag Team Functions** (`netlify/functions/`):

   - `streamlined-order.js` → Sends orders to Control Hub
   - Future payment webhooks
   - Future customer notifications

2. **Protected Control Hub Endpoints:**
   - `/api/webhooks/order` - Receive orders
   - `/api/email/send` - Send emails
   - `/api/ai/preflight` - AI preflight checks
   - All endpoints with `requireApiKey` middleware

### **Where API Key is NOT Needed:**

- `/health` - Health check
- `/test` - Test endpoint
- Public endpoints without `requireApiKey`

---

## **🎯 Production Recommendations**

### **For Production Deployment:**

1. **Generate a Strong API Key:**

```bash
# Use a random, secure key generator
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output: `CHK_live_7f3a8b2c9d4e1f6g5h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5`

2. **Update Both Places:**

   - Control Hub: `backend/.env` → `API_KEY=...`
   - Netlify: Environment Variables → `CONTROL_HUB_API_KEY=...`

3. **Use HTTPS for Production:**

```bash
CONTROL_HUB_URL=https://your-control-hub-domain.com
```

4. **Add Rate Limiting:**
   Already configured in Control Hub:

```bash
RATE_LIMIT_WINDOW_MS=60000  # 1 minute window
RATE_LIMIT_MAX=120          # 120 requests per minute
```

---

## **✅ Current Status**

- ✅ Control Hub has API key set: `control-hub-secure-key-2025`
- ✅ Tag Team has matching API key in .env.production
- ❌ OLD code was using wrong header name (`Authorization` instead of `x-api-key`)
- ✅ FIXED code now uses correct header name
- ✅ Both use the same key value

**Next Step:** Replace your Netlify function files with the FINAL versions that use the correct header!

---

## **🔑 Quick Reference Card**

```bash
# Control Hub expects:
Header: x-api-key
Value: control-hub-secure-key-2025

# OR as query parameter:
URL: https://api.example.com/endpoint?api_key=control-hub-secure-key-2025

# NOT this:
Authorization: Bearer control-hub-secure-key-2025  # ❌ Won't work
```

**Remember:** The API key name in your code is `CONTROL_HUB_API_KEY`, NOT `CONTROL_HUB_SECRET`!
