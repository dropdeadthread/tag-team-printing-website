# 📚 DOCUMENTATION INDEX - Start Here!

**Tag Team Printing - Complete Documentation Suite**  
**Last Updated: October 18, 2025**

---

## 🎯 **PURPOSE OF THIS DOCUMENTATION**

This documentation suite solves a critical problem:

**Problem:** AI assistants lose context between sessions, requiring constant re-explanation of architecture, tech stack, and business logic.

**Solution:** Comprehensive blueprints that ANY developer (human or AI) can read to immediately understand the entire system.

**Result:** Faster development, fewer errors, consistent code quality.

---

## 📖 **READING ORDER FOR NEW AI ASSISTANTS**

### **🚨 CRITICAL - Read in this order:**

1. **AI_ASSISTANT_QUICK_START.md** ← START HERE

   - Quick orientation
   - Critical rules
   - Common pitfalls
   - **Time: 5 minutes**

2. **PROJECT_BLUEPRINT.md**

   - Complete system architecture
   - How website + Control Hub connect
   - Data flow diagrams
   - **Time: 10 minutes**

3. **TAG_TEAM_ARCHITECTURE.md**

   - Website technical deep-dive
   - Gatsby/React patterns
   - Build process details
   - **Time: 10 minutes**

4. **COMMON_TASKS.md**
   - Step-by-step guides
   - How to fix common issues
   - Quick reference
   - **Time: 5 minutes**

**Total Reading Time: ~30 minutes**  
**Value: Saves HOURS of mistakes**

---

## 📁 **DOCUMENT DESCRIPTIONS**

### **Core Documentation:**

| Document                        | Purpose                           | When to Read               |
| ------------------------------- | --------------------------------- | -------------------------- |
| **AI_ASSISTANT_QUICK_START.md** | Entry point for all AI assistants | First thing, every session |
| **PROJECT_BLUEPRINT.md**        | System architecture overview      | Before making any changes  |
| **TAG_TEAM_ARCHITECTURE.md**    | Website technical details         | When working on website    |
| **COMMON_TASKS.md**             | How-to guides                     | When doing specific tasks  |

### **Reference Documentation:**

| Document                       | Purpose                            | When to Read                  |
| ------------------------------ | ---------------------------------- | ----------------------------- |
| **CONTROL_HUB_SETUP_GUIDE.md** | API authentication setup           | When connecting systems       |
| **PRIVATE_API_KEYS.md**        | Actual API key values (local only) | When configuring environments |
| **GIT_BRANCH_GUIDE.md**        | Git workflow instructions          | Before making commits         |
| **DEPLOYMENT_FIX_SUMMARY.md**  | Recent deployment fixes            | When deployment fails         |

### **Troubleshooting Documentation:**

| Document                    | Purpose                | When to Read             |
| --------------------------- | ---------------------- | ------------------------ |
| **QUICK_START.md**          | Fast deployment guide  | Emergency fixes          |
| **DEPLOYMENT_DIAGNOSIS.md** | Build failure analysis | When Netlify build fails |

---

## 🎓 **FOR HUMAN DEVELOPERS**

### **First Day on the Project:**

1. Read AI_ASSISTANT_QUICK_START.md
2. Read PROJECT_BLUEPRINT.md
3. Clone the repo
4. Set up environment (see below)
5. Run `npm install && npm run develop`
6. Read COMMON_TASKS.md while developing

### **Environment Setup:**

```bash
# 1. Clone repository
git clone https://github.com/dropdeadthread/tag-team-printing-website.git
cd tag-team-printing-website

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.development

# 4. Add your API keys (ask team lead)
# Edit .env.development

# 5. Start development server
npm run develop

# 6. Open browser
# Visit http://localhost:8000
```

---

## 🤖 **FOR AI ASSISTANTS**

### **Every New Session:**

```
1. Acknowledge you've read AI_ASSISTANT_QUICK_START.md
2. Ask which part of the system you'll be working on
3. Reference appropriate architecture doc
4. Confirm you understand before making changes
```

### **Before Writing Code:**

```
- Have I read the relevant architecture docs?
- Do I understand the tech stack?
- Do I know where this code should go?
- Have I checked for existing implementations?
- Am I following project conventions?
```

### **Making Changes:**

```
- Use proper git branches
- Test locally before pushing
- Follow naming conventions
- Add comments for complex logic
- Update docs if architecture changes
```

---

## 🗺️ **ARCHITECTURE QUICK REFERENCE**

### **Tech Stack:**

- **Frontend:** React + Gatsby 5
- **Hosting:** Netlify (static + functions)
- **Backend:** Node.js serverless functions
- **External APIs:** S&S Activewear, Square, Control Hub

### **Key Directories:**

```
src/pages/          → Static pages
src/templates/      → Dynamic page templates
src/components/     → Reusable components
netlify/functions/  → Backend API functions
gatsby-node.js      → Build-time page creation
```

