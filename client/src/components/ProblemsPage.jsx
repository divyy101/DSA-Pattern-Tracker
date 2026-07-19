import { useState, useMemo } from "react";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import {
  Table as TableIcon,
  Kanban as KanbanIcon,
  Grid as GridIcon,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  Download,
  Upload,
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronDown,
  Edit2,
  X,
  RefreshCw,
  Clock,
  Sparkles
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
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'difficulty' | 'name'

  // Selection for Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Notes Slide-Over Drawer
  const [activeNotesProblem, setActiveNotesProblem] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Edit Modal
  const [editingProblem, setEditingProblem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Filters logic
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

  // Bulk Actions
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

  // Export CSV
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

  // Import CSV
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
            // ignore item error
          }
        }
      }
      alert(`Imported ${count} problems successfully!`);
      onRefresh();
    };
    reader.readAsText(file);
  };

  // Notes drawer save
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

  // Toggle Single Problem Status
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-slide-up">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Problem Bank & Revision Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your problem suite in Table, Kanban, or Grid view.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* View Buttons */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveView("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === "table" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === "kanban" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setActiveView("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === "grid" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GridIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Export / Import CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
        </div>
      </div>

      {/* Add Problem Form Drawer */}
      {!readOnly && <ProblemForm onAdd={onRefresh} />}

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Pattern Selector */}
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 outline-none cursor-pointer"
          >
            {PATTERNS.map((p) => (
              <option key={p} value={p}>{p === "All" ? "All Patterns" : p}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Unsolved">Unsolved</option>
            <option value="Attempted">Attempted</option>
            <option value="Revision">Revision</option>
            <option value="Solved">Solved</option>
          </select>
        </div>

        {/* Sort & Bulk Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Sort by:</span>
            <button
              onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
              className="text-slate-300 font-medium hover:text-cyan-400 underline cursor-pointer"
            >
              {sortBy === "newest" ? "Newest First" : "Oldest First"}
            </button>
            <button
              onClick={() => setSortBy("difficulty")}
              className="text-slate-300 font-medium hover:text-cyan-400 underline cursor-pointer ml-2"
            >
              Difficulty
            </button>
          </div>

          {/* Selected Count & Bulk Actions */}
          {selectedIds.length > 0 && !readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">{selectedIds.length} Selected</span>
              <button
                onClick={handleBulkSolve}
                className="px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-900/40 cursor-pointer"
              >
                Mark Solved
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 bg-rose-950/60 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold hover:bg-rose-900/40 cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {activeView === "table" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[0.65rem]">
                <tr>
                  {!readOnly && (
                    <th className="p-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === filteredProblems.length}
                        onChange={toggleSelectAll}
                        className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="p-3.5">Problem Name</th>
                  <th className="p-3.5">Pattern</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Platform</th>
                  <th className="p-3.5">Notes</th>
                  {!readOnly && <th className="p-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No matching problems found.
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => {
                    const isSelected = selectedIds.includes(problem._id);
                    return (
                      <tr key={problem._id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? "bg-cyan-950/20" : ""}`}>
                        {!readOnly && (
                          <td className="p-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(problem._id)}
                              className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-3.5 h-3.5 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="p-3.5 font-bold text-white">
                          <span>{problem.problemName}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-[0.68rem] font-bold bg-blue-950/40 text-blue-400 border border-blue-500/20">
                            {problem.pattern}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[0.68rem] font-bold border ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                                : problem.difficulty === "Medium"
                                ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                                : "bg-rose-950/40 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleStatusToggle(problem)}
                            className={`px-2.5 py-1 rounded-lg text-[0.68rem] font-bold border cursor-pointer transition-transform hover:scale-105 ${
                              problem.status === "Solved"
                                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                                : problem.status === "Revision"
                                ? "bg-purple-950/60 text-purple-400 border-purple-500/30"
                                : problem.status === "Attempted"
                                ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {problem.status}
                          </button>
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono">
                          {problem.platform || "LeetCode"}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setActiveNotesProblem(problem);
                              setNotesText(problem.notes || "");
                            }}
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{problem.notes ? "View Note" : "+ Add Note"}</span>
                          </button>
                        </td>
                        {!readOnly && (
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={async () => {
                                  if (window.confirm("Delete problem?")) {
                                    await api.delete(`/problems/${problem._id}`);
                                    onRefresh();
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* VIEW 2: KANBAN BOARD VIEW */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Unsolved", "Attempted", "Revision", "Solved"].map((colStatus) => {
            const colProblems = filteredProblems.filter((p) => p.status === colStatus);
            return (
              <div key={colStatus} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    {colStatus}
                  </h3>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                    {colProblems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {colProblems.map((prob) => (
                    <div
                      key={prob._id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-cyan-500/30 transition-all shadow-md"
                    >
                      <h4 className="text-xs font-bold text-white">{prob.problemName}</h4>
                      <div className="flex items-center justify-between text-[0.65rem]">
                        <span className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/20">
                          {prob.pattern}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border font-bold ${
                            prob.difficulty === "Easy"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                              : prob.difficulty === "Medium"
                              ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                              : "bg-rose-950/40 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <button
                          onClick={() => handleStatusToggle(prob)}
                          className="text-[0.65rem] text-cyan-400 font-semibold hover:underline cursor-pointer"
                        >
                          Move Next →
                        </button>
                        <button
                          onClick={() => {
                            setActiveNotesProblem(prob);
                            setNotesText(prob.notes || "");
                          }}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
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

      {/* VIEW 3: GRID CARDS VIEW */}
      {activeView === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProblems.map((prob) => (
            <div
              key={prob._id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{prob.problemName}</h4>
                <button
                  onClick={() => handleStatusToggle(prob)}
                  className={`px-2 py-0.5 rounded text-[0.65rem] font-bold border cursor-pointer ${
                    prob.status === "Solved"
                      ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {prob.status}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[0.65rem]">
                <span className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/20 font-bold">
                  {prob.pattern}
                </span>
                <span
                  className={`px-2 py-0.5 rounded border font-bold ${
                    prob.difficulty === "Easy"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                      : prob.difficulty === "Medium"
                      ? "bg-amber-950/40 text-amber-400 border-amber-500/20"
                      : "bg-rose-950/40 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prob.difficulty}
                </span>
              </div>

              {prob.notes && (
                <p className="text-[0.72rem] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                  {prob.notes}
                </p>
              )}

              {!readOnly && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActiveNotesProblem(prob);
                      setNotesText(prob.notes || "");
                    }}
                    className="text-cyan-400 font-semibold hover:underline cursor-pointer"
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
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Notes Drawer Modal */}
      {activeNotesProblem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-end animate-fade-slide-up">
          <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Implementation Notes</h3>
                </div>
                <button onClick={() => setActiveNotesProblem(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-xs font-extrabold text-white block">{activeNotesProblem.problemName}</span>
                <span className="text-[0.68rem] text-cyan-400 font-semibold">{activeNotesProblem.pattern} • {activeNotesProblem.difficulty}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Approach & Solution Notes</label>
                <textarea
                  rows={10}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="e.g. Use Sliding Window. Maintain left pointer. Time O(N), Space O(1)."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 font-mono outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                {savingNotes ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={() => setActiveNotesProblem(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
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
