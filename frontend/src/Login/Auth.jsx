import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles, Mail, Lock, User, Phone, Camera } from "lucide-react";
import "./Login.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Welcome back!");
        navigate("/interview");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) data.append(key, formData[key]);
        });
        await API.post("/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <Sparkles size={20} />
            <span>CrackTogether</span>
          </div>
          <h1>Master your interviews with AI</h1>
          <p>
            Practice realistic mock interviews, get instant feedback, and track
            your progress — all powered by cutting-edge AI.
          </p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span>AI-generated role-specific questions</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span>Voice-based interview practice</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span>Detailed scoring & feedback</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to continue your interview practice"
              : "Start your journey to interview success"}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <Phone size={18} className="input-icon" />
                  <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>

            {!isLogin && (
              <>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
                </div>
                <label className="file-upload">
                  <Camera size={18} />
                  <span>{formData.profilePic ? formData.profilePic.name : "Upload profile photo (optional)"}</span>
                  <input type="file" name="profilePic" accept="image/*" onChange={handleChange} hidden />
                </label>
              </>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
