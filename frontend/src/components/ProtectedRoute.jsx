import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // ya Redux state

  if (!user) {
    return <Navigate to="/auth" replace />; // login page pe redirect if not logged in
  }

  return children;
}
