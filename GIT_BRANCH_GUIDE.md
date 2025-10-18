# 🎯 GIT BRANCHES - SIMPLE GUIDE

**Created:** October 18, 2025  
**Status:** Fix applied to local files

---

## ✅ **WHAT I JUST DID**

I fixed the image URL bug in your local file:

- **File changed:** `src/templates/SimpleProductPageTemplate.jsx`
- **What was fixed:** Image URLs now use `process.env.NODE_ENV` instead of checking `window.location.hostname`
- **Why this fixes deployment:** It works during both build-time and run-time

Your local files are now ready to commit and push!

---

## 🌳 **WHAT ARE GIT BRANCHES? (Simple Explanation)**

Think of git branches like **parallel universes** for your code:

- **main branch** = Your "official" website code that's live on Netlify
- **fix branch** = A separate copy where you test changes safely

**Benefits:**
✅ Your main code stays safe while you test  
✅ Easy to experiment without breaking things  
✅ Can review changes before merging  
✅ If something goes wrong, just delete the branch!

---

## 📋 **STEP-BY-STEP: USING THE FIX**

### **Step 1: Open Terminal/Command Prompt**

Navigate to your project:

```bash
cd "C:\Users\Stacey\Documents\tag team printing website\tag team printing website"
```

### **Step 2: Create a Safe Branch** ✨

```bash
git checkout -b fix/image-urls-netlify
```

**What this does:** Creates a new branch called `fix/image-urls-netlify` and switches to it.  
**Translation:** "Make a copy of my code so I can test the fix without touching the main version"

### **Step 3: Check What Changed**

```bash
git status
```

You should see:

```
modified:   src/templates/SimpleProductPageTemplate.jsx
```

Want to see the exact changes?

```bash
git diff src/templates/SimpleProductPageTemplate.jsx
```

(Press `q` to exit when you're done looking)

### **Step 4: Commit the Fix** 📦

```bash
git add src/templates/SimpleProductPageTemplate.jsx

git commit -m "fix: Use process.env.NODE_ENV for image URLs to fix Netlify deployment

- Replaces window.location.hostname checks with process.env.NODE_ENV
- Adds centralized getImageUrl helper function
- Fixes SSR issues during Gatsby build on Netlify
- Images now correctly proxy through /ss-images/ in production"
```

**What this does:** Saves your changes with a description of what you fixed.

### **Step 5: Test Locally First** 🧪

Before pushing to GitHub, test that it still works locally:

```bash
npm run clean
npm run build
```

Wait for it to finish building (should say "Created X product pages").

Then serve it:

```bash
npm run serve
```

Open `http://localhost:9000` in your browser and check:

- ✅ Product pages load
- ✅ Images show up
- ✅ No errors in console (Press F12 → Console tab)

If everything works, press `Ctrl+C` to stop the server.

### **Step 6: Push to GitHub** 🚀

```bash
git push origin fix/image-urls-netlify
```

**What this does:** Uploads your fix branch to GitHub (but doesn't affect your main branch yet!)

---

## 🎬 **WHAT HAPPENS NEXT ON GITHUB**

After you push, GitHub will show you a message like:

```
Create a pull request for 'fix/image-urls-netlify' on GitHub
```

### **Option A: Merge via GitHub (RECOMMENDED)**

1. Go to GitHub: https://github.com/dropdeadthread/tag-team-printing-website
2. You'll see a yellow banner: "fix/image-urls-netlify had recent pushes"
3. Click **"Compare & pull request"**
4. Review the changes (green = added, red = removed)
5. Click **"Create pull request"**
6. Review one more time
7. Click **"Merge pull request"**
8. Click **"Confirm merge"**
9. Click **"Delete branch"** (optional cleanup)

**What happens:**

- ✅ Your fix gets merged into main
- ✅ Netlify automatically detects the change
- ✅ Netlify builds and deploys the site
- ✅ You get a notification when it's live

### **Option B: Merge via Command Line (FASTER)**

If you're feeling confident:

```bash
# Switch back to main branch
git checkout main

# Merge the fix
git merge fix/image-urls-netlify

# Push to GitHub (this triggers Netlify)
git push origin main

# Optional: Delete the fix branch since we're done with it
git branch -d fix/image-urls-netlify
git push origin --delete fix/image-urls-netlify
```

---

## 🔍 **MONITORING THE DEPLOYMENT**

### **Watch Netlify Build:**

1. Go to Netlify Dashboard
2. Click on your site
3. Go to **"Deploys"** tab
4. Watch the build log scroll by

**Look for these good signs:**

```
✅ Created [NUMBER] product pages
✅ success Building production JavaScript and CSS bundles
✅ Site is live ✨
```

### **Check the Live Site:**

1. Visit your live URL: `https://tagteamprints.com`
2. Click on a product
3. Check if images load
4. Open browser console (F12) - should be no errors

---

## 🆘 **IF SOMETHING GOES WRONG**

### **Scenario 1: Build Fails on Netlify**

**Check the build log for errors.** Most likely causes:

- Syntax error (typo in the code)
- Missing environment variables

**How to fix:**

1. Fix the error locally
2. Commit again: `git add . && git commit -m "fix: corrected typo"`
3. Push again: `git push origin fix/image-urls-netlify` (or main, depending on which branch you're on)

### **Scenario 2: Images Still Don't Load**

**Check:**

1. Are the `/ss-images/` Netlify functions deployed?
   - Go to Netlify → Functions tab
   - Should see `ss-images` listed
2. Are environment variables set?
   - Go to Netlify → Site Settings → Environment Variables
   - Check `SNS_API_USERNAME` and `SNS_API_KEY` exist

### **Scenario 3: Want to Undo Everything**

**If you haven't pushed to main yet:**

```bash
# Switch back to main (nothing changed there!)
git checkout main

# Delete the fix branch
git branch -D fix/image-urls-netlify
```

**If you already pushed to main:**

```bash
# Revert to the previous version
git revert HEAD
git push origin main
```

---

## 📚 **QUICK REFERENCE**

### **Common Git Commands:**

```bash
# See what branch you're on
git branch

# Switch branches
git checkout main
git checkout fix/image-urls-netlify

# See what changed
git status
git diff

# Undo changes to a file (before committing)
git checkout -- src/templates/SimpleProductPageTemplate.jsx

# See commit history
git log --oneline

# Push to GitHub
git push origin [branch-name]
```

### **Your Branches:**

- **main** = Your live/production code
- **fix/image-urls-netlify** = The fix we just made (temporary)

After merging, you can delete the fix branch - you don't need it anymore!

---

## ✅ **SUCCESS CRITERIA**

After the deployment, you should have:

✅ Netlify build completes without errors  
✅ Product pages are generated (check build log)  
✅ Images load on live site  
✅ No console errors in browser  
✅ Color selection changes images  
✅ All product pages accessible

---

## 💡 **PRO TIP**

From now on, whenever you want to make changes:

1. Create a new branch: `git checkout -b feature/my-new-feature`
2. Make your changes
3. Test locally
4. Push: `git push origin feature/my-new-feature`
5. Merge via GitHub or command line
6. Delete the branch when done

This way, your main branch stays clean and you can always go back if needed!

---

**Need help with any step? Let me know! 🎉**
