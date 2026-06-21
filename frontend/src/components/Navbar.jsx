import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import "./Navbar.css";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const navLinks = user
    ? [
        { to: "/interview", label: "Dashboard" },
        { to: "/profile", label: "Profile" },
      ]
    : [];

  useEffect(() => {
    setMobileNavOpen(false);
    setShowMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setShowMenu(false);
    setMobileNavOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={user ? "/interview" : "/"} className="navbar-brand">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-name">CrackTogether</span>
          </Link>

          <div className="navbar-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-right">
            {user ? (
              <div className="profile-wrapper" ref={profileRef}>
                <button
                  type="button"
                  className="profile-btn"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-expanded={showMenu}
                  aria-label="Open profile menu"
                >
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <span className="profile-name">{user.fullName?.split(" ")[0]}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="profile-chevron">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {showMenu && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <img
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                        alt=""
                        className="dropdown-avatar"
                      />
                      <div>
                        <p className="dropdown-name">{user.fullName}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    {user.points > 0 && (
                      <div className="dropdown-points">
                        <span>⭐ {user.points} points</span>
                      </div>
                    )}
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      View Profile
                    </Link>
                    <Link to="/interview" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      My Interviews
                    </Link>
                    <button type="button" className="dropdown-item danger" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/auth" className="btn-ghost">Sign In</Link>
                <Link to="/auth" className="btn-primary-sm">Get Started</Link>
              </div>
            )}

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileNavOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={closeMobileNav} role="presentation" />
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button type="button" className="mobile-nav-close" onClick={closeMobileNav} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {user && (
              <div className="mobile-nav-user">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                  alt=""
                />
                <div>
                  <p className="mobile-nav-user-name">{user.fullName}</p>
                  <p className="mobile-nav-user-email">{user.email}</p>
                </div>
              </div>
            )}

            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-link ${isActive(link.to) ? "active" : ""}`}
                  onClick={closeMobileNav}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mobile-nav-footer">
              {user ? (
                <button type="button" className="mobile-nav-btn danger" onClick={handleLogout}>
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/auth" className="mobile-nav-btn outline" onClick={closeMobileNav}>
                    Sign In
                  </Link>
                  <Link to="/auth" className="mobile-nav-btn primary" onClick={closeMobileNav}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
