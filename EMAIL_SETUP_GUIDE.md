# Tag Team Printing Email Setup Guide

## Configuring info@tagteamprints.com with Netlify Email Integration

**Date:** November 2, 2025
**Email:** info@tagteamprints.com
**Purpose:** Quote notifications, order confirmations, customer communications

---

## Step 1: Choose and Set Up Email Provider

### Recommended: SendGrid (Free tier available, easiest setup)

**Why SendGrid:**

- Free tier: 100 emails/day (sufficient for Tag Team volume)
- Simple API setup
- Good deliverability
- Easy verification

**Alternative Options:**

- **Postmark** - Best deliverability, $10/month for 10K emails
- **Mailgun** - Free tier 5K emails/month, more complex setup

---

## Step 2: Create SendGrid Account

1. Go to [https://sendgrid.com/](https://sendgrid.com/)
2. Sign up for a free account
3. Verify your email address
4. Complete sender verification:
   - **Sender Email:** info@tagteamprints.com
   - **Sender Name:** Tag Team Printing
   - **From Name:** Tag Team Printing

---

## Step 3: Verify Domain (tagteamprints.com)

### In SendGrid:

1. Navigate to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Choose DNS host: **Netlify**
4. Enter domain: `tagteamprints.com`

### SendGrid will provide DNS records like:

```
CNAME em123.tagteamprints.com → u12345.wl.sendgrid.net
CNAME s1._domainkey.tagteamprints.com → s1.domainkey.u12345.wl.sendgrid.net
CNAME s2._domainkey.tagteamprints.com → s2.domainkey.u12345.wl.sendgrid.net
```

### Add DNS records to Netlify:

1. Go to **Netlify Dashboard** → Your site → **Domain management** → **DNS**
2. Add each CNAME record provided by SendGrid
3. Wait for verification (5-15 minutes)
4. Return to SendGrid and click **Verify**

---

## Step 4: Get SendGrid API Key

1. In SendGrid: **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `Netlify Email Integration`
4. Permissions: **Full Access** (or at minimum: Mail Send)
5. Click **Create & View**
6. **COPY THE API KEY IMMEDIATELY** (shown only once!)

Example API key format: `SG.aBc123XyZ...` (69 characters)

---

## Step 5: Generate Netlify Emails Secret

This is a unique secret to authenticate requests to your email handler.

Generate a secure random string (32+ characters):

```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use online generator
# Visit: https://www.random.org/strings/
# Generate 1 string, 32 characters, alphanumeric
```

Example: `a7f3c9e1b2d4f6a8c0e2d4f6a8b0c2e4`

---

## Step 6: Configure Netlify Environment Variables

### In Netlify Dashboard:

1. Go to your Tag Team site
2. Navigate to **Site configuration** → **Environment variables**
3. Add the following variables:

| Variable Name                     | Value             | Notes                 |
| --------------------------------- | ----------------- | --------------------- |
| `NETLIFY_EMAILS_PROVIDER`         | `sendgrid`        | Provider name         |
| `NETLIFY_EMAILS_PROVIDER_API_KEY` | `SG.aBc123...`    | Your SendGrid API key |
| `NETLIFY_EMAILS_SECRET`           | `a7f3c9e1b2d4...` | Your generated secret |

**Important:** Set scope to **Builds and Functions** for all variables.

---

## Step 7: Update netlify.toml

Add the email plugin configuration to your `netlify.toml`:

```toml
[build]
  command = "gatsby build"
  functions = "netlify/functions"
  publish = "public"

  [build.environment]
    NODE_VERSION = "18"
    SECRETS_SCAN_OMIT_PATHS = "*.md,docs/**,README*,**/README*"

# Email Integration Plugin
[[plugins]]
  package = "@netlify/plugin-emails"

[[redirects]]
  from = "/ss-images/*"
  to = "/.netlify/functions/ss-images?path=:splat"
  status = 200

[[redirects]]
  from = "/*"
  query = {imgcdn = "true"}
  to = "/.netlify/images?url=/:splat&fm=webp"
  status = 200
  force = true
```

---

## Step 8: Create Email Templates

### Directory Structure:

```
tag-team-printing-website/
├── emails/
│   ├── quote-generated/
│   │   └── index.html
│   ├── order-confirmed/
│   │   └── index.html
│   ├── order-ready/
│   │   └── index.html
│   └── payment-received/
│       └── index.html
└── netlify.toml
```

### Example Template: Quote Generated

Create `emails/quote-generated/index.html`:

```html
<html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .container {
        background-color: white;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        border-bottom: 3px solid #e31837;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #000;
      }
      .content {
        color: #333;
        line-height: 1.6;
      }
      .quote-details {
        background-color: #f9f9f9;
        padding: 15px;
        border-left: 4px solid #e31837;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        background-color: #e31837;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
      }
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">TAG TEAM PRINTING</div>
      </div>

      <div class="content">
        <h2>Your Quote is Ready!</h2>

        <p>Hi {{customerName}},</p>

        <p>
          Thank you for your interest in Tag Team Printing! We've prepared a
          custom quote for your order.
        </p>

        <div class="quote-details">
          <strong>Quote Details:</strong><br />
          Order ID: {{orderId}}<br />
          Quantity: {{quantity}} pieces<br />
          Style: {{garmentStyle}}<br />
          Colors: {{printColors}} color(s)<br />
          <br />
          <strong>Total: ${{totalPrice}}</strong><br />
          Per Piece: ${{pricePerPiece}}
        </div>

        <p>
          This quote is valid for 30 days. To accept this quote and proceed with
          your order, please reply to this email or call us at (your phone
          number).
        </p>

        <a href="{{quoteUrl}}" class="button">View Full Quote</a>

        <p>Have questions? We're here to help!</p>

        <p>
          Best regards,<br />
          Tag Team Printing Team
        </p>
      </div>

      <div class="footer">
        <p>
          Tag Team Printing<br />
          Email: info@tagteamprints.com<br />
          Website: tagteamprints.com
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## Step 9: Create Email Sender Function

Create `netlify/functions/sendQuoteEmail.js`:

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const {
      customerName,
      customerEmail,
      orderId,
      quantity,
      garmentStyle,
      printColors,
      totalPrice,
      pricePerPiece,
      quoteUrl,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!customerEmail || !customerName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Send email via Netlify Email Integration
    const response = await fetch(
      `${process.env.URL}/.netlify/functions/emails/quote-generated`,
      {
        method: 'POST',
        headers: {
          'netlify-emails-secret': process.env.NETLIFY_EMAILS_SECRET,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'info@tagteamprints.com',
          to: customerEmail,
          subject: `Your Custom Quote from Tag Team Printing - Order ${orderId}`,
          parameters: {
            customerName,
            orderId,
            quantity,
            garmentStyle,
            printColors,
            totalPrice: totalPrice.toFixed(2),
            pricePerPiece: pricePerPiece.toFixed(2),
            quoteUrl: quoteUrl || 'https://tagteamprints.com/quotes',
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Quote email sent successfully',
        emailId: result.id,
      }),
    };
  } catch (error) {
    console.error('Error sending quote email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
```

---

## Step 10: Deploy and Test

### Deploy to Netlify:

```bash
cd "c:/Users/Stacey/Documents/tag team printing website/tag team printing website"

# Commit changes
git add netlify.toml emails/ netlify/functions/sendQuoteEmail.js
git commit -m "Add Netlify email integration for info@tagteamprints.com"
git push

# Netlify will auto-deploy
```

### Test Locally with Netlify CLI:

```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Build the site
netlify build

# Start local development
netlify dev

# Preview emails at:
# http://localhost:8888/.netlify/functions/emails

# Test sending email:
curl -X POST http://localhost:8888/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "your-test-email@gmail.com",
    "orderId": "TEST-001",
    "quantity": 25,
    "garmentStyle": "G640 Softstyle T-Shirt",
    "printColors": 2,
    "totalPrice": 375.50,
    "pricePerPiece": 15.02
  }'
```

### Test in Production:

```bash
curl -X POST https://tagteamprints.com/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "your-email@gmail.com",
    "orderId": "TEST-001",
    "quantity": 25,
    "garmentStyle": "G640",
    "printColors": 2,
    "totalPrice": 375.50,
    "pricePerPiece": 15.02
  }'
```

---

## Step 11: Integrate with Quote Generation

Update your quote generation flow to send emails automatically:

```javascript
// In your quote generation code
async function generateQuote(quoteData) {
  // ... existing quote generation logic ...

  // Send quote email
  try {
    const emailResponse = await fetch('/.netlify/functions/sendQuoteEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: quoteData.customerName,
        customerEmail: quoteData.customerEmail,
        orderId: quoteData.orderId,
        quantity: quoteData.quantity,
        garmentStyle: quoteData.garment.style,
        printColors: quoteData.printing.colors,
        totalPrice: quoteResult.totalPrice,
        pricePerPiece: quoteResult.pricePerPiece,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send quote email');
    }
  } catch (error) {
    console.error('Error sending quote email:', error);
    // Don't fail quote generation if email fails
  }

  return quoteResult;
}
```

---

## Troubleshooting

### Email not sending:

1. Check Netlify deploy log for plugin errors
2. Verify environment variables are set correctly
3. Check SendGrid activity feed for errors
4. Ensure domain is verified in SendGrid

### 401 Unauthorized errors:

- Double-check NETLIFY_EMAILS_SECRET matches in both places
- Ensure environment variables have "Functions" scope

### Emails going to spam:

- Complete SendGrid domain authentication
- Add SPF and DKIM records
- Use consistent "from" address
- Avoid spam trigger words in subject/body

### Rate limits:

- SendGrid free tier: 100 emails/day
- Upgrade if needed for higher volume

---

## Additional Email Templates to Create

1. **Order Confirmation** (`emails/order-confirmed/`)
2. **Order Ready for Pickup** (`emails/order-ready/`)
3. **Payment Received** (`emails/payment-received/`)
4. **Design Approval Request** (`emails/design-approval/`)
5. **Shipping Notification** (`emails/order-shipped/`)

---

## Next Steps

- [ ] Sign up for SendGrid
- [ ] Verify domain
- [ ] Get API key
- [ ] Set environment variables in Netlify
- [ ] Update netlify.toml
- [ ] Create email templates
- [ ] Create sender functions
- [ ] Test locally
- [ ] Deploy to production
- [ ] Send test emails
- [ ] Integrate with quote system

---

**Questions?** Contact Stacey or check [Netlify Email Integration Docs](https://docs.netlify.com/integrations/email-integration/)
