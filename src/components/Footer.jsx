import React from 'react';
import { Link } from 'gatsby';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3>Tag Team Printing</h3>
          <p>Custom screen printing and apparel services for your business, event, or organization.</p>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/customer-dashboard">Customer Portal</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/policies">Policies</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/order">Custom Printing</Link></li>
            <li><Link to="/categories">Browse Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/pressmedia">Press & Media</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Get In Touch</h4>
          <div className="contact-info">
            <p><a href="mailto:info@tagteamprints.com">info@tagteamprints.com</a></p>
            <p><a href="tel:+16133634997">(613) 363-4997</a></p>
            <p>1014 First St East<br />Cornwall, ON K6H 1N4</p>
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Tag Team Printing. All rights reserved.</p>
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