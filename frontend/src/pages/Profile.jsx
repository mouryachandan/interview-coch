import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <img src={user?.profilePic} alt="Profile"
        className="w-24 h-24 rounded-full border mb-4" />
      <p><strong>Full Name:</strong> {user?.fullName}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Mobile:</strong> {user?.mobile}</p>
    </div>
  );
}

export default Profile;
