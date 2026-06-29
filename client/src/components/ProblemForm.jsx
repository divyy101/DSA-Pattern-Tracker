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

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

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

      nameInputRef.current.focus();
    } catch {
      setError("Failed to add problem. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl p-6 mb-6 hover:border-violet-500/25 hover:shadow-[0_2px_16px_rgba(139,92,246,0.06)] transition-all duration-300 animate-fade-slide-up delay-100">
      <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-1.5">📝 Add New Problem</h2>
      {error && <p className="text-[0.8rem] text-red-300 bg-red-500/15 border border-red-500/30 rounded-lg p-2 mb-3.5 animate-shake-in">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="flex flex-col sm:col-span-3">
          <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5 transition-colors duration-200">
            Problem Name <span className="text-pink-400 ml-0.5">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            name="problemName"
            value={formData.problemName}
            onChange={handleChange}
            placeholder="e.g. Two Sum"
            className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
          />
        </div>
        <div className="flex flex-col sm:col-span-1">
          <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5 transition-colors duration-200">Pattern</label>
          <select
            name="pattern"
            value={formData.pattern}
            onChange={handleChange}
            className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
          >
            {PATTERNS.map((p) => (
              <option key={p} className="bg-indigo-950 text-slate-200">{p}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:col-span-1">
          <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5 transition-colors duration-200">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
          >
            <option className="bg-indigo-950 text-slate-200">Easy</option>
            <option className="bg-indigo-950 text-slate-200">Medium</option>
            <option className="bg-indigo-950 text-slate-200">Hard</option>
          </select>
        </div>
        <div className="flex flex-col sm:col-span-1">
          <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5 transition-colors duration-200">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
          >
            <option className="bg-indigo-950 text-slate-200">Unsolved</option>
            <option className="bg-indigo-950 text-slate-200">Solved</option>
          </select>
        </div>
        <div className="flex flex-col sm:col-span-3">
          <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5 transition-colors duration-200">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Use a hash map for O(n) time"
            rows={3}
            className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500 resize-none"
          />
        </div>
        <div className="flex flex-col sm:col-span-3">
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-1 font-semibold text-[0.82rem] py-2 px-4.5 rounded-lg border-none cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-97 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-violet-500 to-violet-700 text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.45)]">
            {loading ? "Adding..." : "➕ Add Problem"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProblemForm;
