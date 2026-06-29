import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProblemForm from "./components/ProblemForm";
import ProblemList from "./components/ProblemList";
import About from "./components/About";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import api from "./api";

const PATTERNS = [
  "All",
  "Arrays",
  "Strings",
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
  "Stack",
  "Queue",
  "Trees",
  "Graphs",
  "Dynamic Programming",
];

function App() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [pattern, setPattern] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const navigate = useNavigate();

  async function fetchProblems() {
    const response = await api.get("/problems");
    setProblems(response.data);
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.problemName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPattern = pattern === "All" || problem.pattern === pattern;

    return matchesSearch && matchesPattern;
  });

  const solvedCount = problems.filter((p) => p.status === "Solved").length;

  const percentage =
    problems.length > 0
      ? Math.round((solvedCount / problems.length) * 100)
      : 0;

  function handleLogin(userData) {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser({});
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col">
      {isLoggedIn && (
        <Navbar onLogout={handleLogout} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="flex-1 min-h-[calc(100vh-68px)]">
                <Home isLoggedIn={isLoggedIn} />
              </div>
            ) : (
              <Home isLoggedIn={isLoggedIn} />
            )
          }
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="flex-1 bg-gradient-to-br from-[#0c0f1d] via-[#11172e] to-[#090b16] min-h-[calc(100vh-68px)]">
                <main className="max-w-[920px] mx-auto px-5 py-7 pb-12">
                  <div className="animate-page-ease-in" key="dashboard">
                    
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#131b3e] via-[#1a2356] to-[#0f1428] border border-violet-500/25 rounded-2xl p-6 md:p-8 mb-6 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-violet-600/15 to-transparent rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:translate-x-4" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3 uppercase tracking-wider">
                            ✨ Progress Active
                          </span>
                          <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 mb-1">
                            👋 Welcome back, {user?.name || "Coder"}!
                          </h2>
                          <p className="text-sm text-slate-300 max-w-xl">
                            Keep grinding — every problem you solve gets you closer to cracking the next interview. 💪
                          </p>
                        </div>
                        <div className="hidden md:flex flex-col items-end shrink-0">
                          <span className="text-xs text-slate-400 font-medium">Solved Percentage</span>
                          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">{percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                      <div className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(59,130,246,0.12)] hover:border-blue-500/40 p-5 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f1428] to-[#0b0e1d] backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-blue-500/5 to-transparent rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Total Problems</span>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/25">
                            📚
                          </div>
                        </div>
                        <span className="block text-3xl font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors duration-300">{problems.length}</span>
                        <span className="block text-xs font-medium text-slate-500 mt-1">Categorized patterns</span>
                      </div>

                      <div className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] hover:border-emerald-500/40 p-5 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f1428] to-[#0b0e1d] backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-emerald-500/5 to-transparent rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Solved</span>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            🏆
                          </div>
                        </div>
                        <span className="block text-3xl font-extrabold text-slate-100 group-hover:text-emerald-400 transition-colors duration-300">{solvedCount}</span>
                        <span className="block text-xs font-medium text-slate-500 mt-1">
                          {problems.length > 0 ? `${Math.round((solvedCount / problems.length) * 100)}% of total` : "No problems"}
                        </span>
                      </div>

                      <div className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(244,63,94,0.12)] hover:border-rose-500/40 p-5 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0f1428] to-[#0b0e1d] backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-rose-500/5 to-transparent rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Unsolved</span>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/25">
                            🔥
                          </div>
                        </div>
                        <span className="block text-3xl font-extrabold text-slate-100 group-hover:text-rose-400 transition-colors duration-300">{problems.length - solvedCount}</span>
                        <span className="block text-xs font-medium text-slate-500 mt-1">Pending review</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {problems.length > 0 && (
                      <div className="mb-6 bg-gradient-to-r from-[#0f1428] to-[#121834] border border-violet-500/20 rounded-2xl p-5 hover:border-violet-500/30 hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)] transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Consistency Bar</span>
                          </div>
                          <strong className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{percentage}% Solved</strong>
                        </div>
                        <div className="w-full h-3 bg-slate-950/65 rounded-full overflow-hidden p-0.5 border border-violet-500/10 shadow-inner">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[pulse_2s_infinite]" />
                          </div>
                        </div>
                        <div className="flex justify-between mt-2.5 text-[0.7rem] text-slate-500 font-semibold uppercase tracking-wider">
                          <span>0% Begin</span>
                          <span>50% Intermediate</span>
                          <span>100% Master</span>
                        </div>
                      </div>
                    )}

                    <ProblemForm onAdd={fetchProblems} />

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1 group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-400 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                        <input
                          placeholder="Search by problem name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-200 bg-[#0f1428]/60 placeholder-slate-500 outline-none transition-all duration-300 hover:border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-[#0f1428]"
                        />
                      </div>
                      <div className="relative group min-w-[200px]">
                        <select
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="w-full px-4 pr-10 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-[#0f1428] cursor-pointer appearance-none"
                        >
                          {PATTERNS.map((p) => (
                            <option key={p} className="bg-[#0f1428] text-slate-200">{p === "All" ? "Filter by Pattern (All)" : p}</option>
                          ))}
                        </select>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <ProblemList
                      problems={filteredProblems}
                      onDelete={fetchProblems}
                      onUpdate={fetchProblems}
                    />
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/problems"
          element={
            isLoggedIn ? (
              <div className="flex-1 bg-gradient-to-br from-[#080d1a] via-[#0d1630] to-[#070b18] min-h-[calc(100vh-68px)]">
                <main className="max-w-[920px] mx-auto px-5 py-7 pb-12">
                  <div className="animate-page-ease-in" key="problems">
                    <div className="mb-6 animate-slide-in-left">
                      <h1 className="text-2xl font-bold text-slate-200 mb-1">📋 {user?.name || "Coder"}'s Problems</h1>
                      <p className="text-[0.88rem] text-slate-400">
                        View your list of solved and unsolved problems.
                      </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1 group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-400 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                        <input
                          placeholder="Search by problem name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-200 bg-[#0f1428]/60 placeholder-slate-500 outline-none transition-all duration-300 hover:border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-[#0f1428]"
                        />
                      </div>
                      <div className="relative group min-w-[200px]">
                        <select
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="w-full px-4 pr-10 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-[#0f1428] cursor-pointer appearance-none"
                        >
                          {PATTERNS.map((p) => (
                            <option key={p} className="bg-[#0f1428] text-slate-200">{p === "All" ? "Filter by Pattern (All)" : p}</option>
                          ))}
                        </select>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <ProblemList
                      problems={filteredProblems}
                      readOnly={true}
                    />
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/about"
          element={
            <div className="flex-1 bg-gradient-to-br from-[#0a0e1a] via-[#121c38] to-[#090d1c] min-h-[calc(100vh-68px)]">
              <main className="max-w-[920px] mx-auto px-5 py-7 pb-12">
                <div className="animate-page-ease-in" key="about">
                  <About />
                </div>
              </main>
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
