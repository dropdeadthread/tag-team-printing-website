import React from 'react';
import { Link } from 'gatsby';
import '../styles/footer.css';

const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="footer-social-link"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Brand header — centered on top */}
      <div className="footer-brand">
        <h3 className="footer-brand-name">Tag Team Printing</h3>
        <p className="footer-brand-desc">
          Custom screen printing and apparel services for your business, event,
          or organization.
        </p>
      </div>

      <div className="footer-container">
        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li>
              <Link to="/customer-dashboard">Customer Portal</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/policies">Policies</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li>
              <Link to="/order">Custom Printing</Link>
            </li>
            <li>
              <Link to="/categories">Browse Products</Link>
            </li>
            <li>
              <Link to="/brands">Brands</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/pressmedia">Press & Media</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Get In Touch</h4>
          <div className="contact-info">
            <p>
              <a href="mailto:info@tagteamprints.com">info@tagteamprints.com</a>
            </p>
            <p>
              <a href="tel:+16133634997">(613) 363-4997</a>
            </p>
            <p>
              1016 First St E
              <br />
              Cornwall, ON K6H 1N4
            </p>
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-section">
          <h4>Follow Along</h4>
          <div className="footer-social-links">
            <SocialIcon
              href="https://www.youtube.com/@tagteamprinting"
              label="Tag Team Printing on YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube
            </SocialIcon>
            <SocialIcon
              href="https://www.instagram.com/dropdeadthread"
              label="Drop Dead Thread on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              Instagram
            </SocialIcon>
            <SocialIcon
              href="https://www.facebook.com/dropdeadthread"
              label="Drop Dead Thread on Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>
            &copy; {new Date().getFullYear()} Tag Team Printing. All rights
            reserved.
          </p>
          <div className="footer-links">
            <Link to="/customer-dashboard">Customer Portal</Link>
            <span>•</span>
            <Link to="/policies">Privacy Policy</Link>
            <span>•</span>
            <Link to="/policies">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
