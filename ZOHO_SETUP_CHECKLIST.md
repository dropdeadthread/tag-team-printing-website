# Zoho Email Setup - Quick Checklist

## ✅ Setup Checklist for info@tagteamprints.com

### Phase 1: Zoho Mail Setup (10 minutes)

- [ ] Login to https://mail.zoho.com with info@tagteamprints.com
- [ ] Go to Settings → Security → App Passwords
- [ ] Generate new password named "Tag Team Website"
- [ ] **SAVE THE PASSWORD!** (only shown once)

### Phase 2: Netlify Environment Variables (5 minutes)

Go to Netlify Dashboard → Tag Team site → Site configuration → Environment variables

Add these 6 variables (scope: **Functions only**):

| Variable          | Value                       |
| ----------------- | --------------------------- |
| `ZOHO_SMTP_HOST`  | `smtp.zoho.com`             |
| `ZOHO_SMTP_PORT`  | `465`                       |
| `ZOHO_SMTP_USER`  | `info@tagteamprints.com`    |
| `ZOHO_SMTP_PASS`  | (app password from Phase 1) |
| `ZOHO_FROM_EMAIL` | `info@tagteamprints.com`    |
| `ZOHO_FROM_NAME`  | `Tag Team Printing`         |

### Phase 3: Verify Files (Already Done! ✅)

- [x] nodemailer installed in functions directory
- [x] sendQuoteEmail.js function created

### Phase 4: Test Locally (10 minutes)

```bash
cd "c:/Users/Stacey/Documents/tag team printing website/tag team printing website"

# Start local dev server
netlify dev

# In another terminal, test:
curl -X POST http://localhost:8888/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d "{\"customerName\":\"Test Customer\",\"customerEmail\":\"your-email@gmail.com\",\"orderId\":\"TEST-001\",\"quantity\":25,\"garmentStyle\":\"G640 T-Shirt\",\"printColors\":2,\"totalPrice\":375.50,\"pricePerPiece\":15.02}"
```

### Phase 5: Deploy (5 minutes)

```bash
git add netlify/functions/sendQuoteEmail.js netlify/functions/package.json
git commit -m "Add Zoho email integration for quote notifications"
git push
```

### Phase 6: Test Production (5 minutes)

```bash
curl -X POST https://tagteamprints.com/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d "{\"customerName\":\"Test\",\"customerEmail\":\"your-email@gmail.com\",\"orderId\":\"PROD-TEST\",\"quantity\":25,\"garmentStyle\":\"G640\",\"printColors\":2,\"totalPrice\":375.50,\"pricePerPiece\":15.02}"
```

---

## 🎯 What's Already Done

✅ nodemailer installed
✅ sendQuoteEmail.js function created with professional template
✅ HTML email styling with Tag Team branding
✅ Error handling and validation
✅ CORS support

## 📝 What You Need to Do

1. **Get Zoho app password** (Phase 1)
2. **Add 6 environment variables to Netlify** (Phase 2)
3. **Test locally** (Phase 4)
4. **Deploy** (Phase 5)
5. **Test production** (Phase 6)

---

## 🔧 Testing Tips

**Test Data:**

```json
{
  "customerName": "John Smith",
  "customerEmail": "your-test-email@gmail.com",
  "orderId": "QUOTE-TEST-001",
  "quantity": 50,
  "garmentStyle": "Gildan G640 Softstyle T-Shirt - Black",
  "printColors": 3,
  "totalPrice": 625.5,
  "pricePerPiece": 12.51,
  "locations": "Front and Back",
  "notes": "Rush order needed by Friday"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Quote email sent successfully",
  "messageId": "...",
  "recipient": "your-test-email@gmail.com",
  "orderId": "QUOTE-TEST-001"
}
```

---

## 🆘 Troubleshooting

**Authentication failed:**

- Make sure you're using app-specific password (not regular password)
- Verify ZOHO_SMTP_USER is full email: info@tagteamprints.com
- Check 2FA is enabled in Zoho (required for app passwords)

**Email not received:**

- Check spam/junk folder
- Verify customerEmail is valid
- Check Netlify function logs for errors

**SMTP connection error:**

- Verify port 465 (not 587)
- Check environment variables are set correctly
- Ensure "Functions" scope is enabled

---

## 📊 Total Time Estimate

- **Setup:** 30 minutes
- **Testing:** 15 minutes
- **Total:** 45 minutes

## 💰 Cost

**FREE** - Using existing Zoho Mail account

---

## 📖 Full Documentation

See **EMAIL_SETUP_ZOHO.md** for complete details, examples, and integration guides.

---

**Ready to start?** Begin with Phase 1: Get your Zoho app password!
