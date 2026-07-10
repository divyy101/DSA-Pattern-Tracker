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

function getDifficultyBadge(difficulty) {
  if (difficulty === "Easy") return { cls: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/15", dot: "bg-emerald-400" };
  if (difficulty === "Medium") return { cls: "bg-amber-500/[0.08] text-amber-300 border-amber-500/15", dot: "bg-amber-400" };
  return { cls: "bg-rose-500/[0.08] text-rose-400 border-rose-500/15", dot: "bg-rose-400" };
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

  const unsolvedProblems = problems.filter((p) => p.status !== "Solved");
  const solvedProblems = problems.filter((p) => p.status === "Solved");

  if (problems.length === 0) {
    return (
      <div className="text-center py-16 px-4 animate-fade-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/[0.06] border border-violet-500/10 mb-4">
          <svg className="w-8 h-8 text-violet-400/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <p className="text-[0.85rem] text-slate-500 font-medium">No problems tracked yet.</p>
        <p className="text-[0.75rem] text-slate-600 mt-1">Add a new problem to get started!</p>
      </div>
    );
  }

  function renderProblemCard(problem, orderNumber, animationIndex) {
    const diffBadge = getDifficultyBadge(problem.difficulty);

    return (
      <div
        key={problem._id}
        style={{ animationDelay: `${animationIndex * 40}ms` }}
        className="group/card bg-[#0c1024]/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 flex flex-col gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.15)_inset] hover:border-white/[0.15] animate-fade-slide-up relative overflow-hidden"
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {editingId === problem._id ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Edit Mode
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">Problem Name</label>
              <input
                className="w-full py-2.5 px-3 rounded-lg border border-white/[0.08] text-xs font-semibold text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] placeholder-slate-600"
                value={editData.problemName}
                onChange={(e) => updateEditField("problemName", e.target.value)}
                placeholder="Problem name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">Pattern</label>
                <select
                  className="w-full py-2.5 px-3 rounded-lg border border-white/[0.08] text-xs font-semibold text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 focus:border-violet-500/50 cursor-pointer"
                  value={editData.pattern}
                  onChange={(e) => updateEditField("pattern", e.target.value)}
                >
                  {PATTERNS.map((p) => (
                    <option key={p} className="bg-[#0c1024] text-slate-200">{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                <select
                  className="w-full py-2.5 px-3 rounded-lg border border-white/[0.08] text-xs font-semibold text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 focus:border-violet-500/50 cursor-pointer"
                  value={editData.difficulty}
                  onChange={(e) => updateEditField("difficulty", e.target.value)}
                >
                  <option className="bg-[#0c1024] text-slate-200">Easy</option>
                  <option className="bg-[#0c1024] text-slate-200">Medium</option>
                  <option className="bg-[#0c1024] text-slate-200">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                className="w-full py-2.5 px-3 rounded-lg border border-white/[0.08] text-xs font-semibold text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 focus:border-violet-500/50 cursor-pointer"
                value={editData.status}
                onChange={(e) => updateEditField("status", e.target.value)}
              >
                <option className="bg-[#0c1024] text-slate-200">Unsolved</option>
                <option className="bg-[#0c1024] text-slate-200">Solved</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">Notes</label>
              <textarea
                className="w-full py-2.5 px-3 rounded-lg border border-white/[0.08] text-xs font-semibold text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] placeholder-slate-600 resize-none"
                rows={3}
                value={editData.notes}
                onChange={(e) => updateEditField("notes", e.target.value)}
                placeholder="Add implementation hints..."
              />
            </div>

            <div className="flex gap-2 pt-2.5 border-t border-white/[0.05]">
              <button
                onClick={() => saveEdit(problem._id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 font-bold text-xs py-2.5 px-3 rounded-xl border border-emerald-500/20 cursor-pointer transition-all duration-300 active:scale-[0.97] bg-emerald-500/[0.06] text-emerald-400 hover:bg-emerald-500/[0.12] hover:border-emerald-500/30"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 inline-flex items-center justify-center gap-1.5 font-bold text-xs py-2.5 px-3 rounded-xl border border-white/[0.06] cursor-pointer transition-all duration-300 active:scale-[0.97] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:border-white/[0.1]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header: Number + Name + Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[0.7rem] font-black bg-gradient-to-br from-violet-500/12 to-violet-500/6 text-violet-400 border border-violet-500/15 mt-0.5 shadow-[0_0_8px_rgba(139,92,246,0.06)]">
                  {orderNumber}
                </span>
                <span className="text-[0.88rem] font-bold text-slate-100 leading-snug break-words flex-1 mt-0.5">{problem.problemName}</span>
              </div>
              <span
                onClick={() => toggleStatus(problem)}
                className={`inline-flex items-center gap-1.5 text-[0.68rem] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border transition-all duration-300 ${
                  problem.status === "Solved"
                    ? "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/15 hover:bg-emerald-500/[0.15]"
                    : "bg-white/[0.03] text-slate-500 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-400"
                } ${!readOnly ? "cursor-pointer select-none hover:scale-105 active:scale-[0.97]" : ""}`}
                title={!readOnly ? "Click to toggle solved status" : ""}
              >
                {problem.status === "Solved" ? (
                  <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Solved</>
                ) : (
                  <><span className="w-2 h-2 rounded-full border border-slate-600" /> Unsolved</>
                )}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap bg-blue-500/[0.06] text-blue-400 border border-blue-500/12">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                {problem.pattern}
              </span>
              <span className={`inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap border ${diffBadge.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diffBadge.dot}`} />
                {problem.difficulty}
              </span>
            </div>

            {/* Notes */}
            {problem.notes && (
              <div className="text-[0.78rem] text-slate-400 bg-white/[0.02] border border-white/[0.04] border-l-2 border-l-violet-500/30 rounded-lg rounded-l-none p-3 leading-relaxed mt-0.5 break-words font-mono">
                <span className="text-[0.62rem] text-violet-400/60 font-bold block mb-1 uppercase tracking-widest select-none font-sans">Notes</span>
                {problem.notes}
              </div>
            )}

            {/* Actions */}
            {!readOnly && (
              <div className="flex gap-2 mt-auto pt-3 border-t border-white/[0.04] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => startEdit(problem)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-3 rounded-xl border border-white/[0.06] cursor-pointer transition-all duration-300 active:scale-[0.97] bg-white/[0.02] text-slate-400 hover:text-blue-400 hover:bg-blue-500/[0.06] hover:border-blue-500/15"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-3 rounded-xl border border-white/[0.06] cursor-pointer transition-all duration-300 active:scale-[0.97] bg-white/[0.02] text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.06] hover:border-rose-500/15"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Unsolved Problems Section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/[0.08] border border-rose-500/12 flex items-center justify-center">
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[0.9rem] font-bold text-slate-200 leading-none">Unsolved Problems</h3>
            <span className="text-[0.7rem] text-slate-500 font-medium">{unsolvedProblems.length} pending</span>
          </div>
        </div>
        {unsolvedProblems.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-2xl animate-fade-slide-up">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/10 mb-3">
              <svg className="w-6 h-6 text-emerald-400/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[0.82rem] text-slate-500 font-medium">All caught up!</p>
            <p className="text-[0.72rem] text-slate-600 mt-0.5">No unsolved problems remaining.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unsolvedProblems.map((problem, index) =>
              renderProblemCard(problem, index + 1, index)
            )}
          </div>
        )}
      </div>

      {/* Solved Problems Section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/12 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[0.9rem] font-bold text-slate-200 leading-none">Solved Problems</h3>
            <span className="text-[0.7rem] text-slate-500 font-medium">{solvedProblems.length} completed</span>
          </div>
        </div>
        {solvedProblems.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-2xl animate-fade-slide-up">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/[0.06] border border-violet-500/10 mb-3">
              <svg className="w-6 h-6 text-violet-400/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <p className="text-[0.82rem] text-slate-500 font-medium">No solved problems yet.</p>
            <p className="text-[0.72rem] text-slate-600 mt-0.5">Keep grinding — you'll get there!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {solvedProblems.map((problem, index) =>
              renderProblemCard(problem, index + 1, unsolvedProblems.length + index)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemList;
