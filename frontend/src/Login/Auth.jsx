import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import { showAppError } from "../utils/appAlert";
import {
  Sparkles, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Shield, Zap, BarChart3,
} from "lucide-react";
import "./Login.css";

const EMPTY_REGISTER = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const goToLogin = () => {
    setIsLogin(true);
    setShowLoginPassword(false);
  };

  const goToRegister = () => {
    setRegisterData({ ...EMPTY_REGISTER });
    setShowRegPassword(false);
    setShowConfirmPassword(false);
    setIsLogin(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/users/login", {
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back!");
      navigate("/interview", { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.";
      showAppError(msg, "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password.length < 6) {
      showAppError("Password must be at least 6 characters long.", "Password too short");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      showAppError("Please make sure both password fields match.", "Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const email = registerData.email.trim().toLowerCase();
      const password = registerData.password;

      const res = await API.post("/users/register", {
        fullName: registerData.fullName,
        email,
        password,
      });

      let { token, user } = res.data;

      // Fallback: auto-login if older backend response has no token
      if (!token) {
        const loginRes = await API.post("/users/login", { email, password });
        token = loginRes.data.token;
        user = loginRes.data.user;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setRegisterData({ ...EMPTY_REGISTER });
      toast.success("Account created! Welcome aboard!");
      navigate("/interview", { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.";
      showAppError(msg, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-left">
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
      </aside>

      <div className="auth-right">
        <div className="auth-right-bg" />
        <div className="auth-card">
          <div className="auth-tabs">
            <button type="button" className={`auth-tab ${isLogin ? "active" : ""}`} onClick={goToLogin}>
              Sign In
            </button>
            <button type="button" className={`auth-tab ${!isLogin ? "active" : ""}`} onClick={goToRegister}>
              Register
            </button>
          </div>

          {isLogin ? (
            <>
              <div className="auth-card-header">
                <h2>Welcome back</h2>
                <p className="auth-subtitle">Sign in to continue your interview journey</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form" autoComplete="on">
                <div className="input-field">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      name="login-email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      name="login-password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="input-with-toggle"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="auth-submit-loading">Please wait...</span> : <>Sign In<ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-card-header">
                <h2>Create your account</h2>
                <p className="auth-subtitle">Create account with email and password (min. 6 characters)</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="auth-form" autoComplete="off">
                <div className="input-field">
                  <label htmlFor="reg-fullName">Full Name</label>
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      id="reg-fullName"
                      type="text"
                      name="reg-fullName"
                      placeholder="John Doe"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label htmlFor="reg-email">Email Address</label>
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="reg-email"
                      type="email"
                      name="reg-email"
                      placeholder="you@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      name="reg-password"
                      placeholder="Min. 6 characters"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="input-with-toggle"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="input-field">
                  <label htmlFor="reg-confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="reg-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="reg-confirmPassword"
                      placeholder="Re-enter password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="input-with-toggle"
                      autoComplete="new-password"
                      minLength={6}
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

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="auth-submit-loading">Please wait...</span> : <>Create Account<ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          )}

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
