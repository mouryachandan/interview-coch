import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./startinterview.css";

const StartInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobTitle, jobTopic, questions } = location.state || {};

  const handleStart = () => {
    navigate("/interview-mode", {
      state: { jobTitle, jobTopic, questions },
    });
  };

  return (
    <div className="start-screen">
      <h2>Can you start the interview?</h2>
      <button className="start-btn" onClick={handleStart}>
        Start Interview
      </button>
    </div>
  );
};

export default StartInterview;
