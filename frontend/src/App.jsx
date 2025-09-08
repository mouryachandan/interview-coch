import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import InterviewPage from "./Interview/InterviewPage"; 
import InterviewMode from "./Interview/InterviewMode"; // ✅ Import InterviewMode
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Auth from "./Login/Auth"; 

function AppContent() {
  const location = useLocation();

  // Navbar sirf /auth pe hide होगा
  const hideNavbarRoutes = ["/auth"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <div className="p-6">
        <Routes>
          {/* Auth route */}
          <Route path="/auth" element={<Auth />} />

          {/* Default Route -> Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Interview Page route */}
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />

          {/* Interview Mode route */}
          <Route
            path="/interview-mode"
            element={
              <ProtectedRoute>
                <InterviewMode />
              </ProtectedRoute>
            }
          />

          {/* Profile route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
