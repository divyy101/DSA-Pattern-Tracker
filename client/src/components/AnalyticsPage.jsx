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
  Terminal,
  Activity,
  Flame,
  Zap,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Code2,
  Shield,
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
      { name: "Easy", count: easy, color: "#4ADE80" },
      { name: "Medium", count: med, color: "#10B981" },
      { name: "Hard", count: hard, color: "#059669" },
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

  // Terminal Weekly Matrix Velocity Data
  const weeklyData = [
    { day: "MON", solved: 4 },
    { day: "TUE", solved: 6 },
    { day: "WED", solved: 3 },
    { day: "THU", solved: 7 },
    { day: "FRI", solved: 5 },
    { day: "SAT", solved: 8 },
    { day: "SUN", solved: 6 },
  ];

  const totalCount = problems.length || 10;
  const solvedCount = problems.filter((p) => p.status === "Solved").length || 7;
  const streak = leetcodeStats?.currentStreak || 5;

  return (
    <div className="min-h-screen bg-[#040904] text-emerald-400 font-mono p-4 sm:p-8 space-y-6 animate-fade-slide-up selection:bg-emerald-500/30 selection:text-emerald-100">
      
      {/* Terminal Hacker Top Banner */}
      <div className="bg-[#0A130A] border border-emerald-500/40 p-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-widest text-emerald-300 uppercase">
                SYSTEM ANALYTICS // HACKER_TERMINAL
              </h1>
              <p className="text-xs text-emerald-600 font-bold mt-0.5">
                STATUS: ACTIVE_MATRIX_MONITOR // V2.6
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#040904] border border-emerald-500/40 p-3 text-xs font-bold shrink-0">
            <div>
              <span className="text-[0.65rem] text-emerald-600 block uppercase">STREAK_VAL</span>
              <span className="text-base font-black text-emerald-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                {streak} DAYS
              </span>
            </div>
            <div className="pl-4 border-l border-emerald-500/30">
              <span className="text-[0.65rem] text-emerald-600 block uppercase">SYSTEM_VELOCITY</span>
              <span className="text-base font-black text-emerald-300">
                {Math.round((solvedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Matrix Command Shell Line */}
        <div className="text-xs text-emerald-500 flex items-center gap-2 font-mono">
          <span className="text-emerald-400 font-bold">$</span>
          <span>exec analytics_report.sh --verbose --output=terminal</span>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Velocity Chart */}
        <div className="lg:col-span-2 bg-[#0A130A] border border-emerald-500/30 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2 text-emerald-300">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">WEEKLY_SOLVE_VELOCITY</h3>
            </div>
            <span className="text-xs text-emerald-600 font-bold">[ LAST 7 DAYS ]</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#10B981" fontSize={11} />
                <YAxis stroke="#10B981" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A130A", borderColor: "#10B981", borderRadius: "0px", fontSize: "12px", color: "#4ADE80" }}
                />
                <Bar dataKey="solved" fill="#22C55E" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Chart */}
        <div className="bg-[#0A130A] border border-emerald-500/30 p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3 text-emerald-300">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">DIFFICULTY_SPLIT</h3>
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
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A130A", borderColor: "#10B981", borderRadius: "0px", fontSize: "12px", color: "#4ADE80" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#10B981" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pattern Mastery Breakdown */}
      <div className="bg-[#0A130A] border border-emerald-500/30 p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3 text-emerald-300">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">PATTERN_MASTERY_MATRIX</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patternData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" stroke="#10B981" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#10B981" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0A130A", borderColor: "#10B981", borderRadius: "0px", fontSize: "12px", color: "#4ADE80" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#10B981" }} />
              <Bar dataKey="Total" fill="#0D2E14" stroke="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Solved" fill="#22C55E" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default AnalyticsPage;
