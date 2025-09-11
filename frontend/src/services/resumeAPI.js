// src/services/resumeAPI.js
import axios from "axios";

const API_URL = "https://interview-cochhh.onrender.com/api/resume"; // ✅ deployed backend URL

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { skills, questions, feedback }
};
