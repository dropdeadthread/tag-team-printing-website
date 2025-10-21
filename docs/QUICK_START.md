# 🚀 QUICK START - FIX IS READY TO DEPLOY

**Date:** October 18, 2025  
**Status:** ✅ Fix applied to local files, ready to push

---

## 📍 **WHERE YOU ARE NOW**

✅ The bug fix has been applied to your local file  
✅ Your main branch is untouched (safe!)  
✅ Ready to create a git branch and deploy

**What was fixed:**

- Image URLs now work correctly during Netlify build
- Used `process.env.NODE_ENV` instead of `window.location.hostname`
- Images will proxy through `/ss-images/` in production

---

## ⚡ **FASTEST PATH TO DEPLOYMENT**

### **Copy/Paste These Commands:**

Open your terminal and run these one at a time:

```bash
# 1. Navigate to project
cd "C:\Users\Stacey\Documents\tag team printing website\tag team printing website"

# 2. Create safe branch
git checkout -b fix/image-urls-netlify

# 3. Stage the changes
git add src/templates/SimpleProductPageTemplate.jsx

# 4. Commit with clear message
git commit -m "fix: Use process.env.NODE_ENV for image URLs to fix Netlify deployment"

# 5. Test locally (IMPORTANT!)
npm run clean && npm run build && npm run serve
```

**After npm run serve**, open http://localhost:9000 and check:

- Product pages load? ✅
- Images show up? ✅
- No console errors (F12 → Console)? ✅

**If everything works**, press Ctrl+C to stop the server, then:

```bash
# 6. Push to GitHub
git push origin fix/image-urls-netlify
```

---

## 🎯 **WHAT TO DO ON GITHUB**

After pushing, you'll see a message with a link. **Follow these steps:**

1. Go to: https://github.com/dropdeadthread/tag-team-printing-website
2. Look for yellow banner: **"fix/image-urls-netlify had recent pushes"**
3. Click **"Compare & pull request"**
4. Review changes (looks good? Continue)
5. Click **"Create pull request"**
6. Click **"Merge pull request"**
7. Click **"Confirm merge"**
8. **Done!** Netlify will automatically build and deploy

---

## ⏱️ **TIMELINE**

- **Push to GitHub:** 30 seconds
- **Create Pull Request:** 1 minute
- **Netlify Build:** 3-5 minutes
- **Total time:** ~5-7 minutes from push to live! 🎉

---

## 📊 **WHAT TO WATCH FOR**

### **During Build (Netlify Dashboard → Deploys):**

Good signs:

```
✅ Building Gatsby site
✅ Created [X] product pages
✅ Building production JavaScript bundles
✅ Success!
✅ Site is live
```

Bad signs:

```
❌ Error: [something failed]
```

### **On Live Site:**

Test these:

1. Visit a product page
2. Check images load
3. Change color - does image update?
4. Open console (F12) - no red errors?

If all ✅ = **Success!** 🎊

---

## 🆘 **EMERGENCY CONTACTS**

### **If Build Fails:**

Check these 3 things:

1. **Environment Variables in Netlify**

   - Site Settings → Environment Variables
   - Verify `SNS_API_USERNAME` and `SNS_API_KEY` exist

2. **Build Log Errors**

   - Look for the red ❌ error message
   - Usually it's pretty clear what broke

3. **Function Deployment**
   - Netlify → Functions tab
   - Should see `ss-images` function

### **If You Need to Undo:**

```bash
# Switch back to main (unchanged!)
git checkout main

# Delete the fix branch
git branch -D fix/image-urls-netlify
```

Everything back to normal. No harm done!

---

## 📁 **FILES I CREATED FOR YOU**

1. **GIT_BRANCH_GUIDE.md** - Full explanation of branches
2. **DEPLOYMENT_FIX_SUMMARY.md** - Technical details
3. **DEPLOYMENT_DIAGNOSIS.md** - Complete problem analysis
4. **This file (QUICK_START.md)** - You are here!

All saved in your project root.

---

## 🎓 **UNDERSTANDING GIT BRANCHES (1-Minute Version)**

**Q: What is a branch?**  
A: A separate copy of your code where you can experiment safely.

**Q: Will this break my main code?**  
A: Nope! Your `main` branch is untouched until you merge.

**Q: What if I mess up?**  
A: Just delete the branch. Main branch = still perfect.

**Q: Do I need to do something after pushing?**  
A: Yes - go to GitHub and create a Pull Request (I explained this above).

**Q: What does "merge" mean?**  
A: Taking changes from your fix branch and putting them into main branch.

**Q: After merging, what about the fix branch?**  
A: You can delete it! It's just a temporary workspace.

---

## ✨ **YOU'VE GOT THIS!**

The fix is done. The commands are simple. GitHub makes it easy.

**Next steps:**

1. Run the commands above
2. Test locally
3. Push to GitHub
4. Merge on GitHub
5. Watch Netlify deploy
6. Check live site

**Estimated time:** 10 minutes total

**Risk level:** Very low (branch keeps main safe!)

---

**Questions? Need help? Just ask! 🙌**
