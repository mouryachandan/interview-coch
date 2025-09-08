import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaYoutube, FaReddit, FaRocket } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/Auth");
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Your AI Interview Coach</h1>
          <p className="hero-subtitle">
            Crack your dream job interviews with AI-powered mock sessions & feedback
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={goToLogin}>
              🚀 Get Started
            </button>
            <button className="btn-secondary">🎥 Watch Demo</button>
          </div>

          <p className="featured-text">FEATURED ON</p>
          <div className="featured-logos">
            <span className="logo-item">
              <FaYoutube className="youtube-icon" /> YouTube
            </span>
            <span className="logo-item">
              <FaRocket className="ph-icon" /> Product Hunt
            </span>
            <span className="logo-item">
              <FaReddit className="reddit-icon" /> Reddit
            </span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works?</h2>
        <p className="section-subtitle">
          Start your mock interview in just 3 simple steps
        </p>

        <div className="steps-container">
          <div className="step-card">
            <span className="step-icon">📝</span>
            <h3 className="step-title">Step 1: Enter Details</h3>
            <p className="step-desc">
              Choose your role & skills, and let our AI generate customized interview questions.
            </p>
          </div>

          <div className="step-card">
            <span className="step-icon">🎤</span>
            <h3 className="step-title">Step 2: Speak Your Answers</h3>
            <p className="step-desc">
              Answer questions naturally with voice input while our AI listens and records.
            </p>
          </div>

          <div className="step-card">
            <span className="step-icon">📊</span>
            <h3 className="step-title">Step 3: Get Feedback</h3>
            <p className="step-desc">
              Instantly receive AI feedback, score & tips to improve your interview performance.
            </p>
          </div>
        </div>

        <div className="step-button">
          <button className="btn-primary" onClick={goToLogin}>
            Start Practicing Now →
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
