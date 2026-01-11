/**
 * Send Quote Email using Zoho Mail SMTP
 * Sends professional quote emails to customers via info@tagteamprints.com
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
        letter-spacing: 2px;
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
      .quote-label {
        color: #666;
      }
      .quote-value {
        font-weight: 600;
        color: #000;
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
      .highlight {
        background-color: #fff3cd;
        padding: 15px;
        border-left: 4px solid #ffc107;
        margin: 15px 0;
      }
      ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      li {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Tag Team Printing</div>
      </div>

      <div class="content">
        <h2 style="color: #e31837; margin-top: 0;">Your Custom Quote is Ready!</h2>

        <p>Hi ${params.customerName},</p>

        <p>Thank you for your interest in Tag Team Printing! We've prepared a custom quote for your screen printing order.</p>

        <div class="quote-details">
          <div class="quote-row">
            <span class="quote-label">Order ID:</span>
            <span class="quote-value">${params.orderId}</span>
          </div>
          <div class="quote-row">
            <span class="quote-label">Garment:</span>
            <span class="quote-value">${params.garmentStyle}</span>
          </div>
          <div class="quote-row">
            <span class="quote-label">Quantity:</span>
            <span class="quote-value">${params.quantity} pieces</span>
          </div>
          <div class="quote-row">
            <span class="quote-label">Print Colors:</span>
            <span class="quote-value">${params.printColors} color(s)</span>
          </div>
          ${
            params.locations
              ? `
          <div class="quote-row">
            <span class="quote-label">Print Locations:</span>
            <span class="quote-value">${params.locations}</span>
          </div>
          `
              : ''
          }
          <div class="quote-row">
            <span class="quote-label">Price per Piece:</span>
            <span class="quote-value">$${params.pricePerPiece}</span>
          </div>
          <div class="quote-row">
            <span class="quote-label">Total Price:</span>
            <span class="quote-value" style="color: #e31837;">$${params.totalPrice}</span>
          </div>
        </div>

        <div class="highlight">
          <strong>📅 This quote is valid for 30 days</strong>
        </div>

        <p><strong>To proceed with your order:</strong></p>
        <ul>
          <li>Reply to this email with your approval</li>
          <li>Visit our website: <a href="https://tagteamprints.com" style="color: #e31837;">tagteamprints.com</a></li>
          <li>Call us for any questions</li>
        </ul>

        ${
          params.notes
            ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #17a2b8;">
          <strong>📝 Additional Notes:</strong><br>
          ${params.notes}
        </div>
        `
            : ''
        }

        <p style="margin-top: 30px;">Have questions about your quote? We're here to help! Just reply to this email or give us a call.</p>

        <p style="margin-top: 20px;">Best regards,<br>
        <strong>The Tag Team Printing Team</strong></p>
      </div>

      <div class="footer">
        <p><strong>Tag Team Printing</strong><br>
        Professional Screen Printing Services<br>
        Email: <a href="mailto:info@tagteamprints.com" style="color: #e31837;">info@tagteamprints.com</a><br>
        Website: <a href="https://tagteamprints.com" style="color: #e31837;">tagteamprints.com</a></p>
        <p style="font-size: 10px; color: #999; margin-top: 15px;">
          You received this email because you requested a quote from Tag Team Printing.<br>
          If you did not request this quote, please disregard this message.
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
        body: JSON.stringify({ error: 'Invalid email address format' }),
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify connection (optional but good for debugging)
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      // Continue anyway - verify can be flaky
    }

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

    // Plain text version (fallback)
    const textContent = `
Hi ${customerName},

Your custom quote from Tag Team Printing is ready!

Order Details:
- Order ID: ${orderId || 'QUOTE-' + Date.now()}
- Garment: ${garmentStyle || 'Custom Garment'}
- Quantity: ${quantity || 'TBD'} pieces
- Print Colors: ${printColors || 1} color(s)
${locations ? `- Print Locations: ${locations}` : ''}
- Price per Piece: $${typeof pricePerPiece === 'number' ? pricePerPiece.toFixed(2) : '0.00'}
- Total Price: $${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}

This quote is valid for 30 days.

To proceed with your order, simply reply to this email or visit tagteamprints.com

${notes ? `Notes: ${notes}` : ''}

Best regards,
Tag Team Printing Team

---
Tag Team Printing
Email: info@tagteamprints.com
Website: tagteamprints.com
    `.trim();

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.ZOHO_FROM_NAME || 'Tag Team Printing'}" <${process.env.ZOHO_FROM_EMAIL}>`,
      to: customerEmail,
      subject: `Your Custom Quote from Tag Team Printing${orderId ? ' - Order ' + orderId : ''}`,
      html: htmlContent,
      text: textContent,
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
        orderId: orderId || 'QUOTE-' + Date.now(),
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
