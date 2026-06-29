import { useState, useEffect } from "react";
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
  const [page, setPage] = useState(() => (localStorage.getItem("isLoggedIn") === "true" ? "dashboard" : "home"));

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
    setPage("dashboard");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setPage("home");
  }

  return (
    <div className="min-h-screen bg-[url('/bg-3d.png')] bg-cover bg-center bg-fixed bg-no-repeat">
      {isLoggedIn && (
        <Navbar activePage={page} onNavigate={setPage} onLogout={handleLogout} />
      )}

      {isLoggedIn ? (
        <main className="max-w-[920px] mx-auto px-5 py-7 pb-12">
          {page === "home" && (
            <Home isLoggedIn={isLoggedIn} onNavigate={setPage} />
          )}

          {page === "login" && (
            <Login onLogin={handleLogin} onNavigate={setPage} />
          )}

          {page === "register" && (
            <Register onNavigate={setPage} />
          )}

          {page === "dashboard" && (
            <div className="animate-page-ease-in" key="dashboard">
              <div className="animate-fade-slide-up bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/20 rounded-xl px-7 py-6 mb-6 hover:border-violet-500/35 hover:shadow-[0_2px_16px_rgba(139,92,246,0.08)] transition-all duration-300">
                <h2 className="text-[1.2rem] font-bold text-slate-200 mb-1">👋 Welcome back!</h2>
                <p className="text-[0.88rem] text-slate-400">
                  Keep grinding — every problem you solve gets you closer to
                  cracking the next interview. 💪
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="group transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)] hover:border-violet-500/30 p-4.5 rounded-xl border border-violet-500/15 bg-[#0f1428]/70 backdrop-blur-md animate-fade-slide-up delay-50 border-t-[3px] border-t-blue-400">
                  <span className="block text-[1.85rem] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 text-blue-400">{problems.length}</span>
                  <span className="block text-[0.78rem] font-medium text-slate-400 mt-0.5">Total Problems</span>
                </div>
                <div className="group transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)] hover:border-violet-500/30 p-4.5 rounded-xl border border-violet-500/15 bg-[#0f1428]/70 backdrop-blur-md animate-fade-slide-up delay-100 border-t-[3px] border-t-emerald-400">
                  <span className="block text-[1.85rem] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 text-emerald-400">{solvedCount}</span>
                  <span className="block text-[0.78rem] font-medium text-slate-400 mt-0.5">Solved</span>
                </div>
                <div className="group transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)] hover:border-violet-500/30 p-4.5 rounded-xl border border-violet-500/15 bg-[#0f1428]/70 backdrop-blur-md animate-fade-slide-up delay-200 border-t-[3px] border-t-pink-400">
                  <span className="block text-[1.85rem] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 text-pink-400">{problems.length - solvedCount}</span>
                  <span className="block text-[0.78rem] font-medium text-slate-400 mt-0.5">Unsolved</span>
                </div>
              </div>

              {problems.length > 0 && (
                <div className="mb-6 bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl p-5 hover:border-violet-500/30 hover:shadow-[0_2px_16px_rgba(139,92,246,0.08)] transition-all duration-300 animate-fade-slide-up delay-[80ms]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[0.8rem] font-medium text-slate-400">Your Progress</span>
                    <strong className="text-[0.8rem] font-bold text-emerald-400">{percentage}% solved</strong>
                  </div>
                  <div className="w-full h-2.5 bg-violet-500/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}

              <ProblemForm onAdd={fetchProblems} />

              <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-slide-up delay-[150ms]">
                <input
                  placeholder="🔍  Search problems..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
                />
                <select
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-indigo-950 text-slate-200">{p}</option>
                  ))}
                </select>
              </div>

              <ProblemList
                problems={filteredProblems}
                onDelete={fetchProblems}
                onUpdate={fetchProblems}
              />
            </div>
          )}

          {page === "problems" && (
            <div className="animate-page-ease-in" key="problems">
              <div className="mb-6 animate-slide-in-left">
                <h1 className="text-2xl font-bold text-slate-200 mb-1">📋 All Problems</h1>
                <p className="text-[0.88rem] text-slate-400">
                  Browse, search, and manage all your tracked DSA problems.
                </p>
              </div>

              <ProblemForm onAdd={fetchProblems} />

              <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-slide-up">
                <input
                  placeholder="🔍  Search problems..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
                />
                <select
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-indigo-950 text-slate-200">{p}</option>
                  ))}
                </select>
              </div>

              <ProblemList
                problems={filteredProblems}
                onDelete={fetchProblems}
                onUpdate={fetchProblems}
              />
            </div>
          )}

          {page === "about" && (
            <div className="animate-page-ease-in" key="about">
              <About />
            </div>
          )}
        </main>
      ) : (
        <>
          {page === "login" ? (
            <Login onLogin={handleLogin} onNavigate={setPage} />
          ) : page === "register" ? (
            <Register onNavigate={setPage} />
          ) : (
            <Home isLoggedIn={isLoggedIn} onNavigate={setPage} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
