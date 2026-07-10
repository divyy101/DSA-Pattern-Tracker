import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home-bg.png";

function Home({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundImage: `url(${homeBg})` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 animate-page-ease-in relative"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060911]/60 via-[#060911]/40 to-[#060911]/80 pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-[#0c1024]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-10 md:p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset] relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl pointer-events-none animate-float" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold bg-violet-500/[0.08] text-violet-300 border border-violet-500/15 mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open Source
          </div>

          {/* Logo Icon */}
          <span className="text-5xl block mb-5 animate-gentle-bounce drop-shadow-[0_4px_12px_rgba(139,92,246,0.25)]">🧠</span>

          {/* Title */}
          <h1 className="text-[2rem] md:text-[2.5rem] font-black leading-[1.15] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-violet-200 mb-4 tracking-tight">
            DSA Pattern
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Tracker</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[0.88rem] text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto font-medium">
            Categorize, track, and master coding problems by structural patterns. Prepare systematically for technical interviews.
          </p>

          {/* CTA Buttons */}
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center justify-center gap-2.5 font-bold text-[0.88rem] py-3.5 px-10 rounded-2xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] border border-violet-400/20"
            >
              Enter Dashboard
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[0.88rem] py-3.5 px-8 rounded-2xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] border border-violet-400/20"
              >
                Sign In
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[0.88rem] py-3.5 px-8 rounded-2xl cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-[0.68rem] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            MERN Stack
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            10+ Patterns
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Free Forever
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
