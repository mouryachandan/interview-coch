import React, { useState } from "react";
import "./InterviewPage.css";
import InterviewModal from "./InterviewModal";

const InterviewPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="interview-container">
      {/* Header Section */}
      <header className="header">
        <h1 className="title">🚀 AI Interview Dashboard</h1>
        <p className="subtitle">Prepare smarter, practice better, and track your growth.</p>

        {/* AI Robot Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712011.png"
          alt="AI Assistant"
          className="ai-image"
        />
      </header>

      {/* Action Button */}
      <div className="new-interview-btn" onClick={() => setShowModal(true)}>
        + Take New Interview
      </div>

      {/* Cards Section */}
      <div className="cards">
        <div className="card left-card">
          <div className="icon">📝</div>
          <h2>Your Interviews</h2>
          <p>
            Access all your previous interviews and track your progress. 
            Review answers, scores, and feedback to improve your performance.
          </p>
          <a href="#" className="link">Go to Interviews →</a>
        </div>

        <div className="card right-card">
          <p className="small-title">🔥 CONTRIBUTE & EARN</p>
          <h2>Help Others & Unlock Rewards</h2>
          <p>
            Share your interview questions and experiences with the community. 
            Earn reward points that can be redeemed for premium features.
          </p>
          <a href="#" className="link">Contribute Now →</a>
        </div>

        <div className="card tips-card">
          <div className="icon">💡</div>
          <h2>Quick Tips</h2>
          <ul>
            <li>🎤 Speak clearly during practice.</li>
            <li>📚 Revise your weak areas.</li>
            <li>⏱ Manage your time efficiently.</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && <InterviewModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default InterviewPage;
