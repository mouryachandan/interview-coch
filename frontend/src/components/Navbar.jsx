import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

// Reliable AI Robot Logo URL
const aiLogoUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712011.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={aiLogoUrl} alt="AI Logo" className="ai-logo" />
        <Link to="/dashboard" className="logo">
          CrackTogether
        </Link>
      </div>
      <div className="navbar-right">
        <div className="contribution">
          <span className="coin-icon">💰</span>
          <Link to="/profile" className="contribution-text">
            Your Contribution
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
