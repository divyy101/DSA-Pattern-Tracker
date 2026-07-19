import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  LayoutDashboard,
  Code2,
  BarChart3,
  Flame,
  UserCheck,
  User,
  LogOut,
  Command,
  Bell,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import codingImg from "../assets/coding.jpeg";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const { user, leetcodeStats, setCommandPaletteOpen, themeMode, toggleTheme } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pages = [
    { path: "/", label: "Home", icon: Code2 },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/problems", label: "Problems", icon: Code2 },
    { path: "/leetcode", label: "LeetCode Sync", icon: Flame, badge: leetcodeStats?.totalSolved ? `${leetcodeStats.totalSolved}` : null },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/about", label: "About", icon: Sparkles },
  ];

  return (
    <nav className="bg-[#0B1120]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-3 group no-underline shrink-0">
            <div className="relative">
              <img
                src={codingImg}
                alt="DSA Tracker"
                className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0B1120]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight">
                DSA Pattern Tracker
              </span>
              <span className="text-[0.62rem] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
                Placement Mastery
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      isActive
                        ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.1)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{page.label}</span>
                  {page.badge && (
                    <span className="ml-0.5 text-[0.6rem] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {page.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Command className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">Search...</span>
              <kbd className="text-[0.65rem] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                Ctrl K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-fade-slide-up">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200">Activity Center</span>
                    <span className="text-[0.65rem] text-cyan-400 font-medium bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                      Live
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">Daily Coding Streak</p>
                        <p className="text-[0.7rem] text-slate-400">Keep solving 2 problems today to maintain your streak!</p>
                      </div>
                    </div>
                    {leetcodeStats?.lastSynced && (
                      <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-300 flex items-start gap-2">
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-200">LeetCode Synced</p>
                          <p className="text-[0.7rem] text-slate-400">Synced @ {new Date(leetcodeStats.lastSynced).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* User Profile Avatar / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                  {user?.name ? user.name.split(' ')[0] : "Student"}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fade-slide-up">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <NavLink
                key={page.path}
                to={page.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </div>
                {page.badge && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {page.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
