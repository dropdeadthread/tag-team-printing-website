import React from 'react';
import Layout from '../components/Layout';

const PoliciesPage = () => (
  <Layout>
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#c32b14' }}>
        Policies & Terms
      </h1>
      
      {/* Terms of Service */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#000', borderBottom: '2px solid #c32b14', paddingBottom: '0.5rem' }}>
          Terms of Service
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>Order Acceptance</h3>
          <p>All orders are subject to acceptance by Tag Team Printing. We reserve the right to refuse any order that we deem inappropriate, offensive, or outside our capabilities.</p>
          
          <h3>Artwork Requirements</h3>
          <p>Customer-provided artwork must be high resolution (300 DPI minimum) and in vector format when possible. We offer design services for an additional fee if artwork needs modification or creation.</p>
          
          <h3>Proofs and Approval</h3>
          <p>Digital proofs will be provided for approval before production begins. Production will not commence until written approval is received. Changes after approval may incur additional charges.</p>
          
          <h3>Production Time</h3>
          <p>Standard production time is 7-10 business days after artwork approval. Rush orders may be available for an additional fee. Delivery dates are estimates and not guaranteed.</p>
          
          <h3>Payment Terms</h3>
          <p>Payment is required before production begins. We accept major credit cards and electronic payments. For large orders, a 50% deposit may be required with the balance due before shipping.</p>
        </div>
      </section>

      {/* Privacy Policy */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#000', borderBottom: '2px solid #c32b14', paddingBottom: '0.5rem' }}>
          Privacy Policy
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>Information We Collect</h3>
          <p>We collect information you provide when placing orders, including name, email, phone number, shipping address, and payment information. We also collect information about your use of our website through cookies and analytics.</p>
          
          <h3>How We Use Your Information</h3>
          <p>Your information is used to process orders, communicate about your projects, provide customer service, and improve our services. We may send promotional emails with your consent.</p>
          
          <h3>Information Sharing</h3>
          <p>We do not sell, trade, or share your personal information with third parties except as necessary to fulfill orders (shipping carriers, payment processors) or as required by law.</p>
          
          <h3>Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </div>
      </section>

      {/* Refund Policy */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#000', borderBottom: '2px solid #c32b14', paddingBottom: '0.5rem' }}>
          Refund & Return Policy
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>Custom Orders</h3>
          <p>Due to the custom nature of our products, all sales are final once production has begun. Refunds may be considered only in cases of production errors or defects.</p>
          
          <h3>Production Errors</h3>
          <p>If we make an error in production (wrong colors, misprints, etc.), we will reprint the order at no charge or provide a full refund at your discretion.</p>
          
          <h3>Defective Products</h3>
          <p>Products with manufacturing defects will be replaced at no charge. Defects must be reported within 30 days of delivery.</p>
          
          <h3>Customer Error</h3>
          <p>Orders cancelled due to customer error in artwork, sizing, or specifications may be subject to a cancellation fee if production has begun.</p>
          
          <h3>Blank Apparel</h3>
          <p>Unused blank apparel may be returned within 30 days in original condition for store credit minus shipping costs.</p>
        </div>
      </section>

      {/* Shipping Policy */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#000', borderBottom: '2px solid #c32b14', paddingBottom: '0.5rem' }}>
          Shipping Policy
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>Shipping Methods</h3>
          <p>We offer standard shipping (5-7 business days) and expedited shipping options. Local delivery may be available in the Cornwall, ON area.</p>
          
          <h3>Shipping Costs</h3>
          <p>Shipping costs are calculated based on order weight, size, and destination. Free shipping may be offered on orders over a specified amount.</p>
          
          <h3>Processing Time</h3>
          <p>Orders are typically processed and shipped within 1-2 business days after production is complete. You will receive tracking information via email.</p>
          
          <h3>International Shipping</h3>
          <p>International shipping is available to select countries. Additional customs fees and duties may apply and are the responsibility of the customer.</p>
          
          <h3>Delivery Issues</h3>
          <p>We are not responsible for delays caused by shipping carriers, weather, or other factors beyond our control. Insurance and signature confirmation are available upon request.</p>
        </div>
      </section>

      {/* Quality Guarantee */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#000', borderBottom: '2px solid #c32b14', paddingBottom: '0.5rem' }}>
          Quality Guarantee
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <p>We stand behind the quality of our work. If you're not satisfied with the print quality or craftsmanship of your order, please contact us within 7 days of delivery. We will work with you to resolve any issues and ensure your satisfaction.</p>
          
          <h3>Care Instructions</h3>
          <p>Proper care extends the life of printed apparel. We recommend washing in cold water, inside out, and avoiding bleach or fabric softeners. Detailed care instructions are included with each order.</p>
        </div>
      </section>

      {/* Contact Information */}
      <section style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        border: '2px solid #000'
      }}>
        <h2 style={{ color: '#c32b14', marginTop: 0 }}>Questions About Our Policies?</h2>
        <p>If you have any questions about these policies, please don't hesitate to contact us:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><strong>Email:</strong> <a href="mailto:info@tagteamprints.com" style={{ color: '#c32b14' }}>info@tagteamprints.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+16133634997" style={{ color: '#c32b14' }}>(613) 363-4997</a></li>
          <li><strong>Address:</strong> 1014 First St East, Cornwall, ON K6H 1N4</li>
          <li><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</li>
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <em>These policies were last updated on September 29, 2025. We reserve the right to update these policies at any time. Changes will be posted on this page.</em>
        </p>
      </section>
    </div>
  </Layout>
);

export default PoliciesPage;
