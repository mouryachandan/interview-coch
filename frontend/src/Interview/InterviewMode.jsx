import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

const InterviewPage = () => {
  const location = useLocation();
  const { jobTitle, jobTopic, questions } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [scores, setScores] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);

  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  if (!questions) return <h2>No Questions Found!</h2>;

  // ✅ Speak question aloud (stop old voice first)
  const speakText = (text) => {
    // पहले से जो भी बोल रहा है उसे रोक दो
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman") ||
        v.name.toLowerCase().includes("susan") ||
        v.name.toLowerCase().includes("zira")
    );
    if (femaleVoice) utterance.voice = femaleVoice;

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
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setUserAnswer((prev) => prev + " " + transcript);
      console.log("🎤 User Answer:", transcript);

      // reset silence timer
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        console.log("⏳ 4s silence detected → Auto next");
        handleNext();
      }, 4000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ✅ Speak question whenever index changes
  useEffect(() => {
    if (questions && questions[currentIndex]) {
      const qText = `Question ${currentIndex + 1}. ${questions[currentIndex]}`;
      speakText(qText);
      startListening();
    }

    return () => {
      // cleanup → पुराना बोलना और सुनना बंद करो
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [currentIndex, questions]);

  // ✅ Evaluate answer & move next
  const handleNext = async () => {
    if (!userAnswer.trim()) {
      console.log("⚠️ Empty answer, skipping evaluation");
      goNext();
      return;
    }

    try {
      console.log("📤 Sending to backend:", {
        question: questions[currentIndex],
        userAnswer,
      });

      const res = await axios.post("http://localhost:4000/api/interview/evaluate", {
        question: questions[currentIndex],
        userAnswer,
      });

      console.log("📥 Backend Response:", res.data);

      const isCorrect = res.data.correct;
      setFeedback(isCorrect ? "✅ Good answer" : "❌ Needs improvement");

      setScores((prev) => [...prev, isCorrect]);
      setUserAnswer("");

      setTimeout(() => goNext(), 2000);
    } catch (err) {
      console.error("❌ Error while evaluating:", err.response?.data || err.message);
      alert("Error while evaluating answer");
    }
  };

  const goNext = () => {
    // 🔴 Stop current voice before moving
    window.speechSynthesis.cancel();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setInterviewFinished(true);

      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }

      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  const totalCorrect = scores.filter((s) => s).length;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Interview Mode - {jobTitle}</h2>
      <h4>Topic: {jobTopic}</h4>
      <hr />

      {!interviewFinished ? (
        <>
          <h3>
            Q{currentIndex + 1}: {questions[currentIndex]}
          </h3>

          <Webcam
            ref={webcamRef}
            audio={true}
            style={{ width: "300px", borderRadius: "10px" }}
          />

          <p style={{ marginTop: "20px" }}>🎤 Speak your answer...</p>

          {userAnswer && (
            <p>
              <b>Your Answer:</b> {userAnswer}
            </p>
          )}

          {feedback && <p style={{ marginTop: "10px" }}>{feedback}</p>}

          <button
            onClick={handleNext}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
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

export default InterviewPage;
