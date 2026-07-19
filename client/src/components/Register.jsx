import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAppStore } from "../store/useAppStore";
import { Eye, EyeOff, Lock, Mail, User, Code2 } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { updateUser } = useAppStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    leetcodeUsername: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/users/register", formData);
      setSuccess("Account created! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-none shadow-xl p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-2">
            <Code2 className="w-4 h-4" />
            <span>DSA Pattern Tracker</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register to start tracking your DSA journey.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-none">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-none">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Divyansh Singh"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              LeetCode Handle (Optional)
            </label>
            <div className="relative">
              <Code2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="leetcodeUsername"
                placeholder="e.g. tour_ist"
                value={formData.leetcodeUsername}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-[#080d1a] border border-slate-800 rounded-none text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-500/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-none shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 pt-2 border-t border-slate-800">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
