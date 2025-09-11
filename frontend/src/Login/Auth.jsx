import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Swal from "sweetalert2"; // ✅ SweetAlert2 import
import "./Login.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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
    try {
      if (isLogin) {
        // ✅ Login Request
        const res = await API.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Login Success Alert
        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome back! Redirecting you to your dashboard...",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        }).then(() => {
          navigate("/interview");
        });

      } else {
        // ✅ Register Request
        if (formData.password !== formData.confirmPassword) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Passwords do not match!",
          });
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        await API.post("/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // ✅ Registration Success Alert
        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: "Your account has been created successfully!",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        });

        setIsLogin(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-left">
        <div className="overlay-text">
          <h1>CrackTogether AI Interview Coach</h1>
          <p>
            Practice mock interviews, track your progress, and improve with
            AI-powered feedback.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">
            {isLogin ? "Welcome Back!" : "Create Your Account"}
          </h2>
          <p className="login-subtitle">
            {isLogin
              ? "Login to continue your interview practice"
              : "Sign up to start improving your interview skills"}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="login-input"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="login-input"
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              onChange={handleChange}
              required
            />

            {!isLogin && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="login-input"
                  onChange={handleChange}
                  required
                />
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  className="login-input"
                  onChange={handleChange}
                />
              </>
            )}

            <button type="submit" className="login-button">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="register-text">
            {isLogin ? "New here? " : "Already have an account? "}
            <span
              className="register-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
