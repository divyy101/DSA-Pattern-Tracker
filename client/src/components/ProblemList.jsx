import { useState } from "react";
import api from "../api";
import { Edit2, Trash2, CheckCircle2, Circle, BookOpen, Save, X } from "lucide-react";

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

function ProblemList({ problems = [], onDelete, onUpdate, readOnly = false }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  function startEdit(problem) {
    setEditingId(problem._id);
    setEditData({
      problemName: problem.problemName,
      pattern: problem.pattern,
      difficulty: problem.difficulty,
      status: problem.status,
      notes: problem.notes,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(id) {
    try {
      await api.patch(`/problems/${id}`, editData);
      onUpdate();
      setEditingId(null);
    } catch {
      alert("Failed to update problem.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await api.delete(`/problems/${id}`);
      onDelete();
    } catch {
      alert("Failed to delete problem.");
    }
  }

  async function toggleStatus(problem) {
    if (readOnly) return;
    const newStatus = problem.status === "Solved" ? "Unsolved" : "Solved";
    try {
      await api.patch(`/problems/${problem._id}`, { status: newStatus });
      onUpdate();
    } catch {
      alert("Failed to update status.");
    }
  }

  function updateEditField(fieldName, value) {
    setEditData({ ...editData, [fieldName]: value });
  }

  const unsolvedProblems = problems.filter((p) => p.status !== "Solved");
  const solvedProblems = problems.filter((p) => p.status === "Solved");

  function renderProblemCard(problem, orderNumber) {
    return (
      <div
        key={problem._id}
        className="bg-[#0e1626] border border-slate-800 rounded-none p-5 flex flex-col gap-3 shadow-md hover:border-cyan-500/40 transition-all"
      >
        {editingId === problem._id ? (
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Editing Entry</span>
            <input
              className="w-full py-2.5 px-3 bg-[#080d1a] border border-slate-800 rounded-none text-sm font-semibold text-white outline-none focus:border-cyan-500/60"
              value={editData.problemName}
              onChange={(e) => updateEditField("problemName", e.target.value)}
              placeholder="Problem Name"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full py-2 px-2 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white outline-none cursor-pointer"
                value={editData.pattern}
                onChange={(e) => updateEditField("pattern", e.target.value)}
              >
                {PATTERNS.map((p) => (
                  <option key={p} value={p} className="bg-[#0e1626] text-white">{p}</option>
                ))}
              </select>

              <select
                className="w-full py-2 px-2 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white outline-none cursor-pointer"
                value={editData.difficulty}
                onChange={(e) => updateEditField("difficulty", e.target.value)}
              >
                <option value="Easy" className="bg-[#0e1626]">Easy</option>
                <option value="Medium" className="bg-[#0e1626]">Medium</option>
                <option value="Hard" className="bg-[#0e1626]">Hard</option>
              </select>
            </div>

            <textarea
              className="w-full py-2 px-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs text-white outline-none font-mono resize-none"
              rows={2}
              value={editData.notes}
              onChange={(e) => updateEditField("notes", e.target.value)}
              placeholder="Notes..."
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => saveEdit(problem._id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-none cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="shrink-0 w-7 h-7 bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-xs font-black text-cyan-400">
                  {orderNumber}
                </span>
                <h4 className="text-base font-bold text-white leading-snug break-words flex-1 mt-0.5">
                  {problem.problemName}
                </h4>
              </div>

              <button
                onClick={() => toggleStatus(problem)}
                className={`px-3 py-1 text-xs font-bold rounded-none border cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105 ${
                  problem.status === "Solved"
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-900 text-slate-400 border-slate-700"
                }`}
              >
                {problem.status === "Solved" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                <span>{problem.status}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 bg-blue-950/60 text-blue-400 border border-blue-500/20 font-bold rounded-none">
                {problem.pattern}
              </span>
              <span
                className={`px-2.5 py-1 border font-bold rounded-none ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                    : problem.difficulty === "Medium"
                    ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                    : "bg-rose-950/40 text-rose-400 border-rose-500/20"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            {problem.notes && (
              <div className="text-xs text-slate-300 bg-[#080d1a] border border-slate-800 p-3 font-mono leading-relaxed">
                <span className="text-[0.65rem] text-slate-500 font-bold block mb-1 uppercase font-sans">Notes</span>
                {problem.notes}
              </div>
            )}

            {!readOnly && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => startEdit(problem)}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Unsolved Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Unsolved Problems</span>
            <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-none border border-rose-500/30">
              {unsolvedProblems.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {unsolvedProblems.map((p, idx) => renderProblemCard(p, idx + 1))}
        </div>
      </div>

      {/* Solved Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Solved Problems</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-none border border-emerald-500/30">
              {solvedProblems.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {solvedProblems.map((p, idx) => renderProblemCard(p, unsolvedProblems.length + idx + 1))}
        </div>
      </div>
    </div>
  );
}

export default ProblemList;
