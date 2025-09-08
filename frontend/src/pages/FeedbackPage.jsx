import React from "react";
import { useLocation } from "react-router-dom";

const FeedbackPage = () => {
  const { state } = useLocation();
  const { answers } = state || { answers: [] };
  const correctCount = answers.filter(a => a.correct).length;

  return (
    <div>
      <h1>Feedback</h1>
      <p>You answered {correctCount} out of {answers.length} correctly</p>
      <ul>
        {answers.map((a,i) => (
          <li key={i}>
            <strong>Q:</strong> {a.question} <br/>
            <strong>Your Answer:</strong> {a.answer} <br/>
            <strong>Correct:</strong> {a.correct ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackPage;
