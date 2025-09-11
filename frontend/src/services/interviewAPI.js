export const fetchInterviewQuestions = async (jobTitle, jobTopic) => {
  const res = await fetch("https://interview-cochhh.onrender.com/api/interview/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle, jobTopic }),
  });
  const data = await res.json();
  return data.questions;
};

export const evaluateAnswer = async (question, userAnswer) => {
  const res = await fetch("https://interview-cochhh.onrender.com/api/interview/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, userAnswer }),
  });
  return res.json();
};
