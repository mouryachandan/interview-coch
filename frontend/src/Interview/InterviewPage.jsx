import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InterviewPage.css";
import InterviewModal from "./InterviewModal";
import { useNavigate } from "react-router-dom";

const InterviewPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/interview/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInterviews(res.data);
      } catch (err) {
        console.error("❌ Error fetching interviews:", err);
      }
    };

    fetchInterviews();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      const res = await axios.post(
        "https://interview-cochhh.onrender.com/api/resume/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Navigate to StartInterview page with skill-based questions
      navigate("/start-interview", {
        state: {
          jobTitle: "Resume-based Role",
          jobTopic: "Skills from Resume",
          questions: res.data.questions, // AI generated skill-based questions
          fromResume: true, // flag to show "Resume Uploaded Successfully!"
        },
      });
    } catch (err) {
      console.error("❌ Error uploading resume:", err);
      alert("Resume upload failed. Try again!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="interview-container">
      <header className="header">
        <h1 className="title">🚀 AI Interview Dashboard</h1>
        <p className="subtitle">
          Prepare smarter, practice better, and track your growth.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712011.png"
          alt="AI Assistant"
          className="ai-image"
        />
      </header>

      <div className="action-buttons">
        <div className="new-interview-btn" onClick={() => setShowModal(true)}>
          + Take New Interview
        </div>

        <label className="resume-upload-btn">
          {uploading ? "Uploading..." : "📂 Upload Resume & Start"}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleResumeUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="cards">
        <div className="card left-card">
          <div className="icon">📝</div>
          <h2>Your Interviews</h2>
          {interviews.length > 0 ? (
            <ul className="interview-list">
              {interviews.map((intv, index) => (
                <li
                  key={index}
                  className="interview-item"
                  onClick={() =>
                    navigate("/start-interview", {
                      state: {
                        jobTitle: intv.jobTitle,
                        jobTopic: intv.jobTopic,
                        questions: intv.questions,
                      },
                    })
                  }
                >
                  <strong>{intv.jobTitle}</strong> - {intv.jobTopic} (
                  {intv.questions.length} Qs)
                </li>
              ))}
            </ul>
          ) : (
            <p>No interviews found. Start one now!</p>
          )}
        </div>

        <div className="card right-card">
          <p className="small-title">🔥 CONTRIBUTE & EARN</p>
          <h2>Help Others & Unlock Rewards</h2>
          <p>
            Share your interview questions and experiences with the community.
          </p>
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

      {showModal && <InterviewModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default InterviewPage;
