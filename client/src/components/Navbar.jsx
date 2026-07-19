import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  Flame,
  BarChart3,
  Code2,
  User,
  LogOut,
  Command,
  Menu,
  X
} from "lucide-react";
import codingImg from "../assets/coding.jpeg";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const { user, setCommandPaletteOpen } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages = [
    { path: "/leetcode", label: "LeetCode Sync", icon: Flame, color: "text-amber-400 border-amber-500/40 bg-amber-950/40" },
    { path: "/analytics", label: "Analytics", icon: BarChart3, color: "text-[#22D3EE] border-cyan-500/40 bg-cyan-950/40" },
    { path: "/problems", label: "Problems & Tracker", icon: Code2, color: "text-blue-400 border-blue-500/40 bg-blue-950/40" },
    { path: "/profile", label: "Profile", icon: User, color: "text-purple-400 border-purple-500/40 bg-purple-950/40" },
  ];

  return (
    <nav className="bg-[#080d1a] border-b border-slate-800 sticky top-0 z-40 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <NavLink to="/leetcode" className="flex items-center gap-3 group shrink-0">
            <img
              src={codingImg}
              alt="DSA Tracker"
              className="w-9 h-9 rounded-none object-cover border-2 border-cyan-500/50"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                DSA Pattern Tracker
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-none text-sm sm:text-base font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? `${page.color} border-b-2 font-black shadow-md`
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
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-300 bg-[#0e1626] border border-slate-800 rounded-none hover:border-cyan-500/40 cursor-pointer"
            >
              <Command className="w-4 h-4 text-cyan-400" />
              <span>Search...</span>
              <kbd className="text-[0.68rem] bg-slate-900 text-slate-400 px-1.5 py-0.5 border border-slate-700 font-mono">
                Ctrl K
              </kbd>
            </button>

            {/* Profile Avatar / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2.5 p-1.5 rounded-none hover:bg-slate-800/60 text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-none bg-cyan-500 flex items-center justify-center text-sm font-black text-slate-950">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline text-sm font-extrabold text-slate-200">
                  {user?.name ? user.name.split(' ')[0] : "Coder"}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-none cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
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
        <div className="md:hidden bg-[#080d1a] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 w-full">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <NavLink
                key={page.path}
                to={page.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none ${
                    isActive ? `${page.color} border-l-4` : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
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
