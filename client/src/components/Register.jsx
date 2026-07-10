import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/users/register", formData);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Registration successful! Redirecting to login in 3 seconds...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIcd1DiOEmM255YDptB3_efdpuzyi47gn5Tx7kVdS0MQ&s=10')" }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 animate-page-ease-in relative overflow-hidden"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060911]/85 via-[#0c1024]/80 to-[#0a0d1a]/90 pointer-events-none" />
      {/* Decorative background orbs */}
      <div className="absolute top-1/3 -right-28 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/3 -left-28 w-56 h-56 bg-indigo-600/6 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-[420px] w-full">
        {/* Card */}
        <div className="bg-[#0c1024]/85 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-8 md:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset] relative overflow-hidden">
          {/* Top glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/15 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h2 className="text-[1.5rem] font-extrabold text-slate-100 tracking-tight">Create Account</h2>
            <p className="text-[0.82rem] text-slate-500 mt-1.5 font-medium">Start your DSA mastery journey today</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 text-[0.78rem] text-rose-300 bg-rose-500/[0.08] border border-rose-500/20 rounded-xl p-3.5 mb-5 animate-shake-in">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-2.5 text-[0.78rem] text-emerald-300 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl p-3.5 mb-5 animate-fade-slide-up">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading || success}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] placeholder-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading || success}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] placeholder-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] text-[0.85rem] font-medium text-slate-200 bg-white/[0.03] outline-none transition-all duration-300 hover:border-white/[0.12] focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] placeholder-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="group w-full inline-flex items-center justify-center gap-2 font-bold text-[0.85rem] py-3.5 rounded-xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 border border-violet-400/20 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/[0.05]">
            <button
              onClick={() => navigate("/")}
              disabled={loading || success}
              className="text-[0.78rem] font-medium text-slate-500 hover:text-slate-300 transition-all duration-200 cursor-pointer flex items-center gap-1 group/back"
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
              Home
            </button>
            <button
              onClick={() => navigate("/login")}
              disabled={loading || success}
              className="text-[0.78rem] font-semibold text-violet-400/80 hover:text-violet-300 transition-all duration-200 cursor-pointer"
            >
              Already have an account? →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
