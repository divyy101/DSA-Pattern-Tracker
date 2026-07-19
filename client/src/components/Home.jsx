import { Link } from "react-router-dom";
import {
  Code2,
  Sparkles,
  Flame,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Layers,
  GraduationCap
} from "lucide-react";

function Home({ isLoggedIn }) {
  const features = [
    {
      title: "LeetCode Live Sync",
      desc: "Fetch real-time solved counts (Easy, Medium, Hard), acceptance rate, contest rating, and heatmap.",
      icon: Flame,
    },
    {
      title: "Pattern-First Tracking",
      desc: "Categorize problems by core patterns: Arrays, Sliding Window, Trees, Graphs, DP, Backtracking.",
      icon: Layers,
    },
    {
      title: "Multi-View Problem Bank",
      desc: "Switch between Table view, Kanban board, and Grid view. Filter, sort, and bulk update status.",
      icon: Code2,
    },
    {
      title: "Performance Analytics",
      desc: "Visualize weekly coding velocity, monthly trends, topic mastery, and difficulty distributions.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen">
      
      {/* Square Hero Section */}
      <section className="relative pt-16 pb-16 px-4 max-w-5xl mx-auto text-center border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 mb-4 rounded-none">
          <Sparkles className="w-3.5 h-3.5" />
          DSA Pattern Tracker
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Master Every DSA Pattern. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Track Coding Progress.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed mb-6">
          A minimalist platform to log DSA problems, sync LeetCode stats, and review pattern-wise mastery for software engineering interviews.
        </p>

        <div className="flex items-center justify-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs text-white shadow-md flex items-center gap-2 rounded-none"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs text-white shadow-md flex items-center gap-2 rounded-none"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-[#0e1626] border border-slate-800 hover:border-slate-700 font-bold text-xs text-slate-300 rounded-none"
              >
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards Grid (Square Cards) */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-[#0e1626] border border-slate-800 rounded-none space-y-2 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">{feat.title}</h3>
                <p className="text-[0.72rem] text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-[#080d1a]">
        <p>DSA Pattern Tracker — Master patterns, track velocity.</p>
      </footer>
    </div>
  );
}

export default Home;
