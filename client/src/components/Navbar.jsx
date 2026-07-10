import { NavLink } from "react-router-dom";
import codingImg from "../assets/coding.jpeg";

function Navbar({ onLogout }) {
  const pages = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/problems", label: "Problems", icon: "📋" },
    { path: "/about", label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="bg-[#0a0e1e]/90 backdrop-blur-2xl border-b border-white/[0.06] py-3 px-6 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.15)]">
      <div className="max-w-[960px] mx-auto flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group no-underline">
          <div className="relative">
            <img
              src={codingImg}
              alt="DSA Tracker"
              className="w-9 h-9 rounded-xl object-cover border-2 border-violet-500/40 group-hover:border-violet-400/70 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-[-3deg] shadow-[0_0_12px_rgba(139,92,246,0.15)]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0e1e] animate-glow-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[0.95rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 group-hover:from-violet-200 group-hover:to-fuchsia-200 transition-all duration-300">
              DSA Pattern Tracker
            </span>
            <span className="text-[0.6rem] font-semibold text-slate-500 uppercase tracking-[0.15em] -mt-0.5">
              Master Every Pattern
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <ul className="flex items-center gap-0.5 list-none">
          {pages.map((page) => (
            <li key={page.path}>
              <NavLink
                to={page.path}
                className={({ isActive }) =>
                  `relative text-[0.82rem] font-semibold no-underline py-2 px-3.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "text-violet-300 bg-violet-500/[0.12] shadow-[inset_0_1px_0_rgba(139,92,246,0.15)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{page.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_6px_rgba(139,92,246,0.4)]" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* Divider */}
          <li className="mx-2 w-px h-5 bg-white/[0.08]" aria-hidden="true" />

          {/* Logout */}
          <li>
            <button
              onClick={onLogout}
              className="group/logout text-[0.8rem] font-bold text-slate-400 hover:text-rose-300 bg-transparent hover:bg-rose-500/[0.08] py-2 px-3.5 rounded-xl border border-transparent hover:border-rose-500/20 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/logout:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
