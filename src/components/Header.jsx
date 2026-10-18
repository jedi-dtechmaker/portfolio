import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export default function Header({ activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const onProjectsPage = activeSection === 'projects';
  const homeAnchor = (section) => onProjectsPage ? `/#${section}` : `#${section}`;

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href={homeAnchor('hero')} className="brand-link" onClick={handleNavClick} title={PROFILE.name}>
          <img src="/logo.svg" alt={PROFILE.name} className="brand-logo" />
          <span className="brand-cursor"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <a 
                href="/projects"
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
              >
                projects
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('activity')}
                className={`nav-link ${activeSection === 'activity' ? 'active' : ''}`}
              >
                activity
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('gears')}
                className={`nav-link ${activeSection === 'gears' ? 'active' : ''}`}
              >
                gears
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('contact')}
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                contact
              </a>
            </li>
            <li>
              <div className="live-indicator" title="Connected to live GitHub API">
                <span className="live-dot"></span>
                <span>live</span>
              </div>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hamburger-btn"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay / Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-inner">
          <div className="mobile-nav-header">
            <span className="mobile-nav-title">~ /menu</span>
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>live</span>
            </div>
          </div>

          <ul className="mobile-nav-links">
            <li>
              <a 
                href="/projects"
                onClick={handleNavClick}
                className={`mobile-nav-link ${activeSection === 'projects' ? 'active' : ''}`}
              >
                <span className="mobile-nav-prefix">❯</span>
                <span>projects</span>
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('activity')}
                onClick={handleNavClick}
                className={`mobile-nav-link ${activeSection === 'activity' ? 'active' : ''}`}
              >
                <span className="mobile-nav-prefix">❯</span>
                <span>activity</span>
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('gears')}
                onClick={handleNavClick}
                className={`mobile-nav-link ${activeSection === 'gears' ? 'active' : ''}`}
              >
                <span className="mobile-nav-prefix">❯</span>
                <span>gears</span>
              </a>
            </li>
            <li>
              <a 
                href={homeAnchor('contact')}
                onClick={handleNavClick}
                className={`mobile-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                <span className="mobile-nav-prefix">❯</span>
                <span>contact</span>
              </a>
            </li>
          </ul>

          <div className="mobile-nav-footer">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              jedi@portfolio // mobile terminal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
