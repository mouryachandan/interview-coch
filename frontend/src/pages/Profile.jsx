import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Trophy, Award, Flame, BarChart3, Target } from "lucide-react";
import { getProfile, getAnalytics } from "../services/userAPI";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    getProfile().then((u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); }).catch(() => {});
    getAnalytics().then(setStats).catch(() => {});
  }, []);

  if (!user) return null;

  const avatarUrl = user.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff&size=128`;

  const levelProgress = ((user.points || 0) % 100);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-banner" />
        <div className="profile-body">
          <img src={avatarUrl} alt="Profile" className="profile-avatar" />
          <h1>{user.fullName}</h1>
          <p className="profile-role">Level {user.level || 1} Candidate</p>

          <div className="level-bar-wrap">
            <div className="level-bar" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="level-text">{levelProgress}/100 XP to Level {(user.level || 1) + 1}</p>

          <div className="profile-details">
            <div className="detail-item"><Mail size={16} /><span>{user.email}</span></div>
            <div className="detail-item"><Phone size={16} /><span>{user.mobile}</span></div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat"><Trophy size={20} /><span className="stat-number">{user.points || 0}</span><span className="stat-text">Points</span></div>
            <div className="profile-stat"><Flame size={20} /><span className="stat-number">{user.streak || 0}</span><span className="stat-text">Streak</span></div>
            <div className="profile-stat"><BarChart3 size={20} /><span className="stat-number">{user.interviewsCompleted || 0}</span><span className="stat-text">Interviews</span></div>
            <div className="profile-stat"><Award size={20} /><span className="stat-number">{user.badges?.length || 0}</span><span className="stat-text">Badges</span></div>
          </div>

          {stats && (
            <div className="profile-performance">
              <h3><Target size={16} /> Performance</h3>
              <div className="perf-row">
                <span>Average Score</span>
                <strong>{stats.avgScore}%</strong>
              </div>
              <div className="perf-row">
                <span>Total Interviews</span>
                <strong>{stats.totalInterviews}</strong>
              </div>
            </div>
          )}

          {user.badges?.length > 0 && (
            <div className="badges-section">
              <h3>Badges</h3>
              <div className="badges-list">
                {user.badges.map((badge, i) => (
                  <span key={i} className="badge-item">{badge.replace(/_/g, " ")}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
