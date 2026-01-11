// src/pages/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/homepage.css';

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
      <div className="homepage-wrapper">
        <div className="banner-container">
          <img
            src="/images/hero-tagteam.png"
            alt="Tag Team Printing - Prints That Hit Like a Drop Kick"
            className="banner-image"
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

        {/* Testimonials Section */}
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
      </div>
    </Layout>
  );
};

export default IndexPage;
