import { useState, useRef, useEffect } from "react";
import api from "../api";
import { Plus, ChevronDown, Check } from "lucide-react";

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
  "Greedy",
  "Backtracking",
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
      setIsOpen(false);
    } catch {
      setError("Failed to add problem. Ensure server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mb-6">
      {/* Square Accordion Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0e1626] border border-slate-800 rounded-none font-bold text-xs text-white hover:border-cyan-500/40 cursor-pointer transition-all"
      >
        <span className="flex items-center gap-2">
          <Plus className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
          <span>Add New Problem Entry</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
      </button>

      {/* Expanded Form */}
      {isOpen && (
        <div className="mt-2 bg-[#0e1626] border border-slate-800 rounded-none p-6 shadow-xl animate-fade-slide-up space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">New Problem Entry</h3>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-none">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Problem Name <span className="text-rose-400">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                name="problemName"
                value={formData.problemName}
                onChange={handleChange}
                placeholder="e.g. 3Sum, Course Schedule, Trapping Rain Water..."
                className="w-full py-3 px-4 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pattern</label>
                <select
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  className="w-full py-3 px-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-slate-200 outline-none cursor-pointer focus:border-cyan-500/60"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} value={p} className="bg-[#0e1626] text-slate-200">{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full py-3 px-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-slate-200 outline-none cursor-pointer focus:border-cyan-500/60"
                >
                  <option value="Easy" className="bg-[#0e1626]">Easy</option>
                  <option value="Medium" className="bg-[#0e1626]">Medium</option>
                  <option value="Hard" className="bg-[#0e1626]">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full py-3 px-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-slate-200 outline-none cursor-pointer focus:border-cyan-500/60"
                >
                  <option value="Unsolved" className="bg-[#0e1626]">Unsolved</option>
                  <option value="Attempted" className="bg-[#0e1626]">Attempted</option>
                  <option value="Revision" className="bg-[#0e1626]">Revision</option>
                  <option value="Solved" className="bg-[#0e1626]">Solved</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes (Optional)</label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Use 2 pointers after sorting. O(N^2) time complexity."
                className="w-full py-3 px-4 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60 font-mono resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-none transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Adding Problem..." : "Save Problem Entry"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProblemForm;
