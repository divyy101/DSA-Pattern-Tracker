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
        className="group w-full flex items-center justify-between px-5 py-4 bg-[#0c1024]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl font-bold text-sm text-slate-200 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-violet-500/25 hover:shadow-[0_4px_24px_rgba(139,92,246,0.08)] cursor-pointer select-none active:scale-[0.99]"
      >
        <span className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/15 flex items-center justify-center group-hover:border-violet-500/30 transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.06)]">
            <svg className={`w-4 h-4 text-violet-400 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[0.88rem]">Add New Problem</span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-all duration-300 ${isOpen ? "rotate-180 text-violet-400" : "group-hover:text-slate-400"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Slide Drawer Content */}
      {isOpen && (
        <div className="mt-3 bg-[#0c1024]/80 backdrop-blur-2xl border border-white/[0.07] rounded-2xl p-7 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)_inset] animate-fade-slide-up relative overflow-hidden">
          {/* Top glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]">
            <h3 className="text-[0.9rem] font-bold text-slate-200">New Problem Entry</h3>
            <span className="text-[0.7rem] text-slate-500 font-medium px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">Step-by-step tracker</span>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 text-[0.78rem] text-rose-300 bg-rose-500/[0.08] border border-rose-500/20 rounded-xl p-3 mb-5 animate-shake-in">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col sm:col-span-3 gap-1.5">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wider">
                Problem Name <span className="text-rose-400 ml-0.5">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                name="problemName"
                value={formData.problemName}
                onChange={handleChange}
                placeholder="e.g. Two Sum, Valid Anagram, etc."
                className="w-full py-3 px-4 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
              />
            </div>
            
            <div className="flex flex-col sm:col-span-1 gap-1.5">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wider">Pattern</label>
              <div className="relative group">
                <select
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-9 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] cursor-pointer appearance-none"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-[#0c1024] text-slate-200">{p}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-1 gap-1.5">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wider">Difficulty</label>
              <div className="relative group">
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-9 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] cursor-pointer appearance-none"
                >
                  <option className="bg-[#0c1024] text-slate-200">Easy</option>
                  <option className="bg-[#0c1024] text-slate-200">Medium</option>
                  <option className="bg-[#0c1024] text-slate-200">Hard</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-1 gap-1.5">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <div className="relative group">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-9 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] cursor-pointer appearance-none"
                >
                  <option className="bg-[#0c1024] text-slate-200">Unsolved</option>
                  <option className="bg-[#0c1024] text-slate-200">Solved</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:col-span-3 gap-1.5">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wider">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Use sliding window. Time Complexity O(n), Space Complexity O(1)."
                rows={3}
                className="w-full py-3 px-4 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:col-span-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white font-bold text-[0.85rem] rounded-xl border border-violet-400/20 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer shadow-[0_4px_14px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 select-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Adding Problem...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add Problem to Tracker
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProblemForm;
