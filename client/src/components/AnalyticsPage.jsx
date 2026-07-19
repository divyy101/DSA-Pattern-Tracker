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
  Layers
} from "lucide-react";

function AnalyticsPage({ problems = [] }) {
  const { leetcodeStats } = useAppStore();

  // Difficulty Distribution
  const difficultyData = useMemo(() => {
    const easy = problems.filter((p) => p.difficulty === "Easy").length || 4;
    const med = problems.filter((p) => p.difficulty === "Medium").length || 5;
    const hard = problems.filter((p) => p.difficulty === "Hard").length || 2;

    return [
      { name: "Easy", count: easy, color: "#22D3EE" },
      { name: "Medium", count: med, color: "#F59E0B" },
      { name: "Hard", count: hard, color: "#F43F5E" },
    ];
  }, [problems]);

  // Pattern Breakdown
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
      const total = problems.filter((p) => p.pattern.toLowerCase().includes(pat.toLowerCase())).length || 3;
      const solved = problems.filter((p) => p.pattern.toLowerCase().includes(pat.toLowerCase()) && p.status === "Solved").length || 2;
      return {
        name: pat,
        Total: total,
        Solved: solved,
      };
    });
  }, [problems]);

  // Weekly Velocity Data
  const weeklyData = [
    { day: "Mon", solved: 4 },
    { day: "Tue", solved: 6 },
    { day: "Wed", solved: 3 },
    { day: "Thu", solved: 7 },
    { day: "Fri", solved: 5 },
    { day: "Sat", solved: 8 },
    { day: "Sun", solved: 6 },
  ];

  const totalCount = problems.length || 10;
  const solvedCount = problems.filter((p) => p.status === "Solved").length || 7;
  const streak = leetcodeStats?.currentStreak || 5;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-slide-up">
      
      {/* Top Banner */}
      <div className="bg-[#0e1626] border border-slate-800 p-6 sm:p-8 space-y-4 shadow-md w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-500/30 mb-2">
              <BarChart3 className="w-4 h-4" />
              Performance Analytics & Mastery
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Coding Velocity & Pattern Metrics
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-medium mt-1">
              Track your weekly problem-solving velocity and difficulty breakdown.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#080d1a] border border-slate-800 p-4 font-bold shrink-0">
            <div>
              <span className="text-xs text-slate-500 uppercase block">Active Streak</span>
              <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                {streak} Days
              </span>
            </div>
            <div className="pl-6 border-l border-slate-800">
              <span className="text-xs text-slate-500 uppercase block">Overall Completion</span>
              <span className="text-lg font-black text-cyan-400">
                {Math.round((solvedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Weekly Coding Velocity Bar Chart */}
        <div className="lg:col-span-2 bg-[#0e1626] border border-slate-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold">Weekly Problem Velocity</h3>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-bold">[ Last 7 Days ]</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={13} />
                <YAxis stroke="#94A3B8" fontSize={13} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#080d1a", borderColor: "#334155", borderRadius: "0px", fontSize: "13px", color: "#F8FAFC" }}
                />
                <Bar dataKey="solved" fill="#22D3EE" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Breakdown Pie Chart */}
        <div className="bg-[#0e1626] border border-slate-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white">
            <PieIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Difficulty Split</h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#080d1a", borderColor: "#334155", borderRadius: "0px", fontSize: "13px", color: "#F8FAFC" }}
                />
                <Legend wrapperStyle={{ fontSize: "13px", color: "#94A3B8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pattern Mastery Breakdown Horizontal Bar Chart */}
      <div className="bg-[#0e1626] border border-slate-800 p-6 space-y-4 shadow-md w-full">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold">Pattern Mastery Breakdown</h3>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patternData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" stroke="#94A3B8" fontSize={13} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={13} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: "#080d1a", borderColor: "#334155", borderRadius: "0px", fontSize: "13px", color: "#F8FAFC" }}
              />
              <Legend wrapperStyle={{ fontSize: "13px", color: "#94A3B8" }} />
              <Bar dataKey="Total" fill="#1E293B" stroke="#475569" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Solved" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default AnalyticsPage;
