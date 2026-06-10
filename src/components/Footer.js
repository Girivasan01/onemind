import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/onemindlogo.png" alt="OneMind" className="footer-logo-img" />
              <span className="footer-logo-text">ONE MIND MARKET</span>
            </Link>
            <p className="footer-desc">
              One Mind Market is a powerful platform created exclusively for native entrepreneurs. Our mission is to strengthen the local economy by connecting independent business owners who are building and growing their own ventures. Members grow their businesses through trusted referrals, strong professional relationships, and mutual support within the community. The platform also promotes continuous learning where entrepreneurs share knowledge, real experiences, and practical strategies for business growth. Through the One Mind Market Search Engine, people can easily discover verified local businesses and services. This increases visibility for entrepreneurs while encouraging customers to support local brands. Our goal is to empower native entrepreneurs, create more opportunities, and generate employment within the local economy.
            </p>
            <div className="footer-contact">
              <a href="tel:+919677690666" className="footer-contact-link">
                <FaPhone /> +91 96776 90666
              </a>
              <a href="mailto:onemindmarketinfo@gmail.com" className="footer-contact-link">
                <FaEnvelope /> onemindmarketinfo@gmail.com
              </a>
            </div>
            <div className="footer-socials">
              <a href="https://www.instagram.com/onemindmarket/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://x.com/OneMindMarket" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X"><FaXTwitter /></a>
              <a href="https://www.linkedin.com/in/one-mind-market-648538389/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Network */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Network</h4>
            <ul className="footer-link-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/search">Members Directory</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/join">Join Member Program</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-link-list">
              <li><Link to="/about">Contact Support</Link></li>
              <li><Link to="/articles">Articles</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2025 ONE MIND MARKET. ALL RIGHTS RESERVED.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
