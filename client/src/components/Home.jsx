import { Link } from "react-router-dom";
import {
  Code2,
  Sparkles,
  Flame,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Trophy,
  Users,
  ShieldCheck,
  Star,
  Layers,
  GraduationCap
} from "lucide-react";

function Home({ isLoggedIn }) {
  const stats = [
    { label: "DSA Patterns Covered", value: "15+", icon: Layers },
    { label: "Student Users Tracked", value: "10,000+", icon: Users },
    { label: "Problems Synced Daily", value: "50,000+", icon: Flame },
    { label: "Target Placement Rate", value: "94.8%", icon: Trophy },
  ];

  const features = [
    {
      title: "LeetCode Live Sync",
      desc: "Connect your LeetCode handle to fetch real-time solved counts (Easy, Medium, Hard), acceptance rate, contest rating, and heatmap.",
      icon: Flame,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Pattern-First Organization",
      desc: "Track problems categorized by core DSA patterns (Arrays, Sliding Window, Two Pointers, Trees, Graphs, Dynamic Programming, Greedy).",
      icon: Layers,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Multi-View Problem Management",
      desc: "Switch effortlessly between Kanban board, responsive Table view with TanStack Table, and Grid cards. Sort, filter, and bulk update.",
      icon: Code2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Deep Analytics & Graphs",
      desc: "Visualize weekly coding velocity, monthly trends, topic mastery radar, difficulty distributions, and active daily streak heatmaps.",
      icon: BarChart3,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Spaced Repetition & Notes",
      desc: "Attach custom implementation notes, complexity analyses, and revision flags to ensure long-term retention before interviews.",
      icon: Zap,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Resume Export & Command Palette",
      desc: "Export your DSA progress report as a formatted PDF for placement resumes. Navigate instantly using keyboard shortcut Ctrl+K.",
      icon: Target,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Rohan Sharma",
      role: "SDE Intern @ Amazon",
      quote: "DSA Pattern Tracker transformed my preparation. Focusing on patterns instead of random problems gave me the confidence to crack Amazon's OA.",
      avatar: "R",
    },
    {
      name: "Ananya Verma",
      role: "Incoming SE @ Microsoft",
      quote: "The LeetCode live sync and submission heatmap kept me accountable every single day. The UI feels like a high-end engineering dashboard.",
      avatar: "A",
    },
    {
      name: "Priyansh Gupta",
      role: "6-Star Rated Student Coder",
      quote: "The Kanban board for revision status is a lifesaver right before placement week. I could review 50 DP problems in 2 hours.",
      avatar: "P",
    },
  ];

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern border-b border-slate-800/80">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-6 animate-fade-slide-up">
            <Sparkles className="w-3.5 h-3.5" />
            Built for Placement Season 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6 animate-fade-slide-up">
            Master Every DSA Pattern. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-300">
              Track Your SDE Readiness.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8 animate-fade-slide-up">
            The student-first platform for tracking Data Structures & Algorithms progress. Connect your LeetCode profile, visualize pattern completion, and streamline revisions for campus placements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-slide-up">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs text-white shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs text-white shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Start Tracking Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 font-bold text-xs text-slate-300 hover:text-white transition-all"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Live Stats Ticker Bar */}
      <section className="py-8 bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <span className="block text-2xl font-extrabold text-white">{item.value}</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why DSA Tracker Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why Pattern-Based Prep Works
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Solving 500 random problems causes burnout. Mastering 15 core patterns empowers you to solve any new unseen problem in coding rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">Identify the Blueprint</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn how to recognize Sliding Window, Two Pointers, Monotonic Stack, or Topological Sort within 30 seconds of reading a problem statement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">Track Real-time Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sync automatically with your LeetCode profile to keep your streak alive and monitor difficulty distribution across Easy, Medium, and Hard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">Systematic Revision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never forget a solved problem. Use notes drawers and spaced repetition revision status flags right before interview day.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Student Productivity
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Everything you need in one sleek dashboard without fluff or distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loved by Placed Students
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            See how fellow computer science students used DSA Pattern Tracker to land engineering offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[0.68rem] text-cyan-400 font-semibold">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">DSA Pattern Tracker</span>
            <span>— Placement Prep Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
            <Link to="/leetcode" className="hover:text-cyan-400 transition-colors">LeetCode Sync</Link>
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
