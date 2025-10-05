# Google Analytics 4 Setup Guide for Tag Team Printing

## Overview
This document outlines the Google Analytics 4 (GA4) setup for comprehensive tracking of customer behavior, conversions, and business metrics for the Tag Team Printing website.

## Quick Setup Steps

### 1. Create Google Analytics Account
1. Go to https://analytics.google.com/
2. Sign in with your Google Account
3. Click "Start measuring"
4. Create a new account for "Tag Team Printing"

### 2. Set Up GA4 Property
1. Choose "Web" as the platform
2. Enter website name: "Tag Team Printing"
3. Enter website URL: "https://tagteamprints.com" (or your domain)
4. Select your industry category: "Arts & Entertainment" or "Retail & Consumer Services"
5. Select your business size
6. Choose how you intend to use Analytics

### 3. Get Your Tracking ID
1. After creating the property, you'll see a tracking ID like "G-XXXXXXXXXX"
2. Copy this tracking ID

### 4. Update Environment Variables
Replace "G-XXXXXXXXXX" with your actual tracking ID in these files:
- `.env.development`
- `.env.production`
- `.env.example`

```bash
GATSBY_GA_TRACKING_ID=G-YOUR-ACTUAL-TRACKING-ID
```

### 5. Test the Setup
1. Run `npm run develop`
2. Open browser developer tools (F12)
3. Go to Console tab
4. Navigate to your site
5. Look for Google Analytics network requests in the Network tab

## Events Being Tracked

### E-commerce Events
- **Order Submission**: When customers submit orders through the streamlined form
- **Quote Requests**: When users request custom quotes
- **Product Views**: When customers view individual product pages
- **Add to Cart**: When items are added to shopping cart
- **Remove from Cart**: When items are removed from shopping cart
- **Purchase**: When orders are completed/paid

### Customer Interaction Events
- **Contact Form Submissions**: All contact form completions
- **File Downloads**: Press kit and catalog downloads
- **User Authentication**: Login, register, logout events
- **Customer Portal Access**: When users access their dashboard

### Business Intelligence Events
- **Conversion Goals**: Key business milestones
- **Custom Business Events**: Specific Tag Team Printing metrics
- **Search Events**: Product and catalog searches

## Key Metrics for Control Hub

### Revenue Tracking
- Total order value
- Average order value
- Revenue by product category
- Revenue by customer type (business vs individual)

### Customer Behavior
- Page views and session duration
- Bounce rate and engagement rate
- Conversion funnel analysis
- Customer journey mapping

### Product Performance
- Most viewed products
- Product page engagement
- Quote-to-order conversion rates
- Popular garment styles and colors

### Marketing Effectiveness
- Traffic sources (organic, direct, referral, social)
- Campaign performance tracking
- Customer acquisition cost
- Return on marketing investment

## Custom Dimensions and Metrics

### Customer Segmentation
- Account Type (individual vs business)
- Order Size (small, medium, large)
- Customer Lifetime Value
- Geographic Location

### Product Analytics
- Product Category Performance
- Brand Performance (Gildan, M&O, etc.)
- Color Popularity
- Size Distribution

### Operational Metrics
- Quote Response Time
- Order Processing Time
- Customer Support Interactions
- Email Campaign Effectiveness

## Enhanced E-commerce Setup

### 1. Enhanced E-commerce Events
All purchase events include detailed item information:
- Product ID (style number)
- Product Name (brand + style name)
- Category
- Quantity
- Price
- Custom attributes (color, size, print details)

### 2. Conversion Goals
Set up the following goals in GA4:
- Order Submission (primary conversion)
- Quote Request (lead generation)
- Contact Form Completion (engagement)
- Customer Account Creation (user acquisition)
- File Download (content engagement)

## Privacy and Compliance

### GDPR/Privacy Compliance
- `anonymize: true` - IP addresses are anonymized
- `respectDNT: true` - Respects Do Not Track browser settings
- Cookie domain set to "tagteamprints.com"
- Sample rate configured to balance data collection with performance

### Data Collection
- Customer contact information is NOT sent to Google Analytics
- Only aggregated, anonymized behavior data is tracked
- File upload information is NOT tracked (privacy protection)

## Debugging and Testing

### Development Mode
Use the `debugAnalytics()` function in the browser console to test tracking:

```javascript
// In browser console:
import('./src/utils/analytics.js').then(module => {
  module.debugAnalytics();
});
```

### Real-time Reports
1. Go to Google Analytics
2. Navigate to "Reports" > "Realtime"
3. Browse your site to see events appear in real-time

### Event Verification
1. Use Google Analytics DebugView
2. Install Google Analytics Debugger Chrome extension
3. Check browser Network tab for gtag requests

## Advanced Features

### Custom Reports
Create custom reports for:
- Monthly revenue by product category
- Customer acquisition cost analysis
- Product performance dashboards
- Seasonal trend analysis

### Automated Insights
Enable Google Analytics Intelligence to get:
- Automatic anomaly detection
- Trend identification
- Performance insights
- Optimization suggestions

### Integration with Other Tools
- Google Ads conversion tracking
- Google Tag Manager (optional advanced setup)
- Search Console integration
- Google Sheets reporting automation

## Maintenance

### Regular Reviews
- Check tracking implementation monthly
- Review conversion goals quarterly
- Update custom dimensions as business evolves
- Monitor data quality and accuracy

### Troubleshooting
- Verify environment variables are set correctly
- Check console for JavaScript errors
- Ensure gatsby-plugin-gtag is properly installed
- Validate tracking ID format (starts with "G-")

## Support Resources
- Google Analytics Help Center: https://support.google.com/analytics/
- GA4 Migration Guide: https://developers.google.com/analytics/devguides/migration/ua/
- Gatsby Analytics Documentation: https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-analytics/

---

**Next Steps After Setup:**
1. Replace placeholder tracking ID with your actual GA4 tracking ID
2. Test all tracking events in development
3. Deploy to production
4. Set up custom reports and dashboards
5. Configure automated alerts for key metrics