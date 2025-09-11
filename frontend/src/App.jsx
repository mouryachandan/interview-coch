import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lazy loaded components
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Navbar = lazy(() => import("./components/Navbar"));
const Loader = lazy(() => import("./components/Loader"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const InterviewPage = lazy(() => import("./Interview/InterviewPage"));
const StartInterview = lazy(() => import("./Interview/StartInterview"));
const InterviewMode = lazy(() => import("./Interview/InterviewMode"));
const ResumeInterview = lazy(() => import("./resume/ResumeUpload"));
const Auth = lazy(() => import("./Login/Auth"));

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/auth"];

  return (
    <Suspense fallback={<Loader />}>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Suspense fallback={<Loader />}>
          <Navbar />
        </Suspense>
      )}
      <div className="p-6">
        <Routes>
          {/* ✅ Root path directly Dashboard render karega */}
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/auth"
            element={
              <Suspense fallback={<Loader />}>
                <Auth />
              </Suspense>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/interview"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <InterviewPage />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/start-interview"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <StartInterview />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/interview-mode"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <InterviewMode />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/resume-interview"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <ResumeInterview />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Suspense>
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
