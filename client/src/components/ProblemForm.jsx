import { useState, useRef, useEffect } from "react";
import api from "../api";

const PATTERNS = [
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

function ProblemForm({ onAdd }) {
  const [formData, setFormData] = useState({
    problemName: "",
    pattern: "Arrays",
    difficulty: "Easy",
    status: "Unsolved",
    notes: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameInputRef = useRef(null);

  // Auto-focus first input when form accordion opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.problemName.trim()) {
      setError("Problem name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/problems", formData);

      setFormData({
        problemName: "",
        pattern: "Arrays",
        difficulty: "Easy",
        status: "Unsolved",
        notes: "",
      });

      onAdd();
      
      // Auto-collapse form after successful addition for clean dashboard UX
      setIsOpen(false);
    } catch {
      setError("Failed to add problem. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mb-6">
      {/* Collapsible Toggle Accordion Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0f1428] to-[#141b35] border-2 border-violet-500/40 rounded-none font-bold text-sm text-slate-200 transition-all duration-300 hover:border-violet-500/70 hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)] cursor-pointer select-none"
      >
        <span className="flex items-center gap-2">
          <span>➕</span> Add New Problem
        </span>
        <span className="text-slate-400">
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              isOpen ? "rotate-180 text-violet-400" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Slide Drawer Content */}
      {isOpen && (
        <div className="mt-3.5 bg-[#0f1428]/80 backdrop-blur-md border border-violet-500/25 rounded-2xl p-6 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)] animate-fade-slide-up">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-200">New Problem Entry</h3>
            <span className="text-xs text-slate-500 font-medium">Step-by-step master tracker</span>
          </div>

          {error && (
            <p className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 mb-4 animate-shake-in">
              ⚠️ {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col sm:col-span-3">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 transition-colors duration-200">
                Problem Name <span className="text-pink-400 ml-0.5">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                name="problemName"
                value={formData.problemName}
                onChange={handleChange}
                placeholder="e.g. Two Sum, Valid Anagram, etc."
                className="w-full bg-[#070913]/60 border border-slate-800/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-650 outline-none transition-all duration-300"
              />
            </div>
            
            <div className="flex flex-col sm:col-span-1">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 transition-colors duration-200">Pattern</label>
              <div className="relative group">
                <select
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  className="w-full bg-[#070913]/60 border border-slate-800/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 pl-3.5 pr-8 text-sm text-slate-200 outline-none transition-all duration-300 cursor-pointer appearance-none"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-[#0f1428] text-slate-200">{p}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-1">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 transition-colors duration-200">Difficulty</label>
              <div className="relative group">
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-[#070913]/60 border border-slate-800/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 pl-3.5 pr-8 text-sm text-slate-200 outline-none transition-all duration-300 cursor-pointer appearance-none"
                >
                  <option className="bg-[#0f1428] text-slate-200">Easy</option>
                  <option className="bg-[#0f1428] text-slate-200">Medium</option>
                  <option className="bg-[#0f1428] text-slate-200">Hard</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-1">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 transition-colors duration-200">Status</label>
              <div className="relative group">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#070913]/60 border border-slate-800/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 pl-3.5 pr-8 text-sm text-slate-200 outline-none transition-all duration-300 cursor-pointer appearance-none"
                >
                  <option className="bg-[#0f1428] text-slate-200">Unsolved</option>
                  <option className="bg-[#0f1428] text-slate-200">Solved</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-3">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 transition-colors duration-200">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Use sliding window. Time Complexity O(n), Space Complexity O(1)."
                rows={3}
                className="w-full bg-[#070913]/60 border border-slate-800/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 placeholder-slate-650 outline-none transition-all duration-300 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:col-span-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-bold text-sm rounded-none border-2 border-violet-500/70 hover:border-violet-400 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.45)] disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {loading ? "Adding Problem..." : "➕ Add Problem to Tracker"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProblemForm;
