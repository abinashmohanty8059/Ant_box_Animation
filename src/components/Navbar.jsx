import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`} id="mobileMenu" aria-hidden={!isOpen}>
        <a href="#journey" id="mm-journey" onClick={closeMenu}>Platform</a>
        <a href="#students" id="mm-students" onClick={closeMenu}>Students</a>
        <a href="#corporates" id="mm-corp" onClick={closeMenu}>Enterprises</a>
        <a href="#why" id="mm-why" onClick={closeMenu}>Why AntBox</a>
        <a href="#cta" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={closeMenu}>Enter Platform →</a>
      </div>

      {/* NAVIGATION */}
      <nav id="navbar" aria-label="Main navigation">
        <div className="container nav-inner">

          {/* Logo */}
          <a href="#" className="nav-logo" aria-label="AntBox home" onClick={closeMenu}>
            <img src="/assets/namedlogo.png" alt="AntBox" />
          </a>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            <li><a href="#journey">Platform</a></li>
            <li><a href="#students">Students</a></li>
            <li><a href="#corporates">Enterprises</a></li>
            <li><a href="#why">Why AntBox</a></li>
          </ul>

          {/* Desktop CTA */}
          <div className="nav-cta">
            <a href="#cta" className="btn btn-outline" id="nav-enter-btn">Enter Platform →</a>
          </div>

          {/* Mobile hamburger */}
          <button 
            className={`nav-hamburger ${isOpen ? 'open' : ''}`} 
            id="hamburger" 
            aria-label="Open navigation" 
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>

        </div>
      </nav>
    </>
  );
}
