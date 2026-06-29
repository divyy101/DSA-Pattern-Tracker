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
  if (difficulty === "Easy") return "bg-emerald-500/20 text-emerald-300";
  if (difficulty === "Medium") return "bg-amber-500/20 text-amber-300";
  return "bg-pink-500/20 text-pink-300";
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

  function updateEditField(fieldName, value) {
    setEditData({ ...editData, [fieldName]: value });
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-10 px-4 animate-fade-slide-up">
        <span className="text-[2.2rem] block mb-2.5 animate-gentle-bounce">📚</span>
        <p className="text-[0.88rem] text-slate-500">No problems found. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[0.95rem] font-bold text-slate-200 mb-4 flex items-center gap-1.5">
        📋 Your Problems <span className="font-medium text-slate-500 text-[0.85rem]">({problems.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {problems.map((problem, index) => (
          <div
            key={problem._id}
            style={{ animationDelay: `${index * 30}ms` }}
            className="bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl p-4.5 flex flex-col gap-2.5 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)] hover:border-violet-500/35 animate-fade-slide-up"
          >
            {editingId === problem._id ? (
              <>
                <input
                  className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-1.5 px-3 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
                  value={editData.problemName}
                  onChange={(e) => updateEditField("problemName", e.target.value)}
                  placeholder="Problem name"
                />
                <select
                  className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-1.5 px-3 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
                  value={editData.pattern}
                  onChange={(e) => updateEditField("pattern", e.target.value)}
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-indigo-950 text-slate-200">{p}</option>
                  ))}
                </select>
                <select
                  className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-1.5 px-3 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
                  value={editData.difficulty}
                  onChange={(e) => updateEditField("difficulty", e.target.value)}
                >
                  <option className="bg-indigo-950 text-slate-200">Easy</option>
                  <option className="bg-indigo-950 text-slate-200">Medium</option>
                  <option className="bg-indigo-950 text-slate-200">Hard</option>
                </select>
                <select
                  className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-1.5 px-3 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 cursor-pointer"
                  value={editData.status}
                  onChange={(e) => updateEditField("status", e.target.value)}
                >
                  <option className="bg-indigo-950 text-slate-200">Unsolved</option>
                  <option className="bg-indigo-950 text-slate-200">Solved</option>
                </select>
                <textarea
                  className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-1.5 px-3 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500 resize-none"
                  rows={2}
                  value={editData.notes}
                  onChange={(e) => updateEditField("notes", e.target.value)}
                  placeholder="Notes..."
                />
                <div className="flex gap-2 mt-auto pt-2.5 border-t border-violet-500/10">
                  <button onClick={() => saveEdit(problem._id)} className="flex-1 inline-flex items-center justify-center gap-1 font-semibold text-[0.78rem] py-1.5 px-2 rounded-lg border cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-97 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50">
                    ✓ Save
                  </button>
                  <button onClick={cancelEdit} className="flex-1 inline-flex items-center justify-center gap-1 font-semibold text-[0.78rem] py-1.5 px-2 rounded-lg border cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-97 bg-slate-500/15 text-slate-200 border-slate-500/20 hover:bg-slate-500/25 hover:border-slate-500/35">
                    ✕ Cancel
                  </button>
                </div>
              </>
            ) : (

              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[0.92rem] font-bold text-slate-200 leading-tight">{problem.problemName}</span>
                  <span
                    className={`inline-flex items-center text-[0.68rem] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 ${
                      problem.status === "Solved" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {problem.status === "Solved" ? "✅ Solved" : "Unsolved"}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center text-[0.68rem] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 bg-blue-500/20 text-blue-300">{problem.pattern}</span>
                  <span className={`inline-flex items-center text-[0.68rem] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 ${getDifficultyBadgeClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                {problem.notes && (
                  <div className="text-[0.78rem] text-slate-400 bg-violet-500/8 border border-violet-500/12 rounded-lg p-2 leading-relaxed">📝 {problem.notes}</div>
                )}
                {!readOnly && (
                  <div className="flex gap-2 mt-auto pt-2.5 border-t border-violet-500/10">
                    <button onClick={() => startEdit(problem)} className="flex-1 inline-flex items-center justify-center gap-1 font-semibold text-[0.78rem] py-1.5 px-2 rounded-lg border cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-97 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(problem._id)} className="flex-1 inline-flex items-center justify-center gap-1 font-semibold text-[0.78rem] py-1.5 px-2 rounded-lg border cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-97 bg-pink-500/15 text-pink-300 border-pink-500/30 hover:bg-pink-500/25 hover:border-pink-500/50">
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
