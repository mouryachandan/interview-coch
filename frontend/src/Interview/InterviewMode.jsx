import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import "./InterviewMode.css";

const InterviewMode = () => {
  const location = useLocation();
  const { jobTitle, jobTopic, questions } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [scores, setScores] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  if (!questions) return <h2>No Questions Found!</h2>;

  // ✅ Speak question aloud
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Start speech recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setUserAnswer((prev) => prev + " " + transcript);

      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        handleNext();
      }, 4000);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ✅ Start Interview when component mounts
  useEffect(() => {
    if (questions && questions[currentIndex]) {
      const qText = `Question ${currentIndex + 1}. ${questions[currentIndex]}`;
      speakText(qText);
      startListening();
    }

    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [currentIndex, questions]);

  // ✅ Evaluate answer
  const handleNext = async () => {
    if (!userAnswer.trim()) {
      goNext();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/interview/evaluate",
        {
          question: questions[currentIndex],
          userAnswer,
        }
      );

      const isCorrect = res.data.correct;
      setFeedback(isCorrect ? "✅ Good answer" : "❌ Needs improvement");

      setScores((prev) => [...prev, isCorrect]);
      setUserAnswer("");

      setTimeout(() => goNext(), 2000);
    } catch (err) {
      console.error("❌ Error while evaluating:", err);
      alert("Error while evaluating answer");
    }
  };

  const goNext = () => {
    window.speechSynthesis.cancel();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setInterviewFinished(true);

      if (webcamRef.current?.video?.srcObject) {
        webcamRef.current.video.srcObject.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  const totalCorrect = scores.filter((s) => s).length;

  return (
    <div className="interview-panel slide-in-top">
      <h2 className="interview-header">Interview Mode - {jobTitle}</h2>
      <h4>Topic: {jobTopic}</h4>
      <hr />

      {!interviewFinished ? (
        <>
          <h3 className="interview-question">
            Q{currentIndex + 1}: {questions[currentIndex]}
          </h3>

          <div className="interview-body">
            <div className="webcam-container">
              <Webcam ref={webcamRef} audio={true} />
            </div>

            <div className="ai-avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712011.png"
                alt="AI Avatar"
              />
              {aiSpeaking && (
                <div className="audio-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>

          <p style={{ marginTop: "20px" }}>🎤 Speak your answer...</p>

          {userAnswer && (
            <div className="user-answer">
              <b>Your Answer:</b> {userAnswer}
            </div>
          )}

          {feedback && <p className="feedback">{feedback}</p>}

          <button className="next-btn" onClick={handleNext}>
            Next →
          </button>
        </>
      ) : (
        <>
          <h2>🎉 Interview Finished!</h2>
          <p>
            ✅ Correct Answers: <b>{totalCorrect}</b> / {questions.length}
          </p>
        </>
      )}
    </div>
  );
};

export default InterviewMode;
