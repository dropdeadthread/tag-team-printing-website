# Tag Team Printing Control Hub Monitoring Checklist

## Overview
This document outlines all the pages, inputs, APIs, and data points that your control hub needs to monitor from the Tag Team Printing website for comprehensive business intelligence and operational oversight.

---

## 🔥 **CRITICAL REAL-TIME MONITORING**

### **Order Management System**
**Priority: HIGHEST**

#### Order Entry Points:
- **Streamlined Order Form** (`/order`) 
  - API: `/netlify/functions/streamlined-order.js`
  - Data: Customer info, garment selection, print details, quantities, pricing
  - Triggers: Order submission, payment processing
  
- **Custom Order Form** (Full product system)
  - API: `/api/create-order.js`
  - Data: Complex orders, custom specifications, file uploads
  - Triggers: Quote requests, custom order submissions

#### Order Processing APIs:
- **`/api/get-customer-orders.js`** - Customer order retrieval
- **`/api/get-order.js`** - Individual order details
- **`/api/update-order-status.js`** - Status updates (submitted → in-production → completed)
- **`/api/admin-list-orders.js`** - Admin order overview
- **`/api/admin-update-order.js`** - Admin order modifications

#### Order Data Files:
- **`data/orders.json`** - Main order database
- **`data/streamlined-orders.json`** - Streamlined orders (if separate)

---

## 📊 **CUSTOMER DATA & ANALYTICS**

### **Customer Management**
#### Customer APIs:
- **`/api/register-customer.js`** - New customer registrations
- **`/api/login-customer.js`** - Customer authentication
- **`/api/get-customer.js`** - Customer profile data
- **`/api/update-customer.js`** - Profile updates
- **`/api/admin-list-customers.js`** - Customer overview
- **`/api/admin-delete-customer.js`** - Customer management

#### Customer Data:
- **`data/customers.json`** - Customer database
- **Customer Dashboard** (`/customer-dashboard`) - Customer portal usage
- **Order History Access** - Customer order tracking behavior

### **Contact & Communication**
#### Contact Points:
- **Contact Form** (`/contact`)
  - API: `/api/contact-submit.js`
  - Data: Customer inquiries, project details, files
  - File: `data/contactMessages.json`

- **Newsletter Signup**
  - API: `/api/newsletter-signup.js`
  - File: `data/newsletter.json`

---

## 🛍️ **PRODUCT & INVENTORY TRACKING**

### **Product Management**
#### Product APIs:
- **`/api/get-inventory.js`** - Real-time inventory levels
- **`/api/list-products.js`** - Product catalog
- **`/api/list-categories.js`** - Product categories
- **`/api/list-brands.js`** - Brand listings
- **`/api/admin-add-product.js`** - Product additions
- **`/api/admin-update-product.js`** - Product modifications
- **`/api/admin-delete-product.js`** - Product removal

#### Product Data:
- **`data/products.json`** - Product catalog
- **`data/inventory.json`** - Stock levels
- **`data/all_styles_raw.json`** - Complete style database

### **Shopping & Cart Behavior**
- **`/api/get-cart.js`** - Shopping cart data
- **`data/carts.json`** - Cart abandonment tracking
- **Wishlist System**:
  - `/api/add-wishlist-item.js`
  - `/api/remove-wishlist-item.js`
  - `/api/get-wishlist.js`

---

## 💰 **FINANCIAL & PRICING MONITORING**

### **Revenue Tracking**
- **Order Values** - From order APIs
- **Payment Processing** - Via Square integration
- **Quote System** - Pricing calculations
- **Discount Usage**:
  - `/api/discount-codes.js`
  - `data/discounts.json`

### **Pricing System**
- **Dynamic Pricing Engine** - `src/helpers/calculatePrintQuote.js`
- **Quantity Breaks** - `src/config/pricing.js`
- **Garment Markups** - Cost calculations

---

## 🎨 **CREATIVE & PRODUCTION MONITORING**

### **Artwork & File Management**
- **File Uploads** (`/api/upload-artwork.js`)
- **Google Drive Integration** (`data/driveFiles.json`)
- **Artwork Processing** - File handling system

### **Production Workflow**
- **Print Orders** (`/api/print-order.js`)
- **Admin Print Orders** (`/api/admin-list-print-orders.js`)
- **Order Status Workflow**:
  - Submitted → Quote Sent → Approved → In Production → Completed → Shipped

---

## 📱 **USER EXPERIENCE & ENGAGEMENT**

### **Website Analytics** (Google Analytics 4)
- **Page Views** - All site pages
- **User Journeys** - Customer behavior flow
- **Conversion Tracking** - Order completion rates
- **Product Views** - Popular products/categories
- **Search Behavior** - Product searches
- **Mobile vs Desktop** - Device usage patterns

