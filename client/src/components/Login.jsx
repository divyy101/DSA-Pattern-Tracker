import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/users/login", formData);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg')" }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 animate-page-ease-in"
    >
      <div className="max-w-md w-full bg-[#0f1428]/80 backdrop-blur-[15px] border border-violet-500/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t-[3px] border-t-fuchsia-500/50">

        <div className="text-center mb-6">
          <span className="text-4xl block mb-2 animate-gentle-bounce">🔐</span>
          <h2 className="text-2xl font-bold text-slate-200">Account Access</h2>
          <p className="text-xs text-slate-400 mt-1">Unlock your DSA tracker space</p>
        </div>

        {error && (
          <p className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 mb-4 animate-shake-in">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. coder@dsa.com"
              disabled={loading}
              className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[0.78rem] font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full border-[1.5px] border-violet-500/30 rounded-lg py-2 px-3.5 text-[0.85rem] font-medium text-slate-200 bg-[#0f1428]/60 outline-none transition-all duration-300 hover:border-violet-500/50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:bg-[#0f1428]/75 placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center font-bold text-[0.85rem] py-2.5 px-4.5 rounded-none border-2 border-violet-500/70 hover:border-fuchsia-400 cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-gradient-to-r from-violet-600 to-fuchsia-700 text-white shadow-[0_3px_12px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_22px_rgba(139,92,246,0.5)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-violet-500/10">
          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="text-[0.78rem] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate("/register")}
            disabled={loading}
            className="text-[0.78rem] text-violet-400 hover:text-violet-200 transition-colors cursor-pointer"
          >
            Don't have an account? Register
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
