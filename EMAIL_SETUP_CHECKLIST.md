# Email Setup Checklist for info@tagteamprints.com

## Quick Setup Checklist

### Phase 1: Email Provider Setup (15-30 minutes)

- [ ] Create SendGrid account at https://sendgrid.com/
- [ ] Verify your email address
- [ ] Add sender: info@tagteamprints.com
- [ ] Start domain authentication for tagteamprints.com
- [ ] Get DNS records from SendGrid
- [ ] Add CNAME records to Netlify DNS
- [ ] Wait for verification (5-15 min)
- [ ] Create SendGrid API key with Mail Send permissions
- [ ] **Save API key immediately** (shown only once!)

### Phase 2: Netlify Configuration (10 minutes)

- [ ] Generate random secret (32+ characters)
- [ ] Add environment variable: `NETLIFY_EMAILS_PROVIDER` = `sendgrid`
- [ ] Add environment variable: `NETLIFY_EMAILS_PROVIDER_API_KEY` = `SG.abc...`
- [ ] Add environment variable: `NETLIFY_EMAILS_SECRET` = `your-secret`
- [ ] Set scope to "Builds and Functions" for all variables

### Phase 3: Code Updates (30 minutes)

- [ ] Update `netlify.toml` to add email plugin
- [ ] Create `emails/` directory in project root
- [ ] Create `emails/quote-generated/index.html` template
- [ ] Create `netlify/functions/sendQuoteEmail.js` function
- [ ] Commit changes to git
- [ ] Push to GitHub

### Phase 4: Testing (15 minutes)

- [ ] Deploy triggers automatically on push
- [ ] Wait for deploy to complete
- [ ] Check deploy log for plugin installation
- [ ] Test with curl command (see guide)
- [ ] Verify email received
- [ ] Check SendGrid activity log

### Phase 5: Integration (varies)

- [ ] Connect to quote generation system
- [ ] Test end-to-end quote email flow
- [ ] Create additional email templates as needed
- [ ] Update Control Hub to trigger emails

---

## Quick Commands

### Generate Secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Email Locally:

```bash
netlify dev
# Visit: http://localhost:8888/.netlify/functions/emails
```

### Test Email Production:

```bash
curl -X POST https://tagteamprints.com/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","customerEmail":"your-email@gmail.com","orderId":"TEST","quantity":25,"garmentStyle":"G640","printColors":2,"totalPrice":375.50,"pricePerPiece":15.02}'
```

---

## Important API Keys Locations

| What             | Where                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| SendGrid API Key | SendGrid Dashboard → Settings → API Keys                              |
| Netlify Env Vars | Netlify Dashboard → Site → Site configuration → Environment variables |
| DNS Records      | Netlify Dashboard → Site → Domain management → DNS                    |

---

## Email Templates Priority Order

1. **Quote Generated** ✅ (template provided)
2. **Order Confirmation** (customer places order)
3. **Payment Received** (payment processed successfully)
4. **Order Ready** (production complete, ready for pickup)
5. **Design Approval** (customer needs to approve artwork)
6. **Shipping Notification** (order shipped with tracking)

---

## Troubleshooting Quick Fixes

**Email not sending:**

- Check: Netlify deploy log
- Check: SendGrid activity feed
- Verify: Environment variables set
- Verify: Domain authenticated

**401 Unauthorized:**

- Verify: NETLIFY_EMAILS_SECRET matches everywhere
- Verify: Variables have "Functions" scope

**Emails in spam:**

- Complete domain authentication
- Use consistent "from" address
- Avoid spam trigger words

---

## Support Resources

- **SendGrid Docs:** https://docs.sendgrid.com/
- **Netlify Email Integration:** https://docs.netlify.com/integrations/email-integration/
- **Full Setup Guide:** ./EMAIL_SETUP_GUIDE.md

---

**Total Estimated Time:** 1-2 hours
**Difficulty:** Moderate
**Cost:** Free (SendGrid free tier)
