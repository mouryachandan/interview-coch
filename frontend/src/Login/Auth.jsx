import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import { showAppError } from "../utils/appAlert";
import {
  Sparkles, Mail, Lock, User, Phone, Camera, Eye, EyeOff,
  ArrowRight, Shield, Zap, BarChart3,
} from "lucide-react";
import "./Login.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Welcome back!");
        navigate("/interview");
      } else {
        if (formData.password !== formData.confirmPassword) {
          showAppError("Please make sure both password fields match.", "Passwords don't match");
          return;
        }
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) data.append(key, formData[key]);
        });
        data.set("email", formData.email.trim().toLowerCase());
        await API.post("/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.";
      showAppError(msg, isLogin ? "Sign in failed" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login) => {
    setIsLogin(login);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-glow auth-left-glow--1" />
        <div className="auth-left-glow auth-left-glow--2" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Sparkles size={18} />
            </div>
            <span>CrackTogether</span>
          </div>
          <h1>Master your interviews with AI</h1>
          <p>
            Practice realistic mock interviews, get instant feedback, and track
            your progress — all powered by cutting-edge AI.
          </p>
          <div className="auth-features">
            <div className="auth-feature-card">
              <Zap size={18} />
              <span>AI-generated role-specific questions</span>
            </div>
            <div className="auth-feature-card">
              <BarChart3 size={18} />
              <span>Detailed scoring & analytics</span>
            </div>
            <div className="auth-feature-card">
              <Shield size={18} />
              <span>Secure & private practice sessions</span>
            </div>
          </div>
          <div className="auth-stats">
            <div><strong>70+</strong><span>Users</span></div>
            <div><strong>24/7</strong><span>AI Ready</span></div>
            <div><strong>95%</strong><span>Satisfaction</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-bg" />
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => switchMode(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => switchMode(false)}
            >
              Register
            </button>
          </div>

          <div className="auth-card-header">
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to continue your interview journey"
                : "Join thousands preparing smarter with AI"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="input-field">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input id="fullName" type="text" name="fullName" placeholder="John Doe" onChange={handleChange} required />
                  </div>
                </div>
                <div className="input-field">
                  <label htmlFor="mobile">Mobile Number</label>
                  <div className="input-group">
                    <Phone size={18} className="input-icon" />
                    <input id="mobile" type="text" name="mobile" placeholder="+91 98765 43210" onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}

            <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input id="email" type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="input-with-toggle"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="input-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      onChange={handleChange}
                      className="input-with-toggle"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <label className="file-upload">
                  <div className="file-upload-icon"><Camera size={18} /></div>
                  <div className="file-upload-text">
                    <span className="file-upload-title">Profile photo</span>
                    <span className="file-upload-hint">
                      {formData.profilePic ? formData.profilePic.name : "Optional — JPG or PNG"}
                    </span>
                  </div>
                  <input type="file" name="profilePic" accept="image/*" onChange={handleChange} hidden />
                </label>
              </>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-submit-loading">Please wait...</span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-secure">
            <Shield size={14} />
            Your data is encrypted and never shared
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
