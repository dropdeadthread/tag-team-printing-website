# Control Hub Integration - Environment & Email Migration Guide

## 🎯 **Overview**

This document outlines the optimized environment configuration for Tag Team Printing's Control Hub integration, removing redundant email configurations since all communications will route through your centralized backend.

---

## ✅ **Environment Files - CLEANED & OPTIMIZED**

### **Key Changes Made:**

**❌ REMOVED (No longer needed):**
- Direct SMTP/Email configurations (nodemailer bypassed)
- Redundant backend config variables
- Mixed development/production inconsistencies

**✅ OPTIMIZED & KEPT:**
- Google Analytics: `G-220DWNXBFQ` 
- Square Payment Integration
- Control Hub API configuration
- File upload limits
- Deployment settings

---

## 🔄 **Control Hub Integration Setup**

### **1. Current Environment Variables:**

```bash
# CORE INTEGRATIONS
GATSBY_GA_TRACKING_ID=G-220DWNXBFQ              # ✅ Active
GATSBY_SQUARE_APP_ID=sq0idp-5lvym4cTdjzdki3BV6B2MA    # ✅ Active
SQUARE_ACCESS_TOKEN=EAAAl3V5nKRHwUZ_GdQbnkgf903DnMrSppPtKoJBPQDamIwLUoR9aVg9g6GthhtJ  # ✅ Active

# CONTROL HUB CONFIGURATION
CONTROL_HUB_URL=http://localhost:4000            # 🔄 Update for production
CONTROL_HUB_API_KEY=dev-secret-key-tagteam-2025  # 🔄 Update for production
CONTROL_HUB_WEBHOOK_SECRET=webhook-dev-secret    # 🔄 Update for production
```

### **2. Production Updates Needed:**

```bash
# TODO: Update these for production deployment
CONTROL_HUB_URL=https://your-control-hub-domain.com
CONTROL_HUB_API_KEY=prod-secret-key-tagteam-change-this-2025
CONTROL_HUB_WEBHOOK_SECRET=webhook-prod-secret-change-this
SITE_URL=https://tagteamprints.com
```

---

## 📧 **Email System Migration**

### **Current State:**
- ❌ **Direct Email**: APIs still use nodemailer (will be bypassed)
- ✅ **Control Hub Route**: New utility functions created

### **Files That Need Control Hub Integration:**

**1. Order Processing:**
```javascript
// BEFORE: Direct email in create-order.js
await sendOrderEmails(order);

// AFTER: Control Hub routing
await sendOrderToControlHub(orderData);
```

**2. Contact Forms:**
```javascript  
// BEFORE: Direct email in contact-submit.js
await sendContactEmail(contactData);

// AFTER: Control Hub routing
await sendContactToControlHub(contactData);
```

**3. Order Status Updates:**
```javascript
// BEFORE: Direct email in update-order-status.js  
await sendStatusEmail(order, status);

// AFTER: Control Hub routing
await sendOrderStatusToControlHub(orderId, statusData);
```

---

## 🔧 **API Endpoints to Update**

### **High Priority - Email Bypass:**

1. **`src/api/create-order.js`**
   - Replace: `nodemailer.createTransporter()`
   - With: `sendOrderToControlHub()`

2. **`src/api/contact-submit.js`**
   - Replace: Direct email sending
   - With: `sendContactToControlHub()`

3. **`src/api/update-order-status.js`**
   - Replace: `transporter.sendMail()`
   - With: `sendOrderStatusToControlHub()`

4. **`netlify/functions/streamlined-order.js`**
   - Add: Control Hub integration
   - Keep: Local JSON backup

### **Medium Priority - Enhanced Integration:**

5. **`src/api/register-customer.js`**
   - Add: `sendCustomerToControlHub()`

6. **Analytics Integration**
   - Add: `sendAnalyticsToControlHub()` for additional BI

---

## 🛡️ **Backup & Reliability**

### **Dual System Approach:**
- **Primary**: All data sent to Control Hub
- **Backup**: Local JSON files maintained as failsafe
- **Recovery**: Control Hub can sync missed data from JSON backups

### **Error Handling:**
```javascript
try {
  await sendToControlHub('/api/orders', orderData);
} catch (error) {
  // Automatic fallback to local JSON backup
  await saveToLocalBackup('orders', orderData);
  // Continue processing - no user-facing errors
}
```

---

## 📊 **Control Hub Expected Data Formats**

### **Order Data:**
```json
{
  "type": "new_order",
  "timestamp": "2025-10-03T18:30:00.000Z",
  "source": "website",
  "order": {
    "id": "SO-1725386400000-abc123def",
    "customer": { "name": "...", "email": "..." },
    "items": [...],
    "total": 150.00
  },
  "priority": "normal",
  "notifications": {
    "email": true,
    "sms": false,
    "slack": true
  }
}
```

### **Contact Form Data:**
```json
{
  "type": "contact_form", 
  "timestamp": "2025-10-03T18:30:00.000Z",
  "source": "website",
  "contact": {
    "name": "...",
    "email": "...",
    "projectType": "...",
    "message": "..."
  },
  "priority": "normal",
  "notifications": {
    "email": true,
    "sms": false,
    "slack": true
  }
}
```

---

## 🚀 **Deployment Checklist**

### **Before Production:**
- [ ] Update production Control Hub URL
- [ ] Generate secure API keys
- [ ] Test Control Hub connectivity
- [ ] Verify webhook endpoints
- [ ] Update SITE_URL to production domain

### **After Deployment:**
- [ ] Monitor Control Hub integration logs
- [ ] Verify order processing flow
- [ ] Test contact form submissions
- [ ] Confirm Google Analytics tracking
- [ ] Check backup JSON file creation

---

## 🔍 **Testing & Validation**

### **Development Testing:**
```bash
# Test Control Hub connectivity
curl -H "Authorization: Bearer dev-secret-key-tagteam-2025" http://localhost:4000/health

# Test order submission
# Submit test order through website
# Verify data appears in Control Hub
# Confirm backup JSON created if Control Hub offline
```

### **Production Validation:**
- Monitor real-time Control Hub dashboard
- Verify customer email notifications working
- Check order processing automation
- Confirm analytics data flowing correctly

---

## 📋 **Summary**

**✅ COMPLETED:**
- Environment files cleaned and optimized
- Google Analytics fully configured (`G-220DWNXBFQ`)
- Control Hub utility functions created
- Backup system implemented

**🔄 NEXT STEPS:**
1. Update production environment variables
2. Integrate Control Hub calls in API endpoints
3. Test end-to-end flow
4. Deploy and monitor

**💡 BENEFITS:**
- Centralized communication management
- Enhanced business intelligence
- Reliable backup system
- Simplified maintenance
- Better scalability

Your Tag Team Printing website is now ready for seamless Control Hub integration! 🎯