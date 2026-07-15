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
              <div className="flex-1 bg-gradient-to-br from-[#060911] via-[#0c1024] to-[#080c18] min-h-[calc(100vh-52px)]">
                <main className="max-w-[960px] mx-auto px-5 py-8 pb-14">
                  <div className="animate-page-ease-in" key="dashboard">
                    
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden bg-[#0c1024]/60 backdrop-blur-3xl border border-white/[0.1] rounded-3xl p-7 md:p-10 mb-8 group shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)] hover:border-white/[0.15]">
                      <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:translate-x-4 group-hover:scale-110" />
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-500/6 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold bg-violet-500/[0.08] text-violet-300 border border-violet-500/15 mb-4 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Progress Active
                          </div>
                          <h2 className="text-[1.3rem] md:text-[2rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-violet-300 mb-2 tracking-tight drop-shadow-md">
                            Welcome back, {user?.name || "Coder"}!
                          </h2>
                          <p className="text-[0.85rem] text-slate-400 max-w-xl font-medium">
                            Keep grinding — every problem you solve gets you closer to cracking the next interview.
                          </p>
                        </div>
                        <div className="hidden md:flex flex-col items-end shrink-0">
                          <span className="text-[0.7rem] text-slate-500 font-semibold uppercase tracking-wider mb-1">Completion</span>
                          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 leading-none drop-shadow-[0_2px_8px_rgba(139,92,246,0.3)]">{percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                      <div className="group relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(59,130,246,0.08)] hover:border-blue-500/20 p-5 rounded-2xl border border-white/[0.06] bg-[#0c1024]/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.7rem] font-semibold text-slate-500 tracking-wider uppercase">Total Problems</span>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/[0.08] border border-blue-500/12">
                            <svg className="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                          </div>
                        </div>
                        <span className="block text-[2rem] font-black text-slate-100 group-hover:text-blue-400 transition-colors duration-300 leading-none">{problems.length}</span>
                        <span className="block text-[0.72rem] font-medium text-slate-600 mt-1.5">Categorized patterns</span>
                      </div>

                      <div className="group relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,185,129,0.08)] hover:border-emerald-500/20 p-5 rounded-2xl border border-white/[0.06] bg-[#0c1024]/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.7rem] font-semibold text-slate-500 tracking-wider uppercase">Solved</span>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/[0.08] border border-emerald-500/12">
                            <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                          </div>
                        </div>
                        <span className="block text-[2rem] font-black text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 leading-none">{solvedCount}</span>
                        <span className="block text-[0.72rem] font-medium text-slate-600 mt-1.5">
                          {problems.length > 0 ? `${Math.round((solvedCount / problems.length) * 100)}% of total` : "No problems"}
                        </span>
                      </div>

                      <div className="group relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(244,63,94,0.08)] hover:border-rose-500/20 p-5 rounded-2xl border border-white/[0.06] bg-[#0c1024]/60 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.7rem] font-semibold text-slate-500 tracking-wider uppercase">Unsolved</span>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/[0.08] border border-rose-500/12">
                            <svg className="w-4.5 h-4.5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                        <span className="block text-[2rem] font-black text-slate-100 group-hover:text-rose-400 transition-colors duration-300 leading-none">{problems.length - solvedCount}</span>
                        <span className="block text-[0.72rem] font-medium text-slate-600 mt-1.5">Pending review</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {problems.length > 0 && (
                      <div className="mb-7 bg-[#0c1024]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                            <span className="text-[0.72rem] font-semibold text-slate-400 tracking-wider uppercase">Progress</span>
                          </div>
                          <span className="text-[0.85rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{percentage}% Complete</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.04]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] relative shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 overflow-hidden rounded-full">
                              <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-[0.65rem] text-slate-600 font-semibold uppercase tracking-widest">
                          <span>Begin</span>
                          <span>Intermediate</span>
                          <span>Master</span>
                        </div>
                      </div>
                    )}

                    <ProblemForm onAdd={fetchProblems} />

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-7">
                      <div className="relative flex-1 group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                        <input
                          placeholder="Search by problem name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                        />
                      </div>
                      <div className="relative group min-w-[200px]">
                        <select
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] cursor-pointer appearance-none"
                        >
                          {PATTERNS.map((p) => (
                            <option key={p} className="bg-[#0c1024] text-slate-200">{p === "All" ? "Filter by Pattern (All)" : p}</option>
                          ))}
                        </select>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
              <div className="flex-1 bg-gradient-to-br from-[#060911] via-[#0c1024] to-[#080c18] min-h-[calc(100vh-52px)]">
                <main className="max-w-[960px] mx-auto px-5 py-8 pb-14">
                  <div className="animate-page-ease-in" key="problems">
                    <div className="mb-7 animate-slide-in-left flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-violet-500/[0.08] border border-violet-500/12 flex items-center justify-center">
                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-[1.4rem] font-extrabold text-slate-100 tracking-tight">{user?.name || "Coder"}'s Problems</h1>
                        <p className="text-[0.8rem] text-slate-500 font-medium">
                          View your list of solved and unsolved problems.
                        </p>
                      </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-7">
                      <div className="relative flex-1 group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                        <input
                          placeholder="Search by problem name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                        />
                      </div>
                      <div className="relative group min-w-[200px]">
                        <select
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] cursor-pointer appearance-none"
                        >
                          {PATTERNS.map((p) => (
                            <option key={p} className="bg-[#0c1024] text-slate-200">{p === "All" ? "Filter by Pattern (All)" : p}</option>
                          ))}
                        </select>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
