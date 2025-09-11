import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, BookOpen, HelpCircle } from "lucide-react"; 
import "./startinterview.css";

const StartInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobTitle, jobTopic, questions, fromResume } = location.state || {};

  const handleStart = () => {
    navigate("/interview-mode", {
      state: { jobTitle, jobTopic, questions },
    });
  };

  return (
    <div className="start-screen">
      <div className="card">
        <h2 className="title">
          {fromResume
            ? "📄 Resume Uploaded Successfully!"
            : "Ready for Your Interview?"}
        </h2>

        <p className="subtitle">
          {fromResume
            ? "Your resume has been analyzed. Click below to start your AI-based interview."
            : "Take a deep breath! This practice interview will help you sharpen your skills and gain confidence."}
        </p>

        <div className="info-box">
          <div className="info-item">
            <Briefcase size={22} className="icon" />
            <span><strong>Role:</strong> {jobTitle || "Software Engineer"}</span>
          </div>
          <div className="info-item">
            <BookOpen size={22} className="icon" />
            <span><strong>Topic:</strong> {jobTopic || "React Basics"}</span>
          </div>
          <div className="info-item">
            <HelpCircle size={22} className="icon" />
            <span>
              <strong>Questions:</strong> {questions?.length || 10} expected
            </span>
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          🚀 Start Interview
        </button>
      </div>
    </div>
  );
};

export default StartInterview;
