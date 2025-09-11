import React from "react";
import { toast } from "react-toastify";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.info("⚠ Please login to view profile!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    return null; // Nothing to render if user not logged in
  }

  return (
    <div className="profile-modal">
      <div className="profile-content">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <img
          src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border mb-4"
        />
        <p><strong>Full Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
      </div>
    </div>
  );
}

export default Profile;