### **Key Pages to Monitor**:
- **Homepage** (`/`) - Entry point traffic
- **Product Pages** (`/products/*`) - Product engagement
- **Category Pages** (`/categories/*`) - Browsing behavior
- **Order Page** (`/order`) - Conversion funnel
- **Customer Dashboard** (`/customer-dashboard`) - Customer retention
- **Contact Page** (`/contact`) - Lead generation
- **About Page** (`/about`) - Brand engagement
- **Press/Media Page** (`/pressmedia`) - PR impact
- **Policies Page** (`/policies`) - Compliance views

---

## 🔧 **OPERATIONAL & ADMIN MONITORING**

### **Admin Dashboard Functions**
- **Order Management** (`/admin/order-management`)
- **Customer Management** - Admin customer tools
- **Product Management** - Inventory updates
- **Bulk Operations**:
  - `/api/admin-export-customers-csv.js`
  - `/api/admin-export-orders-csv.js`
  - `/api/admin-send-bulk-notification.js`

### **System Health Monitoring**
- **API Response Times** - All endpoint performance
- **File Upload Success Rates** - Artwork processing
- **Email Delivery** - Order confirmations, notifications
- **Database Integrity** - JSON file consistency

---

## 📧 **COMMUNICATION MONITORING**

### **Email Systems**
- **Order Confirmations** - Automated customer emails
- **Status Updates** - Order progress notifications
- **Quote Emails** - Pricing communications
- **Admin Notifications** - Internal alerts

### **Notification Triggers**
- New order submissions
- Payment completions
- Status changes
- Customer inquiries
- System errors

---

## 🔍 **AUDIT & COMPLIANCE TRACKING**

### **Audit Systems**
- **`/api/audit-logs.js`** - System activity logs
- **`data/audit.json`** - Audit trail data
- **User Activity** - Admin and customer actions
- **Data Changes** - Order modifications, updates

### **Compliance Monitoring**
- **GDPR Compliance** - Data handling
- **Privacy Policy** - User acceptance
- **Terms of Service** - Legal compliance
- **Analytics Privacy** - Tracking consent

---

## 📊 **KEY PERFORMANCE INDICATORS (KPIs)**

### **Business Metrics**
1. **Order Conversion Rate** - Visitors to orders
2. **Average Order Value** - Revenue per order
3. **Customer Acquisition Cost** - Marketing efficiency
4. **Customer Lifetime Value** - Long-term value
5. **Order Fulfillment Time** - Production efficiency
6. **Customer Satisfaction** - Support quality
7. **Inventory Turnover** - Stock efficiency
8. **Quote-to-Order Rate** - Sales conversion

### **Operational Metrics**
1. **Website Performance** - Page load times
2. **API Response Times** - System performance
3. **Error Rates** - System reliability
4. **File Upload Success** - Technical reliability
5. **Email Delivery Rate** - Communication success
6. **Mobile Responsiveness** - User experience
7. **Search Functionality** - Product discovery
8. **Cart Abandonment Rate** - Checkout optimization

---

## 🚨 **ALERT TRIGGERS FOR CONTROL HUB**

### **Critical Alerts** (Immediate Response)
- New order submissions
- Payment failures
- System errors (API failures)
- High-value orders (>$500)
- Rush orders (tight deadlines)
- Inventory low stock alerts

### **Important Alerts** (Daily Review)
- Contact form submissions
- Quote requests
- Customer registrations
- Order status changes
- File upload issues

### **Monitoring Alerts** (Weekly Review)
- Traffic anomalies
- Conversion rate changes
- Popular product trends
- Customer feedback patterns
- System performance trends

---

## 🔗 **API ENDPOINTS SUMMARY FOR CONTROL HUB**

### **Real-Time Monitoring APIs**
```
POST /netlify/functions/streamlined-order.js    - New orders
POST /api/create-order.js                      - Custom orders
POST /api/contact-submit.js                    - Contact forms
GET  /api/get-customer-orders.js               - Order retrieval
POST /api/update-order-status.js               - Status updates
GET  /api/admin-list-orders.js                 - Admin overview
POST /api/register-customer.js                 - New customers
POST /api/newsletter-signup.js                 - Newsletter subs
GET  /api/get-inventory.js                     - Stock levels
```

### **Analytics Integration**
- **Google Analytics 4** - Comprehensive user behavior
- **Custom Event Tracking** - Business-specific metrics
- **Conversion Goals** - Business objectives
- **E-commerce Tracking** - Revenue analytics

---

## 📱 **MOBILE & ACCESSIBILITY MONITORING**

### **Mobile Experience**
- Mobile order submissions
- Touch-friendly interfaces
- Mobile payment processing
- Responsive design performance

### **Accessibility Compliance**
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- Alternative text usage

---

**🎯 CONTROL HUB INTEGRATION PRIORITY:**

1. **CRITICAL** - Order processing, payments, inventory
2. **HIGH** - Customer management, contact forms, analytics
3. **MEDIUM** - Product management, admin functions, reporting
4. **LOW** - Compliance logs, system maintenance, optimization

This comprehensive monitoring setup will give your control hub complete visibility into all aspects of the Tag Team Printing operation! 🔥