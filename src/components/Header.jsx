import React, { useState } from 'react';
import { Link } from 'gatsby';
import '../styles/header.css';

const Header = ({ itemCount }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className="site-header">
      <div className="logo">
        <Link to="/" title="Homepage">
          <img
            src="/images/logo.png"
            alt="Tag Team Logo"
            style={{ height: '120px', width: 'auto' }}
          />
        </Link>
      </div>
      <button className="hamburger" onClick={toggleNav}>
        ☰
      </button>
      <nav className={`nav-links ${isNavOpen ? 'show' : ''}`}>
        <Link to="/order">Order Prints</Link>
        <Link to="/categories">Browse Products</Link>
        <Link to="/about">About</Link>
        <Link to="/design-services">Design Services</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      {/* ...other header content, e.g., cart icon... */}
    </header>
  );
};

export default Header;
