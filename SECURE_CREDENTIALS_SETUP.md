# 🔐 SECURE CREDENTIALS SETUP GUIDE

## **The Problem:**

Your credentials were exposed in `.env.production`. I've cleaned that file, but you need to set up credentials in two places:

1. **Netlify Dashboard** - For when Netlify builds your site
2. **GitHub Secrets** - For when GitHub Actions deploys to Netlify

---

## **📋 STEP 1: Set Up Netlify Environment Variables**

### **Go to Netlify Dashboard:**

1. Log in to https://app.netlify.com
2. Select your Tag Team Printing site
3. Go to: **Site Settings** → **Environment Variables**
4. Click **Add a variable**

### **Add These Variables:**

```bash
# Square Payment (REQUIRED)
SQUARE_ACCESS_TOKEN = EAAAl3V5nKRHwUZ_GdQbnkgf903DnMrSppPtKoJBPQDamIwLUoR9aVg9g6GthhtJ
GATSBY_SQUARE_APP_ID = sq0idp-5lvym4cTdjzdki3BV6B2MA
GATSBY_SQUARE_LOCATION_ID = DVTVP2H4C8A0X

# Control Hub (REQUIRED)
CONTROL_HUB_URL = https://your-actual-control-hub-url.com
CONTROL_HUB_API_KEY = control-hub-secure-key-2025
CONTROL_HUB_WEBHOOK_SECRET = prod-secret-key-tagteam-change-this

# Site Config (REQUIRED)
NODE_ENV = production
SITE_URL = https://tagteamprints.com
GATSBY_GA_TRACKING_ID = G-220DWNXBFQ

# SMS/Notifications (if using)
SNS_API_KEY = 5d49715b-56f6-433b-9b45-380862878174
SNS_API_USERNAME = 419372

# Cloudinary (ONLY if using for image uploads)
CLOUDINARY_CLOUD_NAME = dnsgrkjha
CLOUDINARY_API_KEY = 924339476782162
CLOUDINARY_API_SECRET = your_api_secret_from_cloudinary_dashboard
```

**Note:** For each variable, set the scope to **"All deploy contexts"** or just **"Production"**

---

## **📋 STEP 2: Set Up GitHub Secrets** (For GitHub Actions)

### **Go to Your GitHub Repository:**

1. Go to: https://github.com/YOUR-USERNAME/YOUR-REPO
2. Click **Settings** (repository settings, not your account)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **Add These Two Secrets:**

**Secret 1:**

- Name: `NETLIFY_AUTH_TOKEN`
- Value: `nfp_aGJmiwPyvCfWFW3oczAcw67u4MFvZJKf20e4`

**Secret 2:**

- Name: `NETLIFY_SITE_ID`
- Value: `a123946b-bf62-41d6-a537-44abc4a517c3`

**That's it!** Your GitHub Actions workflow will now use these secrets securely.

---

## **📋 STEP 3: Clean Up Git History** (IMPORTANT!)

If `.env.production` with credentials was previously committed to Git, it's still in your Git history. You need to remove it:

### **Option A: Simple Method (Recommended)**

```bash
# Navigate to your project
cd "C:\Users\Stacey\Documents\tag team printing website\tag team printing website"

# Remove the file from Git tracking (keeps local copy)
git rm --cached .env.production

# Commit the change
git add .
git commit -m "Security: Remove .env.production from Git (credentials moved to environment variables)"

# Push to GitHub
git push
```

### **Option B: Complete History Cleanup** (If credentials were committed before)

⚠️ **Warning:** This rewrites Git history. Backup first!

```bash
# Install BFG Repo Cleaner (Windows)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Run BFG to remove .env.production from all history
java -jar bfg.jar --delete-files .env.production

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (CAUTION!)
git push --force
```

**OR use GitHub's built-in tool:**

1. Go to repository settings
2. Scroll to "Danger Zone"
3. Click "Change repository visibility" → Make it private (if needed)

---

## **📋 STEP 4: Update Your Local .env.production**

I've already cleaned the file for you, but **keep a backup** with your real credentials locally for reference. Just don't commit it!

**Create a separate file:** `.env.production.backup` (in your Downloads or somewhere safe)

```bash
# Save your real credentials here - DO NOT COMMIT TO GIT
SQUARE_ACCESS_TOKEN=EAAAl3V5nKRHwUZ_GdQbnkgf903DnMrSppPtKoJBPQDamIwLUoR9aVg9g6GthhtJ
NETLIFY_AUTH_TOKEN=nfp_aGJmiwPyvCfWFW3oczAcw67u4MFvZJKf20e4
# ... etc
```

---

## **✅ VERIFICATION CHECKLIST**

After setup, verify:

### **In Netlify Dashboard:**

- [ ] All environment variables are set
- [ ] Variables are scoped to "Production" or "All"
- [ ] Try a new deploy - it should use these variables

### **In GitHub:**

- [ ] `NETLIFY_AUTH_TOKEN` secret exists
- [ ] `NETLIFY_SITE_ID` secret exists
- [ ] `.env.production` is NOT visible in your repository files
- [ ] Check commit history - credentials should be removed

### **In Your Workflow:**

- [ ] `.github/workflows/deploy-to-netlify.yml` uses `${{ secrets.XXX }}`
- [ ] No hardcoded credentials in the workflow file

---

## **🎯 WHY THIS MATTERS**

### **Before (INSECURE):**

```bash
# .env.production committed to Git
SQUARE_ACCESS_TOKEN=EAAAl3V5nKRH...  # ⚠️ Anyone can see this!
NETLIFY_AUTH_TOKEN=nfp_aGJmiw...     # ⚠️ They can deploy to your site!
```

### **After (SECURE):**

```bash
# .env.production - NO sensitive data
GATSBY_GA_TRACKING_ID=G-220DWNXBFQ  # ✅ Safe to commit

# Real credentials stored in:
# → Netlify Dashboard (for builds)
# → GitHub Secrets (for deploys)
# → Your local backup file (not committed)
```

---

## **🚨 SECURITY BEST PRACTICES**

1. **Never commit:**

   - API keys
   - Access tokens
   - Passwords
   - Webhook secrets
   - Private keys

2. **Always use:**

   - Environment variables in hosting platform
   - Secrets in CI/CD pipeline
   - `.gitignore` for sensitive files

3. **If credentials leak:**
   - Immediately rotate/regenerate them
   - Check GitHub commit history
   - Update all systems with new credentials

---

## **📞 QUICK REFERENCE**

**Where to find your credentials:**

| Credential      | Where to Get It                                                    |
| --------------- | ------------------------------------------------------------------ |
| Square tokens   | https://developer.squareup.com/apps → Your App → Credentials       |
| Netlify tokens  | https://app.netlify.com/user/applications → Personal access tokens |
| Netlify Site ID | Netlify Dashboard → Site Settings → Site Information               |
| Control Hub     | Your Control Hub admin panel                                       |

---

## **✅ NEXT STEPS**

1. Set up Netlify environment variables (5 min)
2. Set up GitHub secrets (2 min)
3. Remove .env.production from Git (1 min)
4. Test deploy (it should work now!)

**Your credentials are now secure!** 🔐
