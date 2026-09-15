# Tag Team Printing Email Setup with Zoho Mail

## Using Zoho Mail for info@tagteamprints.com (Alternative to Netlify Email Integration)

**Date:** November 2, 2025
**Email:** info@tagteamprints.com
**Method:** Direct Zoho Mail API/SMTP (no Netlify plugin needed)

---

## Why This Approach?

- ✅ You already have Zoho Mail
- ✅ More control over email sending
- ✅ No plugin dependencies
- ✅ Same setup as Control Hub backend
- ✅ Can reuse existing Zoho credentials if domain is configured

---

## Prerequisites

You need either:

- **Option A:** Zoho Mail account with info@tagteamprints.com already set up
- **Option B:** Zoho Mail Professional (if you want a new domain email)

---

## Step 1: Set Up Zoho Mail for tagteamprints.com

### If you DON'T have Zoho Mail for this domain yet:

1. Go to [Zoho Mail](https://www.zoho.com/mail/)
2. Sign up or login to your existing Zoho account
3. Add domain: `tagteamprints.com`
4. Create email: `info@tagteamprints.com`
5. Verify domain (add MX, TXT, SPF, DKIM records to Netlify DNS)

### If you ALREADY have it configured:

- Skip to Step 2!

---

## Step 2: Get Zoho Mail SMTP Credentials

### Method 1: App-Specific Password (Recommended - More Secure)

1. Login to Zoho Mail: https://mail.zoho.com
2. Go to **Settings** → **Security** → **App Passwords**
3. Generate new app password for "Tag Team Website"
4. **Copy the password immediately** (shown only once!)

**SMTP Settings:**

- **Host:** `smtp.zoho.com`
- **Port:** `465` (SSL) or `587` (TLS)
- **Username:** `info@tagteamprints.com`
- **Password:** (app-specific password you just generated)

### Method 2: Regular Password (Less secure)

- Use your regular Zoho Mail password
- Not recommended for production

---

## Step 3: Set Netlify Environment Variables

In Netlify Dashboard → Site Configuration → Environment Variables:

| Variable Name     | Value                    | Notes                     |
| ----------------- | ------------------------ | ------------------------- |
| `ZOHO_SMTP_HOST`  | `smtp.zoho.com`          | Zoho's SMTP server        |
| `ZOHO_SMTP_PORT`  | `465`                    | SSL port (or 587 for TLS) |
| `ZOHO_SMTP_USER`  | `info@tagteamprints.com` | Your Zoho email           |
| `ZOHO_SMTP_PASS`  | (app password)           | From Step 2               |
| `ZOHO_FROM_EMAIL` | `info@tagteamprints.com` | Sender email              |
| `ZOHO_FROM_NAME`  | `Tag Team Printing`      | Sender name               |

**Scope:** Set to "Functions" (builds not needed for SMTP)

---

## Step 4: Install Nodemailer in Netlify Functions

```bash
cd "c:/Users/Stacey/Documents/tag team printing website/tag team printing website/netlify/functions"

# Install nodemailer
npm install nodemailer
```

This will update the `package.json` in your functions directory.

---

## Step 5: Create Email Sender Function

Create `netlify/functions/sendQuoteEmail.js`:

```javascript
/**
 * Send Quote Email using Zoho Mail SMTP
 * Sends professional quote emails to customers
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASS,
    },
  });
};

// HTML email template
const generateQuoteEmailHTML = (params) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
        text-transform: uppercase;
      }
      .content {
        color: #333;
        line-height: 1.6;
      }
      .quote-details {
        background-color: #f9f9f9;
        padding: 20px;
        border-left: 4px solid #e31837;
        margin: 20px 0;
      }
      .quote-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .quote-row:last-child {
        border-bottom: none;
        font-weight: bold;
        font-size: 18px;
        margin-top: 10px;
        padding-top: 15px;
        border-top: 2px solid #e31837;
      }
      .button {
        display: inline-block;
        background-color: #e31837;
        color: white !important;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
        text-align: center;
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
        <div class="logo">Tag Team Printing</div>
      </div>

      <div class="content">
        <h2 style="color: #e31837;">Your Custom Quote is Ready!</h2>

        <p>Hi ${params.customerName},</p>

        <p>Thank you for your interest in Tag Team Printing! We've prepared a custom quote for your order.</p>

        <div class="quote-details">
          <div class="quote-row">
            <span>Order ID:</span>
            <strong>${params.orderId}</strong>
          </div>
          <div class="quote-row">
            <span>Garment:</span>
            <strong>${params.garmentStyle}</strong>
          </div>
          <div class="quote-row">
            <span>Quantity:</span>
            <strong>${params.quantity} pieces</strong>
          </div>
          <div class="quote-row">
            <span>Print Colors:</span>
            <strong>${params.printColors} color(s)</strong>
          </div>
          ${
            params.locations
              ? `
          <div class="quote-row">
            <span>Print Locations:</span>
            <strong>${params.locations}</strong>
          </div>
          `
              : ''
          }
          <div class="quote-row">
            <span>Price per Piece:</span>
            <strong>$${params.pricePerPiece}</strong>
          </div>
          <div class="quote-row">
            <span>Total Price:</span>
            <strong>$${params.totalPrice}</strong>
          </div>
        </div>

        <p><strong>This quote is valid for 30 days.</strong></p>

        <p>To accept this quote and proceed with your order:</p>
        <ul>
          <li>Reply to this email</li>
          <li>Call us at your phone number</li>
          <li>Visit our website: tagteamprints.com</li>
        </ul>

        ${
          params.notes
            ? `
        <p><strong>Additional Notes:</strong><br>${params.notes}</p>
        `
            : ''
        }

        <p style="margin-top: 30px;">Have questions about your quote? We're here to help!</p>

        <p>Best regards,<br>
        <strong>The Tag Team Printing Team</strong></p>
      </div>

      <div class="footer">
        <p><strong>Tag Team Printing</strong><br>
        Email: info@tagteamprints.com<br>
        Website: <a href="https://tagteamprints.com" style="color: #e31837;">tagteamprints.com</a></p>
        <p style="font-size: 10px; color: #999; margin-top: 15px;">
          You received this email because you requested a quote from Tag Team Printing.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const {
      customerName,
      customerEmail,
      orderId,
      quantity,
      garmentStyle,
      printColors,
      totalPrice,
      pricePerPiece,
      locations,
      notes,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!customerEmail || !customerName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            'Missing required fields: customerName and customerEmail are required',
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();

    // Generate HTML email
    const htmlContent = generateQuoteEmailHTML({
      customerName,
      orderId: orderId || 'QUOTE-' + Date.now(),
      quantity: quantity || 'TBD',
      garmentStyle: garmentStyle || 'Custom Garment',
      printColors: printColors || 1,
      totalPrice:
        typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00',
      pricePerPiece:
        typeof pricePerPiece === 'number' ? pricePerPiece.toFixed(2) : '0.00',
      locations: locations || 'Front',
      notes: notes || '',
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.ZOHO_FROM_NAME || 'Tag Team Printing'}" <${process.env.ZOHO_FROM_EMAIL}>`,
      to: customerEmail,
      subject: `Your Custom Quote from Tag Team Printing${orderId ? ' - Order ' + orderId : ''}`,
      html: htmlContent,
      text: `Hi ${customerName},\n\nYour quote from Tag Team Printing is ready!\n\nOrder: ${orderId}\nQuantity: ${quantity} pieces\nStyle: ${garmentStyle}\nTotal: $${totalPrice}\nPer Piece: $${pricePerPiece}\n\nThis quote is valid for 30 days. Reply to this email to proceed.\n\nBest regards,\nTag Team Printing Team`,
    });

    console.log('Email sent successfully:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Quote email sent successfully',
        messageId: info.messageId,
        recipient: customerEmail,
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
  }
};
```

---

## Step 6: Test the Email Function

### Test Locally with Netlify CLI:

```bash
cd "c:/Users/Stacey/Documents/tag team printing website/tag team printing website"

