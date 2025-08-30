import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setActive(false), [location]);

  return (
    <header className="navbar" style={{
      padding: scrolled ? "0.4rem 2rem" : "1rem 2rem",
      backgroundColor: scrolled ? "rgba(0,0,0,0.85)" : "black"
    }}>
      <div className="nav-left">
        <div className="logo">
          <span className="logo-icon">🔍</span>
          <span className="logo-text">InternHunt</span>
        </div>
      </div>

      <div className="nav-center">
        <span className="tagline">🚀 AI-Powered Career Launcher</span>
      </div>

      <nav className={`nav-right ${active ? "active" : ""}`} id="navRight">
        <Link to="/"><i className="fas fa-home"></i> Home</Link>
        <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>
        <Link to="/signup"><i className="fas fa-user-plus"></i> Signup</Link>
        <Link to="/saved-jobs">⭐ Saved Jobs</Link>
      </nav>

      <div className="menu-toggle" id="menuToggle" onClick={() => setActive(!active)}>
        <i className="fas fa-bars"></i>
      </div>
    </header>
  );
}
