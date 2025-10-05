// src/pages/index.jsx
import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/homepage.css';

const IndexPage = () => {
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
          <Link to="/order" className="action-button">Order Prints</Link>
          <Link to="/categories" className="action-button">Shop Blanks</Link>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
