import { NavLink } from "react-router-dom";
import codingImg from "../assets/coding.jpeg";

function Navbar({ onLogout }) {
  const pages = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/problems", label: "Problems" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="bg-[#0f1428]/85 backdrop-blur-[12px] border-b border-violet-500/30 py-3.5 px-6 sticky top-0 z-50">
      <div className="max-w-[920px] mx-auto flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <img
            src={codingImg}
            alt="DSA Tracker"
            className="w-9 h-9 rounded-lg object-cover border-2 border-violet-500/50 hover:border-violet-500/80 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-108 hover:-rotate-2"
          />
          <span className="text-[1.15rem] font-bold text-slate-200">DSA Pattern Tracker</span>
        </div>

        <ul className="flex items-center gap-1.5 list-none">
          {pages.map((page) => (
            <li key={page.path}>
              <NavLink
                to={page.path}
                className={({ isActive }) =>
                  `relative text-[0.85rem] font-medium text-slate-400 no-underline py-1.5 px-3.5 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-slate-200 hover:bg-violet-500/12 hover:-translate-y-px after:content-[''] after:absolute after:bottom-[-2px] after:h-[2px] after:bg-gradient-to-r after:from-violet-500 after:to-fuchsia-400 after:rounded-full after:transition-all after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isActive
                      ? "text-violet-300 font-semibold bg-violet-500/20 after:w-[70%] after:left-[15%]"
                      : "after:w-0 after:left-1/2 hover:after:w-[60%] hover:after:left-[20%]"
                  }`
                }
              >
                {page.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={onLogout}
              className="text-[0.85rem] font-semibold text-pink-400 hover:text-pink-200 bg-pink-500/15 hover:bg-pink-500/25 py-1.5 px-3.5 rounded-lg border-none cursor-pointer transition-all duration-300"
            >
              Logout
            </button>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
