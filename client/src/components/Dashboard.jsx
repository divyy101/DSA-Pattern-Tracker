import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
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
  BookOpen,
  ArrowUpRight,
  Code2,
  Calendar,
  Sparkles,
  ChevronRight
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
  const { user, leetcodeStats } = useAppStore();

  const totalProblems = problems.length;
  const solvedCount = problems.filter((p) => p.status === "Solved").length;
  const unsolvedCount = totalProblems - solvedCount;
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

  // Calculate Productivity Score (0-100)
  const streak = leetcodeStats?.currentStreak || (solvedCount > 0 ? 3 : 0);
  const dailyGoal = user?.dailyGoal || 2;
  const productivityScore = Math.min(100, Math.round((solvedCount * 4) + (streak * 5) + (overallPercentage * 0.4)));

  // Achievements
  const achievements = [
    { title: "First Step", desc: "Track your first problem", icon: Sparkles, unlocked: totalProblems > 0 },
    { title: "Streak Master", desc: "Maintain 3+ day streak", icon: Flame, unlocked: streak >= 3 },
    { title: "Half Century", desc: "Solve 50+ problems", icon: Trophy, unlocked: (solvedCount + (leetcodeStats?.totalSolved || 0)) >= 50 },
    { title: "DP Explorer", desc: "Solve 5 DP problems", icon: Zap, unlocked: problems.filter((p) => p.pattern === "Dynamic Programming" && p.status === "Solved").length >= 5 },
    { title: "LeetCode Connected", desc: "Sync live stats", icon: CheckCircle2, unlocked: !!leetcodeStats },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-[#0B1120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Placement Sprint
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Coder"}! 👋
            </h1>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Target Company: <span className="text-cyan-400 font-bold">{user?.targetCompany || "FAANG / Top Tech"}</span>. Stay consistent — every problem gets you closer to cracking your interviews.
            </p>
          </div>

          {/* Quick Streak & Completion Header Card */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 shrink-0">
            <div className="w-14 h-14 shrink-0">
              <CircularProgressbar
                value={overallPercentage}
                text={`${overallPercentage}%`}
                styles={buildStyles({
                  textColor: '#22D3EE',
                  pathColor: '#22D3EE',
                  trailColor: '#1E293B',
                  textSize: '24px',
                })}
              />
            </div>
            <div>
              <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider block">Pattern Completion</span>
              <span className="text-lg font-black text-white block">
                <CountUp end={solvedCount} duration={1.5} /> / {totalProblems}
              </span>
              <span className="text-[0.7rem] text-cyan-400 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                {streak} Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Problems */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md hover:border-cyan-500/30 transition-all">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Tracked Problems</span>
            <span className="block text-3xl font-black text-white mt-1">
              <CountUp end={totalProblems} duration={1.2} />
            </span>
            <span className="text-[0.7rem] text-slate-500 font-medium">Across all patterns</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Solved Problems */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md hover:border-emerald-500/30 transition-all">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Solved Count</span>
            <span className="block text-3xl font-black text-emerald-400 mt-1">
              <CountUp end={solvedCount} duration={1.2} />
            </span>
            <span className="text-[0.7rem] text-slate-500 font-medium">
              {overallPercentage}% completion rate
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Productivity Score */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md hover:border-purple-500/30 transition-all">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Productivity Score</span>
            <span className="block text-3xl font-black text-purple-400 mt-1">
              <CountUp end={productivityScore} duration={1.5} /> / 100
            </span>
            <span className="text-[0.7rem] text-slate-500 font-medium">Based on velocity & streak</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: LeetCode Total Solved */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md hover:border-amber-500/30 transition-all">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">LeetCode Solved</span>
            <span className="block text-3xl font-black text-amber-400 mt-1">
              <CountUp end={leetcodeStats?.totalSolved || 0} duration={1.5} />
            </span>
            <Link to="/leetcode" className="text-[0.7rem] text-amber-400 font-semibold hover:underline flex items-center gap-1">
              <span>View LeetCode Sync</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Topic-Wise Progress Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Topic-Wise Mastery</h3>
            <p className="text-xs text-slate-400">Progress across core placement algorithms</p>
          </div>
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/20">
            10 Topics Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicStats.map((t) => (
            <div key={t.name} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">{t.name}</span>
                <span className="text-cyan-400">{t.solved} / {t.total} ({t.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Milestone Badges</h3>
          </div>
          <span className="text-xs text-slate-400">Unlocked: {achievements.filter(a => a.unlocked).length} / {achievements.length}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {achievements.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                  badge.unlocked
                    ? "bg-amber-500/10 border-amber-500/30 text-white"
                    : "bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-60"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${badge.unlocked ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-600"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{badge.title}</h4>
                  <p className="text-[0.65rem] text-slate-400 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem Form Drawer Trigger */}
      <ProblemForm onAdd={onRefresh} />

      {/* Main Problems Tracker Table Preview */}
      <ProblemList
        problems={problems}
        onDelete={onRefresh}
        onUpdate={onRefresh}
      />

    </div>
  );
}

export default Dashboard;
