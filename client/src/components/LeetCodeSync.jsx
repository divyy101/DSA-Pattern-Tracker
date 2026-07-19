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
  UserCheck,
  Sparkles,
  Search
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

      // Save handle to user profile if logged in
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
      const msg = err.response?.data?.message || "Failed to sync LeetCode statistics.";
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

  // Process activity heatmap dates
  const calendarData = leetcodeStats?.submissionCalendar || {};
  const calendarKeys = Object.keys(calendarData).map(Number).sort((a, b) => b - a).slice(0, 60);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0B1120] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5" />
              LeetCode Live GraphQL Proxy
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LeetCode Profile Sync
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Connect your LeetCode handle to automatically fetch real-time problem metrics, contest rating, streaks, and submission calendar.
            </p>
          </div>

          {/* Username Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="LeetCode username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={leetcodeLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all shrink-0"
            >
              {leetcodeLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync</span>
                </>
              )}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Stats Display */}
      {leetcodeStats ? (
        <div className="space-y-8">
          
          {/* User Overview Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={leetcodeStats.avatar}
                alt={leetcodeStats.username}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{leetcodeStats.realName}</h3>
                  <a
                    href={`https://leetcode.com/${leetcodeStats.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    @{leetcodeStats.username}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  {leetcodeStats.ranking && <span>Global Rank: #{leetcodeStats.ranking.toLocaleString()}</span>}
                  <span>Reputation: {leetcodeStats.reputation}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <div className="text-right">
                <span className="block text-[0.65rem] text-slate-500 uppercase">Current Streak</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {leetcodeStats.currentStreak} Days
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-800">
                <span className="block text-[0.65rem] text-slate-500 uppercase">Last Synced</span>
                <span className="text-xs font-mono text-slate-300">
                  {new Date(leetcodeStats.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Stat Cards Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Total Solved Card with Circular Progress */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 shrink-0">
                <CircularProgressbar
                  value={leetcodeStats.totalSolved}
                  maxValue={3100}
                  text={`${leetcodeStats.totalSolved}`}
                  styles={buildStyles({
                    textColor: '#FFFFFF',
                    pathColor: '#F5C86B',
                    trailColor: '#1E293B',
                    textSize: '22px',
                  })}
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Solved</span>
                <span className="block text-xl font-extrabold text-white mt-0.5">{leetcodeStats.totalSolved}</span>
                <span className="text-[0.7rem] text-slate-500 font-medium">Out of ~3,100 problems</span>
              </div>
            </div>

            {/* Easy Solved */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Easy Problems</span>
                <span className="text-emerald-400">{leetcodeStats.easySolved} / {leetcodeStats.totalEasy}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100)}%` }}
                />
              </div>
              <span className="text-[0.7rem] text-slate-500 block">
                {((leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100).toFixed(1)}% of category solved
              </span>
            </div>

            {/* Medium Solved */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Medium Problems</span>
                <span className="text-amber-400">{leetcodeStats.mediumSolved} / {leetcodeStats.totalMedium}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100)}%` }}
                />
              </div>
              <span className="text-[0.7rem] text-slate-500 block">
                {((leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100).toFixed(1)}% of category solved
              </span>
            </div>

            {/* Hard Solved */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Hard Problems</span>
                <span className="text-rose-400">{leetcodeStats.hardSolved} / {leetcodeStats.totalHard}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100)}%` }}
                />
              </div>
              <span className="text-[0.7rem] text-slate-500 block">
                {((leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100).toFixed(1)}% of category solved
              </span>
            </div>

          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Acceptance Rate</span>
                <span className="block text-2xl font-black text-cyan-400 mt-1">{leetcodeStats.acceptanceRate}%</span>
              </div>
              <BarChart2 className="w-8 h-8 text-cyan-500/40" />
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Contest Rating</span>
                <span className="block text-2xl font-black text-amber-400 mt-1">
                  {leetcodeStats.contestRating ? leetcodeStats.contestRating : "N/A"}
                </span>
              </div>
              <Trophy className="w-8 h-8 text-amber-500/40" />
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Contests Attended</span>
                <span className="block text-2xl font-black text-purple-400 mt-1">{leetcodeStats.attendedContests}</span>
              </div>
              <Award className="w-8 h-8 text-purple-500/40" />
            </div>
          </div>

          {/* Submission Heatmap Grid */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Recent Activity Heatmap</h4>
              </div>
              <span className="text-xs text-slate-500">Last 60 Active Days</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {calendarKeys.length > 0 ? (
                calendarKeys.map((ts) => {
                  const count = calendarData[ts] || 0;
                  const bgClass =
                    count >= 4
                      ? "bg-amber-400"
                      : count >= 2
                      ? "bg-amber-500/70"
                      : count >= 1
                      ? "bg-amber-600/40"
                      : "bg-slate-800";

                  const dateStr = new Date(ts * 1000).toLocaleDateString();

                  return (
                    <div
                      key={ts}
                      title={`${dateStr}: ${count} submissions`}
                      className={`w-4 h-4 rounded-sm ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
                    />
                  );
                })
              ) : (
                <p className="text-xs text-slate-500">No submission history available.</p>
              )}
            </div>
          </div>

          {/* Recent Submissions List */}
          {leetcodeStats.recentSubmissions && leetcodeStats.recentSubmissions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white">Recent LeetCode Submissions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[0.65rem]">
                    <tr>
                      <th className="p-3">Problem Title</th>
                      <th className="p-3">Language</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leetcodeStats.recentSubmissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-200">
                          <a
                            href={`https://leetcode.com/problems/${sub.titleSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-amber-400 hover:underline flex items-center gap-1.5"
                          >
                            <span>{sub.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{sub.lang}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[0.65rem] font-bold ${
                              sub.statusDisplay === "Accepted"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {sub.statusDisplay}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
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
        /* Empty State / Connect Prompt */
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Flame className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">No LeetCode Handle Connected</h3>
            <p className="text-xs text-slate-400">
              Enter your LeetCode username above to fetch real-time solved statistics, contest rating, and heatmap analytics.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeetCodeSync;
