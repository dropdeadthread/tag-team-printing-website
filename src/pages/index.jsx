// src/pages/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import '../styles/globals.css';
import '../styles/homepage.css';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'PrintingCompany'],
  name: 'Tag Team Printing',
  description:
    'Custom screen printing and apparel in Cornwall, Ontario. T-shirts, hoodies, hats, and branded merch for bands, businesses, schools, breweries, and events. Minimum 12 pieces. Free quotes.',
  url: 'https://tagteamprints.com',
  telephone: '+1-613-363-4997',
  email: 'info@tagteamprints.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1016 First St E',
    addressLocality: 'Cornwall',
    addressRegion: 'ON',
    postalCode: 'K6H 1N4',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.0253,
    longitude: -74.7209,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Cornwall',
      containedInPlace: { '@type': 'State', name: 'Ontario' },
    },
    { '@type': 'State', name: 'Eastern Ontario' },
    { '@type': 'Country', name: 'Canada' },
  ],
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: 'Credit Card, E-Transfer, Cash',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  sameAs: [
    'https://www.youtube.com/@tagteamprinting',
    'https://www.instagram.com/dropdeadthread',
    'https://www.facebook.com/dropdeadthread',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Screen Printing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom T-Shirt Screen Printing',
          areaServed: 'Cornwall, Ontario',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Band and Event Merch Printing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'DTF Printing' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Bulk Apparel Printing' },
      },
    ],
  },
};

const IndexPage = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Load testimonials from reviews.json
    fetch('/data/reviews.json')
      .then((res) => res.json())
      .then((data) => {
        // Filter for general testimonials only
        const generalReviews = data.filter(
          (review) => review.styleID === 'general',
        );
        setTestimonials(generalReviews.slice(0, 3)); // Show max 3
      })
      .catch((err) => console.error('Error loading testimonials:', err));
  }, []);

  return (
    <Layout>
      <SEO
        title="Tag Team Printing — Custom Screen Printing in Cornwall, Ontario"
        description="Custom screen printing in Cornwall, Ontario. T-shirts, hoodies, hats, and branded apparel for bands, businesses, schools, and events. Minimum 12 pieces. Get a free quote today."
        url="/"
        keywords="screen printing Cornwall Ontario, custom t-shirts Cornwall, band merch printing Eastern Ontario, bulk t-shirt printing Canada, DTF printing Cornwall"
        schema={localBusinessSchema}
      />
      <div className="homepage-wrapper">
        <div className="banner-container">
          <img
            src="/images/hero-tagteam.png"
            alt="Tag Team Printing - Prints That Hit Like a Drop Kick"
            className="banner-image"
            loading="eager"
            fetchPriority="high"
            width="1400"
            height="auto"
          />
        </div>
        <div className="home-action-buttons">
          <Link to="/order" className="action-button">
            Get a Quote
          </Link>
          <Link to="/categories" className="action-button">
            Browse Catalog
          </Link>
        </div>

        {/* Value Proposition Section */}
        <div className="homepage-value-section">
          <h2 className="homepage-value-heading">
            Cornwall&apos;s Screen Printing Shop
          </h2>
          <p className="homepage-value-intro">
            Tag Team Printing provides custom screen printing and apparel
            decoration for businesses, bands, schools, sports teams, events, and
            organizations. From your first idea to the finished product, we make
            ordering custom apparel simple—with quality you can count on and a
            standard one-week turnaround.
          </p>
          <div className="homepage-services-grid">
            <div className="homepage-service-card">
              <h3>Screen Printing</h3>
              <p>
                Professional screen printing with durable plastisol inks for
                crisp, long-lasting prints on a wide range of apparel. Ideal for
                orders of 12 pieces or more.
              </p>
            </div>
            <div className="homepage-service-card">
              <h3>DTF Printing</h3>
              <p>
                Perfect for full-colour artwork, detailed designs, and smaller
                runs. No colour limitations, no screen setup, and vibrant,
                durable results.
              </p>
            </div>
            <div className="homepage-service-card">
              <h3>Bulk Apparel</h3>
              <p>
                Choose from a wide selection of quality wholesale apparel from
                trusted brands like Gildan, Next Level, Bella+Canvas, AS Colour,
                and ATC. Competitive pricing makes outfitting your team,
                business, or event affordable.
              </p>
            </div>
            <div className="homepage-service-card">
              <h3>Band &amp; Event Merch</h3>
              <p>
                Custom merchandise for bands, tours, festivals, fundraisers,
                community events, and more. Fast turnaround and dependable
                service when deadlines matter.
              </p>
            </div>
          </div>
          <div className="homepage-local-callout">
            <p>
              Based in Cornwall, Ontario, we proudly serve local businesses,
              organizations, bands, and customers across Canada.
            </p>
            <p>
              <strong>Minimum order: 12 pieces.</strong> Standard turnaround: 1
              week. Rush orders available—<a href="/contact">contact us</a> to
              discuss your timeline.
            </p>
          </div>
        </div>

        {/* Testimonials Section — commented out until real quotes are provided
        {testimonials.length > 0 && (
          <div className="testimonials-section">
            <h2 className="testimonials-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                  <p className="testimonial-comment">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <p className="testimonial-author">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        */}
      </div>
    </Layout>
  );
};

export default IndexPage;
