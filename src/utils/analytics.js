// Google Analytics 4 Event Tracking Utilities
// These functions help track important business events for the control hub

// Check if gtag is available (client-side only)
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track page views (handled automatically by gatsby-plugin-gtag)
export const trackPageView = (url, title) => {
  if (isGtagAvailable()) {
    window.gtag('config', process.env.GATSBY_GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track order-related events
export const trackOrderEvent = (eventName, orderId, value = null, customParams = {}) => {
  if (!isGtagAvailable()) return;

  const baseParams = {
    transaction_id: orderId,
    ...customParams
  };

  if (value) {
    baseParams.value = value;
    baseParams.currency = 'CAD';
  }

  window.gtag('event', eventName, baseParams);
};

// Track order submission
export const trackOrderSubmission = (orderData) => {
  const { orderId, total, items, customerInfo } = orderData;
  
  trackOrderEvent('begin_checkout', orderId, total, {
    items: items.map(item => ({
      item_id: item.styleNumber || item.id,
      item_name: `${item.brand} ${item.styleName}`,
      category: item.category || 'Apparel',
      quantity: item.quantity,
      price: item.unitPrice
    })),
    customer_type: customerInfo.accountType || 'individual'
  });
};

// Track order completion/payment
export const trackOrderCompletion = (orderData) => {
  const { orderId, total, items, paymentMethod } = orderData;
  
  trackOrderEvent('purchase', orderId, total, {
    items: items.map(item => ({
      item_id: item.styleNumber || item.id,
      item_name: `${item.brand} ${item.styleName}`,
      category: item.category || 'Apparel',
      quantity: item.quantity,
      price: item.unitPrice
    })),
    payment_type: paymentMethod || 'online'
  });
};

// Track quote requests
export const trackQuoteRequest = (quoteData) => {
  const { productType, quantity, estimatedValue } = quoteData;
  
  trackOrderEvent('generate_lead', `quote_${Date.now()}`, estimatedValue, {
    lead_type: 'quote_request',
    product_type: productType,
    quantity: quantity,
    content_category: 'custom_printing'
  });
};

// Track customer interactions
export const trackCustomerInteraction = (interactionType, details = {}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'engagement', {
    engagement_type: interactionType,
    ...details
  });
};

// Track contact form submissions
export const trackContactForm = (formType, source = 'contact_page') => {
  trackCustomerInteraction('contact_form_submit', {
    form_type: formType,
    source: source
  });
};

// Track product views and searches
export const trackProductView = (product) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'view_item', {
    currency: 'CAD',
    value: product.price || 0,
    items: [{
      item_id: product.styleNumber || product.id,
      item_name: `${product.brand} ${product.styleName}`,
      category: product.category || 'Apparel',
      price: product.price || 0
    }]
  });
};

export const trackProductSearch = (searchTerm, resultsCount = 0) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

// Track user authentication events
export const trackUserAuth = (action, userType = null) => {
  trackCustomerInteraction('user_auth', {
    auth_action: action, // 'login', 'register', 'logout'
    user_type: userType
  });
};

// Track file downloads (press kit, catalogs, etc.)
export const trackFileDownload = (fileName, fileType, source = 'website') => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'file_download', {
    file_name: fileName,
    file_extension: fileType,
    source: source
  });
};

// Track custom business events
export const trackBusinessEvent = (eventName, eventData = {}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', eventName, {
    event_category: 'business',
    ...eventData
  });
};

// Track conversion goals (for control hub insights)
export const trackConversionGoal = (goalName, goalValue = null) => {
  if (!isGtagAvailable()) return;

  const eventData = {
    event_category: 'conversion',
    event_label: goalName
  };

  if (goalValue) {
    eventData.value = goalValue;
    eventData.currency = 'CAD';
  }

  window.gtag('event', 'conversion', eventData);
};

// Enhanced ecommerce tracking for detailed insights
export const trackAddToCart = (item) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'CAD',
    value: item.price * item.quantity,
    items: [{
      item_id: item.styleNumber || item.id,
      item_name: `${item.brand} ${item.styleName}`,
      category: item.category || 'Apparel',
      quantity: item.quantity,
      price: item.price
    }]
  });
};

export const trackRemoveFromCart = (item) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'remove_from_cart', {
    currency: 'CAD',
    value: item.price * item.quantity,
    items: [{
      item_id: item.styleNumber || item.id,
      item_name: `${item.brand} ${item.styleName}`,
      category: item.category || 'Apparel',
      quantity: item.quantity,
      price: item.price
    }]
  });
};

// Debug function to test analytics in development
export const debugAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('Analytics Debug Info:');
    console.log('- gtag available:', isGtagAvailable());
    console.log('- GA Tracking ID:', process.env.GATSBY_GA_TRACKING_ID);
    console.log('- Current URL:', window.location.href);
    
    if (isGtagAvailable()) {
      // Test event
      window.gtag('event', 'debug_test', {
        event_category: 'debug',
        event_label: 'analytics_setup_test'
      });
      console.log('- Test event sent');
    }
  }
};