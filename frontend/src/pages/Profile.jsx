import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Trophy, Award, Flame, BarChart3, Target, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { getProfile, getAnalytics, uploadProfilePhoto, syncUserToStorage } from "../services/userAPI";
import { showAppError } from "../utils/appAlert";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    getProfile().then((u) => { setUser(u); syncUserToStorage(u); }).catch(() => {});
    getAnalytics().then(setStats).catch(() => {});
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showAppError("Please upload a JPG or PNG image.", "Invalid file");
      return;
    }
    try {
      setUploading(true);
      const updated = await uploadProfilePhoto(file);
      setUser(updated);
      syncUserToStorage(updated);
      window.dispatchEvent(new Event("user-updated"));
      toast.success("Profile photo updated!");
    } catch (err) {
      showAppError(err.response?.data?.message || "Failed to upload photo.", "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!user) return null;

  const avatarUrl = user.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff&size=128`;

  const levelProgress = ((user.points || 0) % 100);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-banner" />
        <div className="profile-body">
          <div className="profile-avatar-wrap">
            <img src={avatarUrl} alt="Profile" className="profile-avatar" />
            <label className={`profile-photo-btn ${uploading ? "uploading" : ""}`} title="Upload profile photo">
              <Camera size={16} />
              <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handlePhotoUpload} hidden disabled={uploading} />
            </label>
          </div>
          <p className="profile-upload-hint">{uploading ? "Uploading..." : "Tap camera to upload photo"}</p>

          <h1>{user.fullName}</h1>
          <p className="profile-role">Level {user.level || 1} Candidate</p>

          <div className="level-bar-wrap">
            <div className="level-bar" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="level-text">{levelProgress}/100 XP to Level {(user.level || 1) + 1}</p>

          <div className="profile-details">
            <div className="detail-item"><Mail size={16} /><span>{user.email}</span></div>
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
