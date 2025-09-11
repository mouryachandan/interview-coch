import axios from "axios";

const API = axios.create({
  baseURL: "https://interview-cochhh.onrender.com/api", // ✅ Deployed backend URL
});

// Agar token hai to auth header me bhejo
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;