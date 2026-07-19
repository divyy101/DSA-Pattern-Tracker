import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  LayoutDashboard,
  Code2,
  User,
  LogOut,
  Command,
  Bell,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import codingImg from "../assets/coding.jpeg";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const { user, leetcodeStats, setCommandPaletteOpen } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages = [
    { path: "/", label: "Home", icon: Code2 },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/problems", label: "Problems", icon: Code2 },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/about", label: "About", icon: Sparkles },
  ];

  return (
    <nav className="bg-[#080d1a] border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={codingImg}
              alt="DSA Tracker"
              className="w-8 h-8 rounded-none object-cover border border-cyan-500/40"
            />
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                DSA Pattern Tracker
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-none text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                      isActive
                        ? "text-cyan-400 bg-cyan-950/60 border-b-2 border-cyan-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{page.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 bg-[#0e1626] border border-slate-800 rounded-none hover:border-cyan-500/40 cursor-pointer"
            >
              <Command className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search...</span>
              <kbd className="text-[0.65rem] bg-slate-900 text-slate-400 px-1 py-0.5 border border-slate-700 font-mono">
                Ctrl K
              </kbd>
            </button>

            {/* Profile Avatar / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1.5 rounded-none hover:bg-slate-800/60 text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-none bg-cyan-500 flex items-center justify-center text-xs font-black text-slate-950">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm font-bold text-slate-200">
                  {user?.name ? user.name.split(' ')[0] : "Coder"}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-none cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080d1a] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <NavLink
                key={page.path}
                to={page.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none ${
                    isActive ? "text-cyan-400 bg-cyan-950/60 border-l-4 border-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{page.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