# Install Netlify CLI if needed
npm install -g netlify-cli

# Start local dev server
netlify dev

# In another terminal, test the function:
curl -X POST http://localhost:8888/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test Customer\",
    \"customerEmail\": \"your-email@gmail.com\",
    \"orderId\": \"QUOTE-TEST-001\",
    \"quantity\": 25,
    \"garmentStyle\": \"G640 Softstyle T-Shirt - Black\",
    \"printColors\": 2,
    \"totalPrice\": 375.50,
    \"pricePerPiece\": 15.02,
    \"locations\": \"Front and Back\",
    \"notes\": \"Rush order - need by Friday\"
  }"
```

### Test in Production (after deploy):

```bash
curl -X POST https://tagteamprints.com/.netlify/functions/sendQuoteEmail \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test Customer\",
    \"customerEmail\": \"your-email@gmail.com\",
    \"orderId\": \"QUOTE-001\",
    \"quantity\": 25,
    \"garmentStyle\": \"G640\",
    \"printColors\": 2,
    \"totalPrice\": 375.50,
    \"pricePerPiece\": 15.02
  }"
```

---

## Step 7: Integrate with Quote Generation

### From Gatsby Site (Client-side):

```javascript
// In your quote form submission handler
async function handleQuoteSubmit(quoteData) {
  try {
    // Send email
    const response = await fetch('/.netlify/functions/sendQuoteEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: quoteData.name,
        customerEmail: quoteData.email,
        orderId: quoteData.orderId,
        quantity: quoteData.quantity,
        garmentStyle: quoteData.garment.style,
        printColors: quoteData.printing.colors,
        totalPrice: quoteData.quote.total,
        pricePerPiece: quoteData.quote.perPiece,
        locations: quoteData.printing.locations.join(', '),
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Quote email sent!', result.messageId);
      // Show success message to user
    } else {
      console.error('Failed to send quote email:', result.error);
      // Show error message
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### From Control Hub Backend:

```javascript
// In Control Hub - call Tag Team Netlify function
async function sendTagTeamQuote(quoteData) {
  try {
    const response = await fetch(
      'https://tagteamprints.com/.netlify/functions/sendQuoteEmail',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quoteData.customer.name,
          customerEmail: quoteData.customer.email,
          orderId: quoteData.orderId,
          quantity: quoteData.printing.quantity,
          garmentStyle: quoteData.garment.style,
          printColors: quoteData.printing.colors,
          totalPrice: quoteData.quote.totalWithTax,
          pricePerPiece: quoteData.quote.pricePerShirt,
        }),
      },
    );

    return await response.json();
  } catch (error) {
    console.error('Failed to send Tag Team quote email:', error);
    throw error;
  }
}
```

---

## Step 8: Deploy

```bash
cd "c:/Users/Stacey/Documents/tag team printing website/tag team printing website"

# Add and commit
git add netlify/functions/sendQuoteEmail.js netlify/functions/package.json
git commit -m "Add Zoho email integration for quote notifications"
git push

# Netlify auto-deploys
```

---

## Advantages of This Approach vs. Netlify Plugin

✅ **Works with Zoho** (plugin doesn't support it)
✅ **More control** over email content and styling
✅ **Reuse existing Zoho account**
✅ **No template directory needed** (HTML in function)
✅ **Easier to customize** per email type
✅ **Better error handling**
✅ **Can add attachments** (PDFs, images)

---

## Additional Email Types

Create more functions for different email types:

- `sendOrderConfirmation.js` - Order placed confirmation
- `sendPaymentReceived.js` - Payment confirmation
- `sendOrderReady.js` - Ready for pickup/shipping
- `sendDesignApproval.js` - Design proof approval request

Each function follows the same pattern!

---

## Troubleshooting

### Email not sending:

1. Check environment variables are set
2. Verify Zoho SMTP credentials
3. Check Netlify function logs
4. Test SMTP connection manually

### Authentication failed:

- Use app-specific password, not regular password
- Ensure 2FA is enabled in Zoho (required for app passwords)
- Check username is full email address

### Emails in spam:

- Verify SPF and DKIM records in Netlify DNS
- Use consistent "from" address
- Avoid spam trigger words
- Ensure domain is verified in Zoho

### Rate limits:

- Zoho Mail free tier: Check your plan limits
- Zoho Mail Professional: Higher limits

---

## Summary

This approach:

- ✅ Uses your existing Zoho Mail
- ✅ No Netlify plugin needed
- ✅ Full control over emails
- ✅ Works perfectly with info@tagteamprints.com
- ✅ Easy to test and debug
- ✅ Can customize per email type

**Total Setup Time:** 30-45 minutes
**Cost:** Free (using existing Zoho)

---

**Next:** Set environment variables, install nodemailer, deploy, and test!
