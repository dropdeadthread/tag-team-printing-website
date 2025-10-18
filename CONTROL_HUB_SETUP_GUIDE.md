# 🔐 CONTROL HUB API KEY - SETUP GUIDE

**⚠️ This is a SAFE version with NO actual API keys - safe to commit to GitHub**

---

## **🔍 How Control Hub Authentication Works**

Control Hub accepts API keys in TWO ways:

1. **HTTP Header:** `x-api-key: [your-api-key-here]`
2. **Query Parameter:** `?api_key=[your-api-key-here]`

**Important:** Control Hub does NOT check the `Authorization` header!

---

## **✅ CORRECT IMPLEMENTATION**

In your Netlify functions (`streamlined-order.js`):

```javascript
// ✅ CORRECT
headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.CONTROL_HUB_API_KEY  // ✅ Correct header name and variable
}
```

**❌ WRONG (Old code):**

```javascript
// ❌ WRONG - Control Hub doesn't check this!
headers: {
    'Authorization': `Bearer ${process.env.CONTROL_HUB_SECRET || ''}`
}
```

---

## **🎯 For Netlify Environment Variables**

### **Required Variables:**

| Variable Name               | Example Value                | Secret?    | Notes                            |
| --------------------------- | ---------------------------- | ---------- | -------------------------------- |
| `CONTROL_HUB_URL`           | `https://your-server.com`    | ❌ No      | Your Control Hub server address  |
| `CONTROL_HUB_API_KEY`       | `[Set in Netlify Dashboard]` | ✅ **YES** | Must match Control Hub's API_KEY |
| `SQUARE_ACCESS_TOKEN`       | `[Set in Netlify Dashboard]` | ✅ **YES** | For payments                     |
| `GATSBY_SQUARE_APP_ID`      | `[Your Square app ID]`       | ❌ No      | Public identifier                |
| `GATSBY_SQUARE_LOCATION_ID` | `[Your location ID]`         | ❌ No      | Public identifier                |

---

## **🔒 Security Levels**

### **Level 1: No API Key (INSECURE)**

```bash
# In Control Hub .env
API_KEY=
```

**Result:** Anyone can access your Control Hub API (NOT RECOMMENDED)

### **Level 2: Simple API Key**

```bash
# In Control Hub .env
API_KEY=your-chosen-key-here
```

**Result:** Basic authentication

### **Level 3: Strong API Key (RECOMMENDED)**

```bash
# Generate a strong key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Use output in Control Hub .env:
API_KEY=CHK_live_[generated-key-here]
```

**Result:** Much more secure

---

## **🚀 Deployment Checklist**

### **Step 1: Verify Control Hub is Running**

```bash
curl http://localhost:4000/health
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
  -H "x-api-key: [your-api-key]" \
  -d '{"orderId": "TEST-123"}'
```

**Expected:** `200 OK`

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

---

## **🎯 Production Recommendations**

1. **Generate a Strong API Key:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update Both Places:**

   - Control Hub: `backend/.env` → `API_KEY=...`
   - Netlify: Environment Variables → `CONTROL_HUB_API_KEY=...`

3. **Use HTTPS for Production:**
   ```bash
   CONTROL_HUB_URL=https://your-control-hub-domain.com
   ```

---

## **🔑 Quick Reference**

```bash
# Control Hub expects:
Header: x-api-key
Value: [your-api-key-from-env]

# OR as query parameter:
URL: https://api.example.com/endpoint?api_key=[your-api-key]

# NOT this:
Authorization: Bearer [key]  # ❌ Won't work
```

**Remember:**

- Variable name is `CONTROL_HUB_API_KEY`, NOT `CONTROL_HUB_SECRET`
- Use `x-api-key` header, NOT `Authorization` header
- Keep your actual API key stored ONLY in Netlify environment variables and Control Hub .env file
- NEVER commit actual API keys to GitHub

---

## **📍 Where to Find Your Actual API Key:**

1. **Control Hub:** Check `backend/.env` file (locally)
2. **Netlify:** Site Settings → Environment Variables → `CONTROL_HUB_API_KEY`

**These two values MUST MATCH!**
