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
  Calendar,
  BarChart2,
  ArrowUpRight
} from "lucide-react";
import ProblemForm from "./ProblemForm";
import ProblemList from "./ProblemList";

// Default Standard DSA Pattern Problem Set so dashboard is NEVER blank
const DEFAULT_SAMPLE_PROBLEMS = [
  { _id: "def-1", problemName: "Two Sum", pattern: "Arrays", difficulty: "Easy", status: "Solved", notes: "Use HashMap for O(N) time complexity." },
  { _id: "def-2", problemName: "Best Time to Buy and Sell Stock", pattern: "Arrays", difficulty: "Easy", status: "Solved", notes: "Track minimum price and maximum profit." },
  { _id: "def-3", problemName: "3Sum", pattern: "Two Pointers", difficulty: "Medium", status: "Attempted", notes: "Sort array first, then use 2 pointers for sub-target." },
  { _id: "def-4", problemName: "Container With Most Water", pattern: "Two Pointers", difficulty: "Medium", status: "Solved", notes: "Two pointers at start and end. Move shorter pointer." },
  { _id: "def-5", problemName: "Longest Substring Without Repeating Characters", pattern: "Sliding Window", difficulty: "Medium", status: "Solved", notes: "Maintain character index map for window shrink." },
  { _id: "def-6", problemName: "Valid Anagram", pattern: "Strings", difficulty: "Easy", status: "Solved", notes: "Frequency array or hash table comparison." },
  { _id: "def-7", problemName: "Reverse Linked List", pattern: "Linked Lists", difficulty: "Easy", status: "Solved", notes: "Iterative 3 pointers: prev, curr, next." },
  { _id: "def-8", problemName: "Binary Tree Inorder Traversal", pattern: "Trees", difficulty: "Easy", status: "Solved", notes: "Left -> Root -> Right traversal." },
  { _id: "def-9", problemName: "Course Schedule", pattern: "Graphs", difficulty: "Medium", status: "Revision", notes: "Topological Sort using Kahn's algorithm or DFS cycle detection." },
  { _id: "def-10", problemName: "Longest Increasing Subsequence", pattern: "Dynamic Programming", difficulty: "Medium", status: "Revision", notes: "DP array or Binary Search + Patience Sorting O(N log N)." },
];

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

  // Use DB problems if available, otherwise default standard set to prevent blank screen
  const activeProblems = problems.length > 0 ? problems : DEFAULT_SAMPLE_PROBLEMS;

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
          // ignore error
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

  const totalProblems = activeProblems.length;
  const solvedCount = activeProblems.filter((p) => p.status === "Solved").length;
  const overallPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Topic-wise progress calculation
  const topicStats = TOPICS.map((topic) => {
    const topicProblems = activeProblems.filter((p) => p.pattern.toLowerCase().includes(topic.toLowerCase()));
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

  // Calendar dates if synced
  const calendarData = leetcodeStats?.submissionCalendar || {};
  const calendarKeys = Object.keys(calendarData).map(Number).sort((a, b) => b - a).slice(0, 40);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-slide-up">
      
      {/* Dashboard Top Header & LeetCode Broad Form */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-none p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              DSA & Placement Dashboard
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Coder: <span className="text-cyan-400 font-bold">{user?.name || "Student"}</span> | Target Role: <span className="text-amber-400 font-bold">{user?.targetCompany || "FAANG / SDE-1"}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#080d1a] border border-slate-800 p-3 rounded-none text-xs sm:text-sm font-bold">
            <div>
              <span className="text-[0.7rem] text-slate-500 uppercase block">Daily Streak</span>
              <span className="text-base font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                {streak} Days
              </span>
            </div>
            <div className="pl-4 border-l border-slate-800">
              <span className="text-[0.7rem] text-slate-500 uppercase block">Pattern Mastery</span>
              <span className="text-base font-black text-cyan-400">
                {overallPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* LeetCode Sync Broad Form Section */}
        <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Connect & Sync LeetCode Profile
            </span>
            {leetcodeStats && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Synced: @{leetcodeStats.username}
              </span>
            )}
          </div>

          <form onSubmit={handleSyncLeetCode} className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter your LeetCode username (e.g. tour_ist)..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0e1626] border border-slate-800 rounded-none text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
            <button
              type="submit"
              disabled={leetcodeLoading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs sm:text-sm rounded-none shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all shrink-0"
            >
              {leetcodeLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Fetch LeetCode Live</span>
                </>
              )}
            </button>
          </form>

          {syncError && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {syncError}
            </p>
          )}
        </div>
      </div>

      {/* Main Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tracked Problems */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracked Problems</span>
            <Code2 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="block text-3xl font-black text-white">
            <CountUp end={totalProblems} duration={1.2} />
          </span>
          <span className="text-xs text-slate-500 font-medium">Standard & custom problems</span>
        </div>

        {/* Card 2: Solved Problems */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solved Count</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="block text-3xl font-black text-emerald-400">
            <CountUp end={solvedCount} duration={1.2} />
          </span>
          <span className="text-xs text-slate-500 font-medium">{overallPercentage}% completion rate</span>
        </div>

        {/* Card 3: LeetCode Live Total */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LeetCode Solved</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <span className="block text-3xl font-black text-amber-400">
            <CountUp end={leetcodeStats?.totalSolved || 0} duration={1.5} />
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {leetcodeStats ? `Easy: ${leetcodeStats.easySolved} | Med: ${leetcodeStats.mediumSolved} | Hard: ${leetcodeStats.hardSolved}` : "Sync LeetCode handle above"}
          </span>
        </div>

        {/* Card 4: Productivity Score */}
        <div className="p-5 bg-[#0e1626] border border-slate-800 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Productivity Score</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <span className="block text-3xl font-black text-purple-400">
            <CountUp end={productivityScore} duration={1.5} /> / 100
          </span>
          <span className="text-xs text-slate-500 font-medium">Based on velocity & streak</span>
        </div>

      </div>

      {/* Embedded Full LeetCode Live Details (If Synced) */}
      {leetcodeStats && (
        <div className="bg-[#0e1626] border border-slate-800 rounded-none p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <img
                src={leetcodeStats.avatar}
                alt={leetcodeStats.username}
                className="w-10 h-10 rounded-none object-cover border border-amber-500/40"
              />
              <div>
                <h3 className="text-base font-bold text-white">{leetcodeStats.realName}</h3>
                <a
                  href={`https://leetcode.com/${leetcodeStats.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  @{leetcodeStats.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              <span>Acceptance Rate: <strong className="text-cyan-400">{leetcodeStats.acceptanceRate}%</strong></span>
              {leetcodeStats.ranking && <span className="ml-4">Global Rank: <strong className="text-amber-400">#{leetcodeStats.ranking.toLocaleString()}</strong></span>}
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="text-slate-300">Easy Solved</span>
                <span className="text-emerald-400">{leetcodeStats.easySolved} / {leetcodeStats.totalEasy}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-none overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100)}%` }} />
              </div>
            </div>

            <div className="p-4 bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="text-slate-300">Medium Solved</span>
                <span className="text-amber-400">{leetcodeStats.mediumSolved} / {leetcodeStats.totalMedium}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-none overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100)}%` }} />
              </div>
            </div>

            <div className="p-4 bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="text-slate-300">Hard Solved</span>
                <span className="text-rose-400">{leetcodeStats.hardSolved} / {leetcodeStats.totalHard}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-none overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: `${Math.min(100, (leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Submission Heatmap Grid */}
          <div className="p-4 bg-[#080d1a] border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white block">Recent Activity Heatmap</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {calendarKeys.map((ts) => {
                const count = calendarData[ts] || 0;
                const bgClass =
                  count >= 4
                    ? "bg-amber-400"
                    : count >= 2
                    ? "bg-amber-500/70"
                    : count >= 1
                    ? "bg-amber-600/40"
                    : "bg-slate-800";
                return (
                  <div
                    key={ts}
                    title={`${new Date(ts * 1000).toLocaleDateString()}: ${count} submissions`}
                    className={`w-3.5 h-3.5 ${bgClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Topic-Wise Progress Breakdown */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-none p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Topic-Wise Progress</h3>
          <span className="text-xs text-slate-400 font-semibold">10 Algorithm Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topicStats.map((t) => (
            <div key={t.name} className="p-3.5 bg-[#080d1a] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-200">{t.name}</span>
                <span className="text-cyan-400">{t.solved} / {t.total} ({t.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-none overflow-hidden">
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
        problems={activeProblems}
        onDelete={onRefresh}
        onUpdate={onRefresh}
      />

    </div>
  );
}

export default Dashboard;
