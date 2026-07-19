import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Flame,
  Award,
  Zap,
  Activity,
  Calendar,
  Layers
} from "lucide-react";

function AnalyticsPage({ problems = [] }) {
  const { leetcodeStats } = useAppStore();

  // Difficulty Distribution
  const difficultyData = useMemo(() => {
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const med = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;

    return [
      { name: "Easy", count: easy, color: "#34D399" },
      { name: "Medium", count: med, color: "#FBBF24" },
      { name: "Hard", count: hard, color: "#F87171" },
    ];
  }, [problems]);

  // Pattern / Topic Breakdown
  const patternData = useMemo(() => {
    const patterns = [
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

    return patterns.map((pat) => {
      const total = problems.filter((p) => p.pattern.toLowerCase().includes(pat.toLowerCase())).length;
      const solved = problems.filter((p) => p.pattern.toLowerCase().includes(pat.toLowerCase()) && p.status === "Solved").length;
      return {
        name: pat,
        Total: total,
        Solved: solved,
      };
    });
  }, [problems]);

  // Weekly Activity Graph Mock
  const weeklyData = [
    { day: "Mon", solved: 3 },
    { day: "Tue", solved: 4 },
    { day: "Wed", solved: 2 },
    { day: "Thu", solved: 5 },
    { day: "Fri", solved: 3 },
    { day: "Sat", solved: 6 },
    { day: "Sun", solved: 4 },
  ];

  const totalCount = problems.length;
  const solvedCount = problems.filter((p) => p.status === "Solved").length;
  const streak = leetcodeStats?.currentStreak || 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Advanced Analytics & Velocity Metrics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Performance Analytics & Mastery
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Visualize your problem-solving velocity, pattern distribution, and coding consistency.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div>
              <span className="text-[0.65rem] text-slate-500 uppercase block">Active Streak</span>
              <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                {streak} Days
              </span>
            </div>
            <div className="pl-4 border-l border-slate-800">
              <span className="text-[0.65rem] text-slate-500 uppercase block">Overall Completion</span>
              <span className="text-sm font-extrabold text-cyan-400">
                {totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Coding Velocity Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Weekly Problem Velocity</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="solved" fill="#22D3EE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Difficulty Breakdown</h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94A3B8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pattern Mastery Breakdown Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Pattern Mastery Comparison</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patternData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" stroke="#64748B" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94A3B8" }} />
              <Bar dataKey="Total" fill="#334155" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Solved" fill="#22D3EE" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default AnalyticsPage;
