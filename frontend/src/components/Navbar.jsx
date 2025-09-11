import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Navbar.css";

const aiLogoUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712011.png";

function Navbar() {
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // User details from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { autoClose: 2000, theme: "colored" });
    setShowProfilePanel(false);
    navigate("/dashboard");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={aiLogoUrl} alt="AI Logo" className="ai-logo" />
          <Link className="logo">
            CrackTogether
          </Link>
        </div>

        <div className="navbar-right">
          <div
            className="profile-link"
            onClick={() => {
              if (!user) {
                toast.info("⚠ Please login to view profile!", { autoClose: 3000, theme: "colored" });
                return;
              }
              setShowProfilePanel(!showProfilePanel);
            }}
          >
            <img
              src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              className="profile-icon"
            />
          </div>
        </div>
      </nav>

      {/* Inline Profile Panel */}
      {showProfilePanel && user && (
        <div className="profile-panel">
          <img
            src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile"
            className="profile-pic"
          />
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      <ToastContainer />
    </>
  );
}

export default Navbar;
