import { useState, useEffect, Component } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import LeetCodeSync from "./components/LeetCodeSync";
import AnalyticsPage from "./components/AnalyticsPage";
import ProblemsPage from "./components/ProblemsPage";
import UserProfile from "./components/UserProfile";
import About from "./components/About";
import { useAppStore } from "./store/useAppStore";
import api from "./api";
import { Toaster, toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Error Boundary Component to prevent blank screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4 font-mono">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
          <h2 className="text-2xl font-bold">SYSTEM RECOVERY</h2>
          <p className="text-sm text-slate-400 max-w-md">
            {this.state.error?.message || "An unexpected error occurred in the workspace."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-none flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn } = useAppStore();
  const [problems, setProblems] = useState([]);

  async function fetchProblems() {
    try {
      const response = await api.get("/problems");
      if (Array.isArray(response.data)) {
        setProblems(response.data);
      }
    } catch {
      // Graceful fallback
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  function handleLogin(userData) {
    setLoggedIn(true, userData);
    toast.success(`Welcome back, ${userData.name || "Coder"}!`);
    navigate("/leetcode");
  }

  function handleLogout() {
    setLoggedIn(false, {});
    toast.info("Logged out successfully");
    navigate("/");
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-white">
        {/* Toast Notifications */}
        <Toaster position="top-right" theme="dark" richColors />

        {/* Global Command Palette (Ctrl+K) */}
        <CommandPalette problems={problems} />

        {/* Navbar */}
        {isLoggedIn && <Navbar onLogout={handleLogout} />}

        {/* Main Content Routes */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/leetcode" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/leetcode" replace /> : <Register />}
            />

            {/* 1. LeetCode Sync */}
            <Route
              path="/leetcode"
              element={isLoggedIn ? <LeetCodeSync /> : <Navigate to="/login" replace />}
            />

            {/* 2. Analytics */}
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

            {/* 3. Problems (Add & Track Problems) */}
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

            {/* 4. User Profile */}
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

            {/* 5. About */}
            <Route path="/about" element={<About />} />

            {/* Legacy Dashboard Redirect */}
            <Route path="/dashboard" element={<Navigate to="/leetcode" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
