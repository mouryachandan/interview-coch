import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInterviewQuestions } from "../services/interviewAPI";
import "./InterviewModal.css";

const InterviewModal = ({ onClose }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobTopic, setJobTopic] = useState("");
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    if (!jobTitle || !jobTopic) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const questions = await fetchInterviewQuestions(jobTitle, jobTopic);

      if (!questions || questions.length === 0) {
        alert("Failed to fetch questions. Try again.");
        return;
      }

      navigate("/interview-mode", {
        state: { jobTitle, jobTopic, questions },
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching questions. Check console.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Tell us about the job role</h2>
        <p>Add details about your job role & topics</p>

        <input
          type="text"
          placeholder="Enter Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="input"
        />

        <textarea
          placeholder="E.g. React, Angular, Java"
          value={jobTopic}
          onChange={(e) => setJobTopic(e.target.value)}
          className="input"
        />

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-start" onClick={handleStartInterview}>
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
