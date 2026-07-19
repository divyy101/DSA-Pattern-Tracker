import { useState, useEffect } from "react";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import {
  Flame,
  RefreshCw,
  Trophy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Award,
  BarChart2,
  Search,
  Zap,
  Star
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function LeetCodeSync() {
  const { user, updateUser, leetcodeStats, setLeetCodeStats, leetcodeLoading, setLeetCodeLoading, setLeetCodeError } = useAppStore();
  const [usernameInput, setUsernameInput] = useState(user?.leetcodeUsername || "");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFetchStats = async (uname) => {
    if (!uname || !uname.trim()) {
      setErrorMsg("Please enter a valid LeetCode username.");
      return;
    }

    try {
      setLeetCodeLoading(true);
      setErrorMsg("");

      const response = await api.get(`/users/leetcode/${uname.trim()}`);
      setLeetCodeStats(response.data);

      if (user?.email && user?.leetcodeUsername !== uname.trim()) {
        try {
          await api.patch("/users/profile", {
            email: user.email,
            leetcodeUsername: uname.trim(),
          });
          updateUser({ leetcodeUsername: uname.trim() });
        } catch {
          // ignore profile patch error
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch LeetCode profile statistics.";
      setErrorMsg(msg);
      setLeetCodeError(msg);
    }
  };

  useEffect(() => {
    if (user?.leetcodeUsername && !leetcodeStats) {
      handleFetchStats(user.leetcodeUsername);
    }
  }, [user?.leetcodeUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchStats(usernameInput);
  };

  const calendarData = leetcodeStats?.submissionCalendar || {};
  const calendarKeys = Object.keys(calendarData).map(Number).sort((a, b) => b - a).slice(0, 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-slide-up">
      
      {/* Broad Top Banner with Cyber Amber Accent */}
      <div className="bg-[#0e1626] border border-slate-800 p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/30 mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              LeetCode Live Sync Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LeetCode Profile & Activity Sync
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Fetch real-time solved statistics, contest rating, streaks, and submission heatmaps.
            </p>
          </div>

          {leetcodeStats && (
            <div className="flex items-center gap-4 bg-[#080d1a] border border-slate-800 p-3 text-xs sm:text-sm font-bold shrink-0">
              <div>
                <span className="text-[0.7rem] text-slate-500 uppercase block">Current Streak</span>
                <span className="text-base font-black text-amber-400 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {leetcodeStats.currentStreak} Days
                </span>
              </div>
              <div className="pl-4 border-l border-slate-800">
                <span className="text-[0.7rem] text-slate-500 uppercase block">Global Ranking</span>
                <span className="text-base font-black text-cyan-400">
                  {leetcodeStats.ranking ? `#${leetcodeStats.ranking.toLocaleString()}` : "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Broad Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter your LeetCode username (e.g. tour_ist)..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#080d1a] border border-slate-800 text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-amber-500/60"
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
                <span>Fetch Live Stats</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Main Stats Display */}
      {leetcodeStats ? (
        <div className="space-y-6">
          
          {/* User Profile Info Card */}
          <div className="bg-[#0e1626] border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={leetcodeStats.avatar}
                alt={leetcodeStats.username}
                className="w-14 h-14 object-cover border-2 border-amber-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{leetcodeStats.realName}</h3>
                  <a
                    href={`https://leetcode.com/${leetcodeStats.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    @{leetcodeStats.username} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Reputation: <strong className="text-amber-400">{leetcodeStats.reputation}</strong> | Acceptance: <strong className="text-cyan-400">{leetcodeStats.acceptanceRate}%</strong>
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              <span>Last Synced: <strong className="text-slate-200">{new Date(leetcodeStats.lastSynced).toLocaleTimeString()}</strong></span>
            </div>
          </div>

          {/* Easy / Medium / Hard Solved Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Easy Solved */}
            <div className="p-5 bg-[#0e1626] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase">
                <span className="text-slate-300">Easy Solved</span>
                <span className="text-emerald-400">{leetcodeStats.easySolved} / {leetcodeStats.totalEasy}</span>
              </div>
              <div className="w-full h-2.5 bg-[#080d1a] border border-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.min(100, (leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100)}%` }} />
              </div>
              <span className="text-xs text-slate-500 block">
                {((leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100).toFixed(1)}% of category
              </span>
            </div>

            {/* Medium Solved */}
            <div className="p-5 bg-[#0e1626] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase">
                <span className="text-slate-300">Medium Solved</span>
                <span className="text-amber-400">{leetcodeStats.mediumSolved} / {leetcodeStats.totalMedium}</span>
              </div>
              <div className="w-full h-2.5 bg-[#080d1a] border border-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(100, (leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100)}%` }} />
              </div>
              <span className="text-xs text-slate-500 block">
                {((leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100).toFixed(1)}% of category
              </span>
            </div>

            {/* Hard Solved */}
            <div className="p-5 bg-[#0e1626] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase">
                <span className="text-slate-300">Hard Solved</span>
                <span className="text-rose-400">{leetcodeStats.hardSolved} / {leetcodeStats.totalHard}</span>
              </div>
              <div className="w-full h-2.5 bg-[#080d1a] border border-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400 transition-all duration-500" style={{ width: `${Math.min(100, (leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100)}%` }} />
              </div>
              <span className="text-xs text-slate-500 block">
                {((leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100).toFixed(1)}% of category
              </span>
            </div>

          </div>

          {/* Submission Heatmap Grid */}
          <div className="p-6 bg-[#0e1626] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Recent Activity Heatmap</h4>
              </div>
              <span className="text-xs text-slate-500">60 Active Days</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
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
                    className={`w-4 h-4 ${bgClass}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Recent Submissions List */}
          {leetcodeStats.recentSubmissions && leetcodeStats.recentSubmissions.length > 0 && (
            <div className="bg-[#0e1626] border border-slate-800 p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recent Submissions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#080d1a] text-slate-400 font-bold border-b border-slate-800 uppercase text-[0.7rem]">
                    <tr>
                      <th className="p-3.5">Problem Title</th>
                      <th className="p-3.5">Language</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {leetcodeStats.recentSubmissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#080d1a]/60 transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          <a
                            href={`https://leetcode.com/problems/${sub.titleSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-amber-400 flex items-center gap-1.5"
                          >
                            <span>{sub.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </a>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">{sub.lang}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 text-xs font-bold border ${
                              sub.statusDisplay === "Accepted"
                                ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-950 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {sub.statusDisplay}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-xs">
                          {sub.timestamp ? new Date(Number(sub.timestamp) * 1000).toLocaleDateString() : "Recent"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-[#0e1626] border border-slate-800 p-12 text-center space-y-4">
          <Flame className="w-12 h-12 text-amber-400 mx-auto" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Connect LeetCode Handle</h3>
            <p className="text-xs text-slate-400">
              Type your LeetCode username above to fetch real-time solved counts, contest rating, and heatmap analytics.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeetCodeSync;
