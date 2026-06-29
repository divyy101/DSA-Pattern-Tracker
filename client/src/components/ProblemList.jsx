import { useState } from "react";
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

function getDifficultyBadgeClass(difficulty) {
  if (difficulty === "Easy") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  if (difficulty === "Medium") return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
}

function ProblemList({ problems, onDelete, onUpdate, readOnly = false }) {
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
      alert("Failed to update.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this problem?");
    if (!confirmed) return;

    try {
      await api.delete(`/problems/${id}`);
      onDelete();
    } catch {
      alert("Failed to delete.");
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

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 px-4 animate-fade-slide-up">
        <span className="text-4xl block mb-3 animate-gentle-bounce">📚</span>
        <p className="text-sm text-slate-500 font-medium">No problems tracked. Add a new problem to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
        <span>📋</span> Tracked Problems
        <span className="px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-400 rounded-full">{problems.length}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {problems.map((problem, index) => (
          <div
            key={problem._id}
            style={{ animationDelay: `${index * 30}ms` }}
            className="bg-[#0f1428]/60 backdrop-blur-md border border-slate-850 rounded-2xl p-5 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(139,92,246,0.12)] hover:border-violet-500/30 animate-fade-slide-up"
          >
            {editingId === problem._id ? (
              <div className="flex flex-col gap-3">
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wide">Edit Mode</div>
                <div>
                  <label className="text-[0.65rem] font-bold text-slate-500 uppercase block mb-1">Problem Name</label>
                  <input
                    className="w-full bg-[#070913]/60 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 outline-none transition-all duration-300 placeholder-slate-650"
                    value={editData.problemName}
                    onChange={(e) => updateEditField("problemName", e.target.value)}
                    placeholder="Problem name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[0.65rem] font-bold text-slate-500 uppercase block mb-1">Pattern</label>
                    <select
                      className="w-full bg-[#070913]/60 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 outline-none transition-all duration-300 cursor-pointer"
                      value={editData.pattern}
                      onChange={(e) => updateEditField("pattern", e.target.value)}
                    >
                      {PATTERNS.map((p) => (
                        <option key={p} className="bg-[#0f1428] text-slate-200">{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-bold text-slate-500 uppercase block mb-1">Difficulty</label>
                    <select
                      className="w-full bg-[#070913]/60 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 outline-none transition-all duration-300 cursor-pointer"
                      value={editData.difficulty}
                      onChange={(e) => updateEditField("difficulty", e.target.value)}
                    >
                      <option className="bg-[#0f1428] text-slate-200">Easy</option>
                      <option className="bg-[#0f1428] text-slate-200">Medium</option>
                      <option className="bg-[#0f1428] text-slate-200">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold text-slate-500 uppercase block mb-1">Status</label>
                  <select
                    className="w-full bg-[#070913]/60 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 outline-none transition-all duration-300 cursor-pointer"
                    value={editData.status}
                    onChange={(e) => updateEditField("status", e.target.value)}
                  >
                    <option className="bg-[#0f1428] text-slate-200">Unsolved</option>
                    <option className="bg-[#0f1428] text-slate-200">Solved</option>
                  </select>
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold text-slate-500 uppercase block mb-1">Notes</label>
                  <textarea
                    className="w-full bg-[#070913]/60 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 outline-none transition-all duration-300 placeholder-slate-650 resize-none"
                    rows={3}
                    value={editData.notes}
                    onChange={(e) => updateEditField("notes", e.target.value)}
                    placeholder="Add implementation hints..."
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => saveEdit(problem._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 font-bold text-xs py-2 px-3 rounded-none border border-emerald-500/40 hover:border-emerald-500/85 cursor-pointer transition-all duration-200 active:scale-97 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 inline-flex items-center justify-center gap-1 font-bold text-xs py-2 px-3 rounded-none border border-slate-750 hover:border-slate-600 cursor-pointer transition-all duration-200 active:scale-97 bg-slate-800/40 text-slate-350 hover:bg-slate-850"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-extrabold text-slate-100 leading-snug break-words flex-1">{problem.problemName}</span>
                  <span
                    onClick={() => toggleStatus(problem)}
                    className={`inline-flex items-center text-[0.68rem] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap border transition-all duration-200 hover:scale-105 ${
                      problem.status === "Solved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800/80"
                    } ${!readOnly ? "cursor-pointer select-none" : ""}`}
                    title={!readOnly ? "Click to toggle solved status" : ""}
                  >
                    {problem.status === "Solved" ? "✅ Solved" : "Unsolved"}
                  </span>
                </div>
                
                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center text-[0.68rem] font-bold px-2 py-0.5 rounded-md whitespace-nowrap bg-blue-500/10 text-blue-450 border border-blue-500/20">{problem.pattern}</span>
                  <span className={`inline-flex items-center text-[0.68rem] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${getDifficultyBadgeClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                {problem.notes && (
                  <div className="text-[0.78rem] font-mono text-slate-300 bg-slate-950/40 border-l-2 border-violet-500/40 rounded-r-xl p-2.5 leading-relaxed mt-1 break-words">
                    <span className="text-[0.65rem] text-violet-400/70 font-bold block mb-1 uppercase tracking-wide select-none">Terminal Notes</span>
                    {problem.notes}
                  </div>
                )}

                {!readOnly && (
                  <div className="flex gap-2 mt-auto pt-2.5 border-t border-slate-800/60">
                    <button onClick={() => startEdit(problem)} className="flex-1 inline-flex items-center justify-center gap-1 font-bold text-xs py-2 px-3 rounded-none border border-blue-500/40 hover:border-blue-500/85 cursor-pointer transition-all duration-200 active:scale-97 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(problem._id)} className="flex-1 inline-flex items-center justify-center gap-1 font-bold text-xs py-2 px-3 rounded-none border border-pink-500/40 hover:border-pink-500/85 cursor-pointer transition-all duration-200 active:scale-97 bg-pink-500/10 text-pink-450 hover:bg-pink-500/20">
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemList;
