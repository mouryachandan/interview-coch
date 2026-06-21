import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Mic, MicOff, SkipForward, Volume2, Timer, ArrowLeft } from "lucide-react";
import { evaluateAnswer, saveInterviewResult } from "../services/interviewAPI";
import { toast } from "react-toastify";
import { showAppError } from "../utils/appAlert";
import "./InterviewMode.css";

const InterviewMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobTitle, jobTopic, questions, interviewId, fromResume } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(120);
  const [totalDuration, setTotalDuration] = useState(0);

  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showAppError("Speech recognition is not supported in this browser. Try Chrome or Edge.", "Browser not supported");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setUserAnswer(transcript);

      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => handleNext(), 4000);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
  };

  useEffect(() => {
    if (!questions?.length) return;

    if (questions[currentIndex]) {
      const qText = `Question ${currentIndex + 1}. ${questions[currentIndex]}`;
      speakText(qText);
      setUserAnswer("");
      setFeedback("");
      setFeedbackScore(null);
      setQuestionTimer(120);
      startListening();
    }

    return () => {
      window.speechSynthesis.cancel();
      stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuestionTimer((t) => (t <= 1 ? 0 : t - 1));
      setTotalDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const handleNext = async () => {
    if (evaluating) return;
    stopListening();

    const answer = userAnswer.trim();
    const question = questions[currentIndex];
    let result = { correct: false, score: 0, feedback: "No answer provided." };

    if (answer) {
      setEvaluating(true);
      try {
        result = await evaluateAnswer(question, answer);
        setFeedback(result.feedback);
        setFeedbackScore(result.score);
      } catch {
        showAppError("We couldn't evaluate your answer. Moving to the next question.", "Evaluation failed");
      } finally {
        setEvaluating(false);
      }
    }

    const answerRecord = {
      question,
      userAnswer: answer || "(skipped)",
      correct: result.correct,
      feedback: result.feedback,
      score: result.score,
    };

    const updatedAnswers = [...allAnswers, answerRecord];
    setAllAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishInterview(updatedAnswers);
      }
    }, answer ? 2500 : 500);
  };

  const finishInterview = async (answers) => {
    setInterviewFinished(true);
    window.speechSynthesis.cancel();
    stopListening();

    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach((t) => t.stop());
    }

    setSaving(true);
    try {
      const result = await saveInterviewResult({
        interviewId, jobTitle, jobTopic, questions, answers, fromResume,
        duration: totalDuration,
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.points = (user.points || 0) + (result.pointsEarned || 0);
      user.level = result.level || user.level;
      user.streak = result.streak || user.streak;
      user.interviewsCompleted = (user.interviewsCompleted || 0) + 1;
      if (result.newBadges?.length) {
        user.badges = [...new Set([...(user.badges || []), ...result.newBadges])];
      }
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/feedback", {
        state: {
          answers, jobTitle, jobTopic,
          totalScore: result.totalScore, maxScore: result.maxScore,
          correctCount: result.correctCount, pointsEarned: result.pointsEarned,
          newBadges: result.newBadges, duration: totalDuration,
        },
      });
    } catch {
      navigate("/feedback", {
        state: { answers, jobTitle, jobTopic },
      });
    } finally {
      setSaving(false);
    }
  };

  if (!questions?.length) {
    return (
      <div className="interview-room empty">
        <h2>No questions found</h2>
        <button onClick={() => navigate("/interview")}>Back to Dashboard</button>
      </div>
    );
  }

  if (interviewFinished && saving) {
    return (
      <div className="interview-room empty">
        <div className="saving-spinner" />
        <h2>Saving your results...</h2>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="interview-room">
      <div className="room-header">
        <button className="back-btn" onClick={() => { if (confirm("Leave interview?")) navigate("/interview"); }}>
          <ArrowLeft size={18} /> Exit
        </button>
        <div className="room-title">
          <h2>{jobTitle}</h2>
          <span className="room-topic">{jobTopic}</span>
        </div>
        <div className="room-progress">
          <div className="timer-display">
            <Timer size={14} />
            <span className={questionTimer <= 30 ? "timer-warn" : ""}>
              {Math.floor(questionTimer / 60)}:{String(questionTimer % 60).padStart(2, "0")}
            </span>
          </div>
          <span>Q{currentIndex + 1} of {questions.length}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="question-card">
        <div className="question-label">
          <Volume2 size={16} />
          {aiSpeaking ? "AI is speaking..." : "Current Question"}
        </div>
        <p className="question-text">{questions[currentIndex]}</p>
      </div>

      <div className="room-body">
        <div className="webcam-panel">
          <Webcam
            ref={webcamRef}
            audio={true}
            className="webcam-feed"
            screenshotFormat="image/jpeg"
          />
          <div className="webcam-label">You</div>
        </div>

        <div className="ai-panel">
          <div className={`ai-avatar ${aiSpeaking ? "speaking" : ""}`}>
            <div className="ai-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            {aiSpeaking && (
              <div className="audio-bars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
          <span className="ai-label">AI Interviewer</span>
        </div>
      </div>

      <div className="answer-section">
        <div className="listening-indicator">
          {isListening ? (
            <><Mic size={16} className="pulse" /> Listening...</>
          ) : (
            <><MicOff size={16} /> Not listening</>
          )}
        </div>

        {userAnswer && (
          <div className="answer-box">
            <strong>Your answer:</strong>
            <p>{userAnswer}</p>
          </div>
        )}

        {feedback && (
          <div className={`feedback-box ${feedbackScore >= 6 ? "good" : "needs-work"}`}>
            <span className="feedback-score">{feedbackScore}/10</span>
            <p>{feedback}</p>
          </div>
        )}
      </div>

      <div className="room-actions">
        <button className="skip-btn" onClick={handleNext} disabled={evaluating}>
          <SkipForward size={18} />
          {evaluating ? "Evaluating..." : userAnswer ? "Submit & Next" : "Skip"}
        </button>
      </div>
    </div>
  );
};

export default InterviewMode;
