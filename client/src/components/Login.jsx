import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Code2, CheckCircle2, Sparkles } from "lucide-react";

function Login({ onLogin }) {
  const { updateUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/users/login", { email, password });
      const userData = response.data.user;

      if (userData) {
        updateUser(userData);
      }

      onLogin(userData);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to log in. Please ensure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-grid-pattern">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 backdrop-blur-xl">
        
        {/* Left Side: Developer Workspace Graphic & Motivation */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0B1120] border-r border-slate-800/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-6">
              <Code2 className="w-3.5 h-3.5" />
              DSA Placement Readiness Platform
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Master Patterns. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-300">
                Ace Tech Interviews.
              </span>
            </h1>

            <p className="text-xs text-slate-400 font-medium max-w-md leading-relaxed">
              Track your LeetCode problem velocity, master pattern-by-pattern problem solving, and build consistency for SDE placement season.
            </p>
          </div>

          {/* Code Card Mockup */}
          <div className="my-8 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl relative shadow-xl font-mono text-[0.72rem]">
            <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800/60 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[0.65rem] text-slate-500 font-sans ml-2">SlidingWindow.cpp</span>
            </div>
            <p className="text-slate-400"><span className="text-cyan-400">int</span> maxSubarrayLen(<span className="text-cyan-400">vector</span>&lt;<span className="text-cyan-400">int</span>&gt;& nums, <span className="text-cyan-400">int</span> k) &#123;</p>
            <p className="text-slate-400 pl-4"><span className="text-cyan-400">int</span> left = 0, maxLen = 0, currentSum = 0;</p>
            <p className="text-slate-400 pl-4"><span className="text-amber-300">for</span> (<span className="text-cyan-400">int</span> right = 0; right &lt; nums.size(); ++right) &#123;</p>
            <p className="text-emerald-400 pl-8">// Pattern match found ⚡</p>
            <p className="text-slate-400 pl-4">&#125;</p>
            <p className="text-slate-400">&#125;</p>
          </div>

          {/* Student Stats Highlights */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
            <div>
              <span className="block text-lg font-black text-white">15+</span>
              <span className="block text-[0.65rem] text-slate-400 font-medium">Core Patterns</span>
            </div>
            <div>
              <span className="block text-lg font-black text-cyan-400">100%</span>
              <span className="block text-[0.65rem] text-slate-400 font-medium">Live Sync</span>
            </div>
            <div>
              <span className="block text-lg font-black text-amber-400">Target</span>
              <span className="block text-[0.65rem] text-slate-400 font-medium">Placement Ready</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">
              Log in to your DSA tracker workspace to continue solving.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>
              <span className="text-cyan-400 hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
