import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { trackContactForm } from '../utils/analytics';

const ContactPage = () => {
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://tagteamprints.com';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Tag Team Printing',
    description: 'Screen printing and custom apparel in Cornwall, Ontario',
    url: siteUrl,
    telephone: '+1-613-363-4997',
    email: 'info@tagteamprints.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1014 First St East',
      addressLocality: 'Cornwall',
      addressRegion: 'ON',
      postalCode: 'K6H 1N4',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '45.0203',
      longitude: '-74.7301',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: '$$',
  };
  const [fields, setFields] = useState({
    name: '',
    email: '',
    projectType: '',
    deadline: '',
    budget: '',
    message: '',
    file: null,
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFields({ ...fields, file: files[0] });
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const res = await fetch('/api/contact-submit', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setStatus('Message sent!');
      // Track successful contact form submission
      trackContactForm(fields.projectType || 'general_inquiry', 'contact_page');
    } else {
      setStatus('Error sending message.');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Tag Team Printing</title>
        <meta
          name="description"
          content="Contact Tag Team Printing for custom screen printing, graphic design, and apparel orders. Located in Cornwall, ON. Call (613) 363-4997 or email info@tagteamprints.com"
        />
        <meta property="og:title" content="Contact Us - Tag Team Printing" />
        <meta
          property="og:description"
          content="Contact Tag Team Printing for custom screen printing and graphic design services in Cornwall, Ontario."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      <h1 style={{ textAlign: 'center', marginTop: '7rem', marginBottom: '0' }}>
        Contact
      </h1>

      {/* Quick Order Tracking Access */}
      <div
        style={{
          maxWidth: 600,
          margin: '2rem auto',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '2px solid #000',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#000' }}>
          Looking for Your Order?
        </h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
          Track your order status or view your order history quickly:
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/order-status"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#c32b14',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              border: '2px solid #000',
              fontWeight: 'bold',
            }}
          >
            📦 Track Order
          </a>
          <a
            href="/my-orders"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '6px',
              border: '2px solid #000',
              fontWeight: 'bold',
            }}
          >
            📋 Order History
          </a>
        </div>
      </div>
      {/* Business Contact Information */}
      <div
        style={{
          maxWidth: 600,
          margin: '2rem auto',
          padding: '2rem',
          background: 'white',
          border: '2px solid #000',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#c32b14' }}>
          Get In Touch
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Email</h4>
            <p style={{ margin: 0 }}>
              <a
                href="mailto:info@tagteamprints.com"
                style={{ color: '#c32b14', textDecoration: 'none' }}
              >
                info@tagteamprints.com
              </a>
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Phone</h4>
            <p style={{ margin: 0 }}>
              <a
                href="tel:+16133634997"
                style={{ color: '#c32b14', textDecoration: 'none' }}
              >
                (613) 363-4997
              </a>
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Address</h4>
            <p style={{ margin: 0, lineHeight: 1.4 }}>
              1014 First St East
              <br />
              Cornwall, ON K6H 1N4
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Hours</h4>
            <p style={{ margin: 0 }}>
              Monday - Friday
              <br />
              9:00 AM - 5:00 PM
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 600,
          margin: '4.5rem auto 0 auto',
          background: 'rgba(255,245,209,0.95)',
          border: '2px solid #2563EB',
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(37,99,235,0.10)',
          padding: '2rem',
        }}
      >
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Please fill out the form below for general inquiries or to request a
          graphic design project. The more details you provide, the better we
          can help!
        </p>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={fields.email}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <select
            name="projectType"
            value={fields.projectType}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8 }}
          >
            <option value="">Select Project Type</option>
            <option value="print">Print Order</option>
            <option value="logo">Logo Design</option>
            <option value="branding">Branding/Identity</option>
            <option value="merch">Merch Design</option>
            <option value="artwork">Artwork/Illustration</option>
            <option value="other">Other</option>
          </select>
          <input
            name="deadline"
            type="date"
            placeholder="Deadline (optional)"
            value={fields.deadline}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <input
            name="budget"
            type="text"
            placeholder="Budget (optional)"
            value={fields.budget}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <textarea
            name="message"
            placeholder="Project Details / Message"
            value={fields.message}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8, minHeight: 80 }}
          />
          <input
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.ai,.eps,.psd,.zip"
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <button type="submit">Send</button>
          <div>{status}</div>
        </form>
      </div>
    </Layout>
  );
};

export default ContactPage;
