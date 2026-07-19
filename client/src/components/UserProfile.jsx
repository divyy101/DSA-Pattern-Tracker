import { useState } from "react";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import {
  User,
  Mail,
  Code2,
  Target,
  Flame,
  Download,
  Share2,
  CheckCircle2,
  Save,
  Bell,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import jsPDF from "jspdf";

function UserProfile({ problems = [] }) {
  const { user, updateUser, leetcodeStats } = useAppStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    leetcodeUsername: user?.leetcodeUsername || "",
    targetCompany: user?.targetCompany || "FAANG / Top Tech",
    dailyGoal: user?.dailyGoal || 2,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");

      const response = await api.patch("/users/profile", formData);
      if (response.data.user) {
        updateUser(response.data.user);
      }
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Export PDF Report
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("DSA Progress & Placement Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Student Name: ${formData.name}`, 14, 28);
    doc.text(`Email: ${formData.email}`, 14, 34);
    doc.text(`LeetCode Handle: ${formData.leetcodeUsername || "Not connected"}`, 14, 40);
    doc.text(`Target Role: ${formData.targetCompany}`, 14, 46);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 52);

    doc.line(14, 56, 196, 56);

    const solvedCount = problems.filter((p) => p.status === "Solved").length;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Tracked Problems: ${problems.length}`, 14, 66);
    doc.text(`Solved Problems: ${solvedCount}`, 14, 73);
    doc.text(`LeetCode Solved (Synced): ${leetcodeStats?.totalSolved || "N/A"}`, 14, 80);

    doc.setFontSize(11);
    doc.text("Problem Breakdown:", 14, 92);

    let y = 100;
    problems.slice(0, 20).forEach((p, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`${idx + 1}. ${p.problemName} | ${p.pattern} | ${p.difficulty} | Status: ${p.status}`, 14, y);
      y += 7;
    });

    doc.save(`DSA_Report_${formData.name.replace(/\s+/g, "_")}.pdf`);
  };

  // Share Progress on LinkedIn
  const handleShareLinkedIn = () => {
    const solved = problems.filter((p) => p.status === "Solved").length;
    const text = encodeURIComponent(
      `🚀 Excited to share my DSA placement prep journey! I have solved ${solved} core pattern problems on DSA Pattern Tracker and synced ${leetcodeStats?.totalSolved || 0} problems on LeetCode. #DSA #LeetCode #Coding #Placements`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-slide-up">
      
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{formData.name || "Student Coder"}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{formData.email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mt-2">
              <ShieldCheck className="w-3 h-3" />
              Verified Student Profile
            </div>
          </div>
        </div>

        {/* PDF & Share buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Resume PDF</span>
          </button>
          <button
            onClick={handleShareLinkedIn}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">Profile Settings & Goals</h3>
          <p className="text-xs text-slate-400">Configure your target company and LeetCode handle.</p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 text-slate-500 rounded-xl text-xs outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">LeetCode Username</label>
              <input
                type="text"
                name="leetcodeUsername"
                value={formData.leetcodeUsername}
                onChange={handleChange}
                placeholder="e.g. tour_ist"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Company</label>
              <input
                type="text"
                name="targetCompany"
                value={formData.targetCompany}
                onChange={handleChange}
                placeholder="e.g. Amazon / Google / FAANG"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Daily Target (Problems)</label>
              <input
                type="number"
                min={1}
                max={20}
                name="dailyGoal"
                value={formData.dailyGoal}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Profile Settings"}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default UserProfile;
