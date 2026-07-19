import { useState, useMemo } from "react";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import {
  Table as TableIcon,
  Kanban as KanbanIcon,
  Grid as GridIcon,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Download,
  Upload,
  BookOpen,
  X,
  Code2,
  Layers,
  ChevronDown
} from "lucide-react";
import ProblemForm from "./ProblemForm";

const PATTERNS = [
  "All",
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

function ProblemsPage({ problems = [], onRefresh, readOnly = false }) {
  const { activeView, setActiveView } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeNotesProblem, setActiveNotesProblem] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Filter & Sort Logic
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        const matchesSearch = p.problemName.toLowerCase().includes(search.toLowerCase());
        const matchesPattern = selectedPattern === "All" || p.pattern === selectedPattern;
        const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
        const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
        return matchesSearch && matchesPattern && matchesDiff && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "name") return a.problemName.localeCompare(b.problemName);
        if (sortBy === "difficulty") {
          const rank = { Easy: 1, Medium: 2, Hard: 3 };
          return rank[a.difficulty] - rank[b.difficulty];
        }
        return 0;
      });
  }, [problems, search, selectedPattern, selectedDifficulty, selectedStatus, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProblems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProblems.map((p) => p._id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected problems?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/problems/${id}`)));
      setSelectedIds([]);
      onRefresh();
    } catch {
      alert("Failed to delete selected problems.");
    }
  };

  const handleBulkSolve = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => api.patch(`/problems/${id}`, { status: "Solved" })));
      setSelectedIds([]);
      onRefresh();
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Problem Name", "Pattern", "Difficulty", "Status", "Platform", "Notes"];
    const rows = filteredProblems.map((p) => [
      `"${p.problemName.replace(/"/g, '""')}"`,
      `"${p.pattern}"`,
      `"${p.difficulty}"`,
      `"${p.status}"`,
      `"${p.platform || "LeetCode"}"`,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dsa_problems_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      let count = 0;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.replace(/^"|"$/g, "").trim());
        if (parts[0]) {
          try {
            await api.post("/problems", {
              problemName: parts[0],
              pattern: parts[1] || "Arrays",
              difficulty: parts[2] || "Easy",
              status: parts[3] || "Unsolved",
              platform: parts[4] || "LeetCode",
              notes: parts[5] || "",
            });
            count++;
          } catch {
            // ignore
          }
        }
      }
      alert(`Imported ${count} problems successfully!`);
      onRefresh();
    };
    reader.readAsText(file);
  };

  const handleSaveNotes = async () => {
    if (!activeNotesProblem) return;
    try {
      setSavingNotes(true);
      await api.patch(`/problems/${activeNotesProblem._id}`, { notes: notesText });
      setActiveNotesProblem(null);
      onRefresh();
    } catch {
      alert("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusToggle = async (p) => {
    if (readOnly) return;
    const statuses = ["Unsolved", "Attempted", "Revision", "Solved"];
    const nextIdx = (statuses.indexOf(p.status) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    try {
      await api.patch(`/problems/${p._id}`, {
        status: nextStatus,
        lastSolvedDate: nextStatus === "Solved" ? new Date() : p.lastSolvedDate,
      });
      onRefresh();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-slide-up">
      
      {/* Header Bar */}
      <div className="bg-[#0e1626] border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-400" />
            <span>Problem Bank & Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Add new problems below or manage existing entries in Table, Kanban, or Grid view.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#080d1a] border border-slate-800 p-1 flex items-center gap-1">
            <button
              onClick={() => setActiveView("table")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                activeView === "table" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                activeView === "kanban" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <KanbanIcon className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setActiveView("grid")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer ${
                activeView === "grid" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <GridIcon className="w-4 h-4" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#080d1a] border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <label className="px-4 py-2.5 bg-[#080d1a] border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
        </div>
      </div>

      {/* Add New Problem Entry Form Directly on Problems Page */}
      {!readOnly && <ProblemForm onAdd={onRefresh} />}

      {/* Broad Filter & Search Bar */}
      <div className="bg-[#0e1626] border border-slate-800 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#080d1a] border border-slate-800 text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>

          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="py-3 px-4 bg-[#080d1a] border border-slate-800 text-sm font-medium text-slate-200 outline-none cursor-pointer"
          >
            {PATTERNS.map((p) => (
              <option key={p} value={p} className="bg-[#0e1626]">{p === "All" ? "All Patterns" : p}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="py-3 px-4 bg-[#080d1a] border border-slate-800 text-sm font-medium text-slate-200 outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0e1626]">All Difficulties</option>
            <option value="Easy" className="bg-[#0e1626]">Easy</option>
            <option value="Medium" className="bg-[#0e1626]">Medium</option>
            <option value="Hard" className="bg-[#0e1626]">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-3 px-4 bg-[#080d1a] border border-slate-800 text-sm font-medium text-slate-200 outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0e1626]">All Statuses</option>
            <option value="Unsolved" className="bg-[#0e1626]">Unsolved</option>
            <option value="Attempted" className="bg-[#0e1626]">Attempted</option>
            <option value="Revision" className="bg-[#0e1626]">Revision</option>
            <option value="Solved" className="bg-[#0e1626]">Solved</option>
          </select>
        </div>

        {/* Sort & Bulk Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold">Sort by:</span>
            <button
              onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
              className="text-cyan-400 font-bold underline cursor-pointer"
            >
              {sortBy === "newest" ? "Newest First" : "Oldest First"}
            </button>
            <button
              onClick={() => setSortBy("difficulty")}
              className="text-cyan-400 font-bold underline cursor-pointer ml-2"
            >
              Difficulty
            </button>
          </div>

          {selectedIds.length > 0 && !readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">{selectedIds.length} Selected</span>
              <button
                onClick={handleBulkSolve}
                className="px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold cursor-pointer"
              >
                Mark Solved
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-950 text-rose-400 border border-rose-500/40 text-xs font-bold cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {activeView === "table" && (
        <div className="bg-[#0e1626] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#080d1a] text-slate-400 font-bold border-b border-slate-800 uppercase text-[0.7rem]">
                <tr>
                  {!readOnly && (
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === filteredProblems.length}
                        onChange={toggleSelectAll}
                        className="bg-[#080d1a] border-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="p-4">Problem Title</th>
                  <th className="p-4">Pattern</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notes</th>
                  {!readOnly && <th className="p-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                      No matching problems found. Add a problem above!
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => {
                    const isSelected = selectedIds.includes(problem._id);
                    return (
                      <tr key={problem._id} className={`hover:bg-[#080d1a]/80 transition-colors ${isSelected ? "bg-cyan-950/30" : ""}`}>
                        {!readOnly && (
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(problem._id)}
                              className="bg-[#080d1a] border-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="p-4 font-bold text-white text-sm sm:text-base">
                          {problem.problemName}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 text-xs font-bold bg-blue-950 text-blue-400 border border-blue-500/30">
                            {problem.pattern}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs font-bold border ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                                : problem.difficulty === "Medium"
                                ? "bg-amber-950 text-amber-400 border-amber-500/30"
                                : "bg-rose-950 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleStatusToggle(problem)}
                            className={`px-3 py-1 text-xs font-bold border cursor-pointer ${
                              problem.status === "Solved"
                                ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                                : problem.status === "Revision"
                                ? "bg-purple-950 text-purple-400 border-purple-500/40"
                                : problem.status === "Attempted"
                                ? "bg-amber-950 text-amber-400 border-amber-500/40"
                                : "bg-slate-900 text-slate-400 border-slate-700"
                            }`}
                          >
                            {problem.status}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setActiveNotesProblem(problem);
                              setNotesText(problem.notes || "");
                            }}
                            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>{problem.notes ? "View Note" : "+ Note"}</span>
                          </button>
                        </td>
                        {!readOnly && (
                          <td className="p-4 text-right">
                            <button
                              onClick={async () => {
                                if (window.confirm("Delete problem?")) {
                                  await api.delete(`/problems/${problem._id}`);
                                  onRefresh();
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN VIEW */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Unsolved", "Attempted", "Revision", "Solved"].map((colStatus) => {
            const colProblems = filteredProblems.filter((p) => p.status === colStatus);
            return (
              <div key={colStatus} className="bg-[#0e1626] border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-300">
                    {colStatus}
                  </h3>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 border border-cyan-500/30">
                    {colProblems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {colProblems.map((prob) => (
                    <div
                      key={prob._id}
                      className="p-4 bg-[#080d1a] border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all"
                    >
                      <h4 className="text-sm font-bold text-white">{prob.problemName}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-500/30 font-bold">
                          {prob.pattern}
                        </span>
                        <span
                          className={`px-2 py-0.5 border font-bold ${
                            prob.difficulty === "Easy"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                              : prob.difficulty === "Medium"
                              ? "bg-amber-950 text-amber-400 border-amber-500/30"
                              : "bg-rose-950 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleStatusToggle(prob)}
                          className="text-cyan-400 font-bold hover:underline cursor-pointer"
                        >
                          Move Next →
                        </button>
                        <button
                          onClick={() => {
                            setActiveNotesProblem(prob);
                            setNotesText(prob.notes || "");
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: GRID VIEW */}
      {activeView === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProblems.map((prob) => (
            <div
              key={prob._id}
              className="p-5 bg-[#0e1626] border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-bold text-white">{prob.problemName}</h4>
                <button
                  onClick={() => handleStatusToggle(prob)}
                  className={`px-2.5 py-1 text-xs font-bold border cursor-pointer ${
                    prob.status === "Solved"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  {prob.status}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-500/30 font-bold">
                  {prob.pattern}
                </span>
                <span
                  className={`px-2.5 py-1 border font-bold ${
                    prob.difficulty === "Easy"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                      : prob.difficulty === "Medium"
                      ? "bg-amber-950 text-amber-400 border-amber-500/30"
                      : "bg-rose-950 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {prob.difficulty}
                </span>
              </div>

              {prob.notes && (
                <p className="text-xs text-slate-300 bg-[#080d1a] p-3 border border-slate-800 font-mono">
                  {prob.notes}
                </p>
              )}

              {!readOnly && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                  <button
                    onClick={() => {
                      setActiveNotesProblem(prob);
                      setNotesText(prob.notes || "");
                    }}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Edit Notes
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete problem?")) {
                        await api.delete(`/problems/${prob._id}`);
                        onRefresh();
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Notes Drawer */}
      {activeNotesProblem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-end animate-fade-slide-up">
          <div className="w-full max-w-lg h-full bg-[#0e1626] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Implementation Notes</h3>
                </div>
                <button onClick={() => setActiveNotesProblem(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-base font-bold text-white block">{activeNotesProblem.problemName}</span>
                <span className="text-xs text-cyan-400 font-bold">{activeNotesProblem.pattern} • {activeNotesProblem.difficulty}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Approach & Solution Notes</label>
                <textarea
                  rows={12}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="e.g. Use Sliding Window. Maintain left pointer. Time O(N), Space O(1)."
                  className="w-full p-4 bg-[#080d1a] border border-slate-800 text-sm text-white placeholder-slate-600 font-mono outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow cursor-pointer"
              >
                {savingNotes ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={() => setActiveNotesProblem(null)}
                className="px-6 py-3 bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProblemsPage;
