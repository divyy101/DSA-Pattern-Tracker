import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  Search,
  Code2,
  BarChart3,
  Flame,
  User,
  PlusCircle,
  X,
  ArrowRight
} from "lucide-react";

function CommandPalette({ problems = [], onOpenAddModal }) {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const routes = [
    { label: "Connect & Sync LeetCode", path: "/leetcode", icon: Flame, category: "Navigation" },
    { label: "Open Performance Analytics", path: "/analytics", icon: BarChart3, category: "Navigation" },
    { label: "View & Add Problems", path: "/problems", icon: Code2, category: "Navigation" },
    { label: "My Profile Settings", path: "/profile", icon: User, category: "Navigation" },
  ];

  const filteredRoutes = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProblems = problems
    .filter((p) => p.problemName.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  const handleSelectRoute = (path) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-slide-up">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-none shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search problem name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-100 placeholder-slate-500 outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List Body */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Navigation Items */}
          {filteredRoutes.length > 0 && (
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
                Pages & Navigation
              </span>
              <div className="space-y-1">
                {filteredRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.path}
                      onClick={() => handleSelectRoute(route.path)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                        <span>{route.label}</span>
                      </div>
                      <span className="text-[0.65rem] text-slate-500 font-mono group-hover:text-cyan-400">
                        {route.path}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Problems */}
          {query.trim() && filteredProblems.length > 0 && (
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
                Matching Problems ({filteredProblems.length})
              </span>
              <div className="space-y-1">
                {filteredProblems.map((prob) => (
                  <button
                    key={prob._id}
                    onClick={() => handleSelectRoute("/problems")}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-200">{prob.problemName}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[0.65rem] font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        {prob.pattern}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[0.68rem] text-slate-500 font-mono">
          <span>Use Esc to exit</span>
          <span>Ctrl + K</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
