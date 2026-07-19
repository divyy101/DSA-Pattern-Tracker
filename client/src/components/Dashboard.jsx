import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import api from "../api";
import CountUp from "react-countup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Flame,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  Code2,
  Search,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ArrowUpRight
} from "lucide-react";
import ProblemForm from "./ProblemForm";
import ProblemList from "./ProblemList";

const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Sliding Window",
  "Binary Search",
];

function Dashboard({ problems = [], onRefresh }) {
  const { user, updateUser, leetcodeStats, setLeetCodeStats, leetcodeLoading, setLeetCodeLoading, setLeetCodeError } = useAppStore();
  const [usernameInput, setUsernameInput] = useState(user?.leetcodeUsername || "");
  const [syncError, setSyncError] = useState("");

  const handleSyncLeetCode = async (e) => {
    if (e) e.preventDefault();
    const uname = usernameInput.trim();
    if (!uname) {
      setSyncError("Please enter a valid LeetCode username.");
      return;
    }

    try {
      setLeetCodeLoading(true);
      setSyncError("");

      const response = await api.get(`/users/leetcode/${uname}`);
      setLeetCodeStats(response.data);

      if (user?.email) {
        try {
          await api.patch("/users/profile", {
            email: user.email,
            leetcodeUsername: uname,
          });
          updateUser({ leetcodeUsername: uname });
        } catch {
          // ignore profile patch error
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch LeetCode profile.";
      setSyncError(msg);
      setLeetCodeError(msg);
    }
  };

  useEffect(() => {
    if (user?.leetcodeUsername && !leetcodeStats) {
      handleSyncLeetCode();
    }
  }, [user?.leetcodeUsername]);

  const totalProblems = problems.length;
  const solvedCount = problems.filter((p) => p.status === "Solved").length;
  const overallPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Topic-wise distribution
  const topicStats = TOPICS.map((topic) => {
    const topicProblems = problems.filter((p) => p.pattern.toLowerCase().includes(topic.toLowerCase()));
    const topicSolved = topicProblems.filter((p) => p.status === "Solved").length;
    const pct = topicProblems.length > 0 ? Math.round((topicSolved / topicProblems.length) * 100) : 0;
    return {
      name: topic,
      total: topicProblems.length,
      solved: topicSolved,
      percentage: pct,
    };
  });

  const streak = leetcodeStats?.currentStreak || (solvedCount > 0 ? 3 : 0);
  const productivityScore = Math.min(100, Math.round((solvedCount * 4) + (streak * 5) + (overallPercentage * 0.4)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-slide-up">
      
      {/* Sleek Square Header Banner */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-none p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Welcome back, <span className="text-cyan-400 font-bold">{user?.name || "Coder"}</span>
            </p>
          </div>

          {/* Broad LeetCode Sync Input Form */}
          <div className="w-full lg:w-auto shrink-0 bg-[#080d1a] border border-slate-800 p-3 rounded-none">
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              LeetCode Integration
            </span>
            <form onSubmit={handleSyncLeetCode} className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter LeetCode username..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0e1626] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                />
              </div>
              <button
                type="submit"
                disabled={leetcodeLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-none shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all shrink-0"
              >
                {leetcodeLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>Sync LeetCode</span>
                  </>
                )}
              </button>
            </form>

            {syncError && (
              <p className="text-[0.7rem] text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {syncError}
              </p>
            )}

            {leetcodeStats && (
              <div className="mt-2 text-[0.68rem] text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synced @{leetcodeStats.username} ({leetcodeStats.totalSolved} solved)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Square Stats Counter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Problems Card */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">Tracked Problems</span>
            <span className="block text-2xl font-black text-white mt-1">
              <CountUp end={totalProblems} duration={1.2} />
            </span>
            <span className="text-[0.7rem] text-slate-500">Categorized patterns</span>
          </div>
          <div className="w-9 h-9 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Code2 className="w-4 h-4" />
          </div>
        </div>

        {/* Solved Problems Card */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">Solved Count</span>
            <span className="block text-2xl font-black text-emerald-400 mt-1">
              <CountUp end={solvedCount} duration={1.2} />
            </span>
            <span className="text-[0.7rem] text-slate-500">{overallPercentage}% completion rate</span>
          </div>
          <div className="w-9 h-9 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* LeetCode Total Solved */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">LeetCode Solved</span>
            <span className="block text-2xl font-black text-amber-400 mt-1">
              <CountUp end={leetcodeStats?.totalSolved || 0} duration={1.5} />
            </span>
            <span className="text-[0.7rem] text-slate-500">
              {leetcodeStats ? `Easy: ${leetcodeStats.easySolved} | Med: ${leetcodeStats.mediumSolved} | Hard: ${leetcodeStats.hardSolved}` : "Connect above to sync"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        {/* Productivity Score */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">Productivity Score</span>
            <span className="block text-2xl font-black text-purple-400 mt-1">
              <CountUp end={productivityScore} duration={1.5} /> / 100
            </span>
            <span className="text-[0.7rem] text-slate-500">Streak: {streak} days</span>
          </div>
          <div className="w-9 h-9 rounded-none bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* LeetCode Live Details Grid (If Synced) */}
      {leetcodeStats && (
        <div className="bg-[#0e1626] border border-slate-800 rounded-none p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Live LeetCode Metrics (@{leetcodeStats.username})</h3>
            </div>
            <a
              href={`https://leetcode.com/${leetcodeStats.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              View LeetCode Profile <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#080d1a] border border-slate-800 rounded-none">
              <span className="text-slate-500 block text-[0.65rem] uppercase">Easy Solved</span>
              <span className="text-base font-bold text-emerald-400">{leetcodeStats.easySolved}</span>
            </div>
            <div className="p-3 bg-[#080d1a] border border-slate-800 rounded-none">
              <span className="text-slate-500 block text-[0.65rem] uppercase">Medium Solved</span>
              <span className="text-base font-bold text-amber-400">{leetcodeStats.mediumSolved}</span>
            </div>
            <div className="p-3 bg-[#080d1a] border border-slate-800 rounded-none">
              <span className="text-slate-500 block text-[0.65rem] uppercase">Hard Solved</span>
              <span className="text-base font-bold text-rose-400">{leetcodeStats.hardSolved}</span>
            </div>
            <div className="p-3 bg-[#080d1a] border border-slate-800 rounded-none">
              <span className="text-slate-500 block text-[0.65rem] uppercase">Acceptance Rate</span>
              <span className="text-base font-bold text-cyan-400">{leetcodeStats.acceptanceRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Topic-Wise Progress Breakdown */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-none p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Topic-Wise Progress</h3>
          <span className="text-xs text-slate-400">10 Core Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topicStats.map((t) => (
            <div key={t.name} className="p-3 bg-[#080d1a] border border-slate-800 rounded-none space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">{t.name}</span>
                <span className="text-cyan-400">{t.solved} / {t.total} ({t.percentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-none overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-none transition-all duration-500"
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Form Drawer Trigger */}
      <ProblemForm onAdd={onRefresh} />

      {/* Main Problems Tracker Table */}
      <ProblemList
        problems={problems}
        onDelete={onRefresh}
        onUpdate={onRefresh}
      />

    </div>
  );
}

export default Dashboard;
