import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <img src="/onemindlogo.png" alt="OneMind" className="header-logo-img" />
          <span className="header-logo-text">ONE MIND MARKET</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "header-nav--open" : ""}`}>
          <Link to="/" className="header-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="header-nav-link" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/gallery" className="header-nav-link" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/articles" className="header-nav-link" onClick={() => setMenuOpen(false)}>Articles</Link>
        </nav>

        <div className="header-actions">
          <Link to="/join" className="header-join-btn">Join as Member</Link>
          <button
            className="header-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
