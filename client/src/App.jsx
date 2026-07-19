import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import { useAppStore } from "./store/useAppStore";
import api from "./api";
import { Toaster, toast } from "sonner";

// Lazy load pages for performance and code splitting
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ProblemsPage = lazy(() => import("./components/ProblemsPage"));
const LeetCodeSync = lazy(() => import("./components/LeetCodeSync"));
const AnalyticsPage = lazy(() => import("./components/AnalyticsPage"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const About = lazy(() => import("./components/About"));

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn } = useAppStore();
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  async function fetchProblems() {
    try {
      setLoadingProblems(true);
      const response = await api.get("/problems");
      setProblems(response.data);
    } catch {
      toast.error("Could not fetch problems from server");
    } finally {
      setLoadingProblems(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  function handleLogin(userData) {
    setLoggedIn(true, userData);
    toast.success(`Welcome back, ${userData.name || "Coder"}!`);
    navigate("/dashboard");
  }

  function handleLogout() {
    setLoggedIn(false, {});
    toast.info("Logged out successfully");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-white">
      {/* Toast Notifications */}
      <Toaster position="top-right" theme="dark" richColors />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette problems={problems} />

      {/* Navbar (visible when logged in) */}
      {isLoggedIn && <Navbar onLogout={handleLogout} />}

      {/* Main Content with Suspense Loading */}
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-400">Loading DSA Workspace...</p>
            </div>
          }
        >
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard problems={problems} onRefresh={fetchProblems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Problems Route */}
            <Route
              path="/problems"
              element={
                isLoggedIn ? (
                  <ProblemsPage problems={problems} onRefresh={fetchProblems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* LeetCode Sync Route */}
            <Route
              path="/leetcode"
              element={isLoggedIn ? <LeetCodeSync /> : <Navigate to="/login" replace />}
            />

            {/* Analytics Route */}
            <Route
              path="/analytics"
              element={
                isLoggedIn ? (
                  <AnalyticsPage problems={problems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* User Profile Route */}
            <Route
              path="/profile"
              element={
                isLoggedIn ? (
                  <UserProfile problems={problems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* About Route */}
            <Route path="/about" element={<About />} />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