### **Common Patterns:**

- SSR-safe code (avoid `window` during build)
- Environment variables for config
- Image proxy for CORS issues
- React Context for global state

---

## 🔗 **RELATED PROJECTS**

### **Control Hub AI Unified** (Separate Repository)

**Purpose:** Business management desktop app  
**Location:** `C:\Users\Stacey\Documents\control-hub-ai-unified`  
**Status:** Similar documentation needed (see TODO below)

**Integration:** Control Hub receives orders from website via API

---

## ✅ **DOCUMENTATION STATUS**

### **Tag Team Website (This Repo):**

- ✅ AI_ASSISTANT_QUICK_START.md
- ✅ PROJECT_BLUEPRINT.md
- ✅ TAG_TEAM_ARCHITECTURE.md
- ✅ COMMON_TASKS.md
- ✅ CONTROL_HUB_SETUP_GUIDE.md
- ✅ GIT_BRANCH_GUIDE.md
- ✅ Various troubleshooting docs

### **Control Hub (Other Repo):**

- ⚠️ Needs similar documentation suite
- ⚠️ Has many ad-hoc docs but no structure
- ⚠️ See TODO section below

---

## 📋 **TODO - Next Documentation Needs**

### **For Control Hub Repository:**

Create matching documentation:

1. **AI_ASSISTANT_QUICK_START_CONTROL_HUB.md**
2. **CONTROL_HUB_ARCHITECTURE.md**
3. **BACKEND_API_REFERENCE.md**
4. **DESKTOP_APP_ARCHITECTURE.md**
5. **COMMON_TASKS_CONTROL_HUB.md**

These should follow the same structure as Tag Team docs.

### **For Integration:**

Create:

1. **INTEGRATION_MAP.md** - How systems connect
2. **API_CONTRACT.md** - API interfaces between systems
3. **WEBHOOK_GUIDE.md** - Order webhooks documentation

---

## 🎯 **SUCCESS METRICS**

This documentation is successful if:

1. ✅ AI assistants can start working immediately
2. ✅ No need to re-explain architecture every session
3. ✅ Fewer mistakes from misunderstanding system
4. ✅ Faster development cycles
5. ✅ Consistent code quality

---

## 🔄 **KEEPING DOCS UPDATED**

### **When to Update Docs:**

- Architecture changes (update blueprints)
- New features added (update COMMON_TASKS.md)
- New tech stack items (update AI_ASSISTANT_QUICK_START.md)
- Common issues found (add to troubleshooting)

### **Who Updates:**

- Any developer making major changes
- Document updates should be part of PRs
- Review docs quarterly for accuracy

---

## 💡 **TIPS FOR EFFECTIVE USE**

### **For AI Assistants:**

1. **Always reference docs** when making architectural decisions
2. **Quote relevant sections** to confirm understanding
3. **Ask clarifying questions** if docs are unclear
4. **Suggest doc updates** if you find gaps

### **For Humans:**

1. **Onboard new team members** with these docs
2. **Reference in code reviews** for consistency
3. **Update as you learn** (living documentation)
4. **Share with AI assistants** at start of sessions

---

## 📞 **GETTING HELP**

### **If Documentation is Unclear:**

1. Ask for clarification
2. Read related sections
3. Check COMMON_TASKS.md for examples
4. Review actual code for context

### **If Documentation is Wrong:**

1. Note the error
2. Suggest correction
3. Update the doc
4. Commit the fix

---

## 🎓 **LEARNING PATH**

### **Beginner (Just Joined):**

1. AI_ASSISTANT_QUICK_START.md
2. PROJECT_BLUEPRINT.md
3. Set up local environment
4. Make a small change using COMMON_TASKS.md

### **Intermediate (Making Features):**

1. All core docs
2. TAG_TEAM_ARCHITECTURE.md (deep read)
3. Understand build process
4. Implement feature with tests

### **Advanced (Architecting):**

1. All documentation
2. Understand both systems
3. Make architectural decisions
4. Update documentation

---

## 📚 **EXTERNAL RESOURCES**

### **Framework Documentation:**

- [Gatsby Docs](https://www.gatsbyjs.com/docs/)
- [React Docs](https://react.dev)
- [Netlify Docs](https://docs.netlify.com/)

### **API Documentation:**

- [S&S Activewear API](https://www.ssactivewear.com/api/)
- [Square API](https://developer.squareup.com/)

### **Tools:**

- [VSCode](https://code.visualstudio.com/)
- [Git Documentation](https://git-scm.com/doc)

---

## ✨ **FINAL NOTES**

**This documentation exists to make your life easier.**

- Read it before coding
- Reference it during development
- Update it when things change
- Share it with others

**Time invested in reading docs = Time saved fixing mistakes**

---

**Questions? Suggestions? Found an error?**  
Update this documentation and commit the changes!

**Happy Coding! 🚀**
