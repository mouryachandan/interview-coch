const axios = require("axios");

// ✅ Memory store for old questions (server restart hone pe reset ho जाएगा)
let previousQuestions = new Set();

// ✅ Generate Interview Questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, jobTopic } = req.body;
    if (!jobTitle || !jobTopic) {
      return res.status(400).json({ error: "Job Title & Job Topic are required" });
    }

    const prompt = `
      You are an experienced technical interviewer.
      Generate 8 interview questions for the job role "${jobTitle}".
      Focus on these skills: ${jobTopic}.
      
      Rules:
      - Do NOT repeat these questions: ${Array.from(previousQuestions).join(" | ")}
      - Make progressively harder
      - Output only the questions in a numbered list, no answers.
    `;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 600,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = response.data.choices[0].message.content;

    // 🔽 clean questions
    const questions = rawText
      .split("\n")
      .map((q) => q.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 0);

    // ✅ store in memory to avoid repetition next time
    questions.forEach((q) => previousQuestions.add(q));

    res.json({ questions });
  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
};

// ✅ Evaluate Answer
const evaluateUserAnswer = async (req, res) => {
  try {
    console.log("📥 Incoming Body:", req.body);
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: "Question & userAnswer required" });
    }

    // Dummy evaluator → random correct/incorrect
    const correct = Math.random() > 0.5;
    res.json({ correct });
  } catch (err) {
    console.error("Evaluation Error:", err.message);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
};

module.exports = { generateInterviewQuestions, evaluateUserAnswer };
